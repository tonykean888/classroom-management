import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, message, Select, Space } from 'antd';
import { useQuery, useMutation,useLazyQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import moment from 'moment';

const { Option } = Select;
const GET_STUDENTS = gql`
  query GetStudents($search: String, $gradelevelid: Int) {
    students(search: $search, gradelevelid: $gradelevelid) {
			studentid
			firstname
			lastname
			birthdate
			gradelevel {
				gradelevelid
				levelname
			}
			gender {
				genderid
				gendername
			}
			prefix{
				prefixid
				prefixname
			}
    }
  }
`;

const GET_GENDERS = gql`
  query {
    genders {
      genderid
      gendername
    }
  }
`;

const GET_GRADELEVELS = gql`
  query {
    gradelevels {
      gradelevelid
      levelname
    }
  }
`;

const GET_PREFIXES = gql`
	query {
		prefixes {
			prefixid
			prefixname
		}
	}
`;

const DELETE_STUDENT = gql`
  mutation DeleteStudent($studentid: ID!) {
    deleteStudent(studentid: $studentid)
  }
`;

const CREATE_STUDENT = gql`
  mutation CreateStudent($input: CreateStudentInput!) {
    createStudent(input: $input) {
        studentid
        firstname
        lastname
        gradelevel {
					gradelevelid
					levelname
        }
        gender {
					genderid
					gendername
        }
        prefix {
					prefixid
					prefixname
        }
    }
  }
`;

const UPDATE_STUDENT = gql`
  mutation UpdateStudent($input: UpdateStudentInput!) {
    updateStudent(input: $input) {
      studentid
      firstname
      lastname
      gradelevel {
        gradelevelid
        levelname
      }
      gender {
        genderid
        gendername
      }
			prefix {
				prefixid
				prefixname
      }
    }
  }
`;

const StudentManagementPage: React.FC = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingStudent, setEditingStudent] = useState<any>(null);
	const [form] = Form.useForm();
  //const [search, setSearch] = useState('');
	const [searchValue, setSearchValue] = useState('');
  const [selectedGradelevel, setSelectedGradelevel] = useState<number | null>(null);

	//const { loading: studentsLoading, error: studentsError, data: studentsData, refetch } = useQuery(GET_STUDENTS);
	const [fetchStudents, { loading: studentsLoading, error: studentsError, data: studentsData }] = useLazyQuery(GET_STUDENTS);
	const { loading: gradelevelsLoading, data: gradelevelsData } = useQuery(GET_GRADELEVELS);
	const { loading: gendersLoading, data: gendersData } = useQuery(GET_GENDERS);
	const { loading: prefixesLoading, data: prefixesData } = useQuery(GET_PREFIXES);
	const [modal, contextHolder] = Modal.useModal();

	const [createStudent] = useMutation(CREATE_STUDENT, {
		onCompleted: () => {
			message.success('Student added successfully!');
			fetchStudents({ variables: { search: searchValue, gradelevelid: selectedGradelevel } });
			setIsModalVisible(false);
			form.resetFields();
		},
	});
	const [updateStudent] = useMutation(UPDATE_STUDENT, {
		onCompleted: () => {
			message.success('Student updated successfully!');
			fetchStudents({ variables: { search: searchValue, gradelevelid: selectedGradelevel } });
			setIsModalVisible(false);
			form.resetFields();
		},
	});
  const [deleteStudent] = useMutation(DELETE_STUDENT, {
    onCompleted: (data: any) => {
      if (data && data.deleteStudent === true) {
        message.success('Student deleted successfully!');
        fetchStudents({ variables: { search: searchValue, gradelevelid: selectedGradelevel } });
      } else {
				console.warn('Delete returned false or undefined:', data);
        message.error('Failed to delete student');
      }
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
      message.error('Error deleting student: ' + error.message);
    },
    update: (cache, { data }, { variables }) => {
      console.log('Update cache after deletion, data:', data, 'variables:', variables);
      if (data && data.deleteStudent) {
        cache.modify({
          fields: {
            students(existingStudents = [], { readField }) {
              return existingStudents.filter(
                (studentRef: any) => {
                  const id = readField('studentid', studentRef);
                  return id !== variables?.studentid;
                }
              );
            }
          }
        });
      }
    }
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchStudents({ variables: { search: searchValue, gradelevelid: selectedGradelevel } });
    }, 1000); // 1000ms delay

    return () => clearTimeout(handler);
  }, [searchValue, selectedGradelevel, fetchStudents]);
	
	const showModal = (student: any = null) => {
		setEditingStudent(student);
		if (student) {
      console.log('Setting form values for student:', student);
			form.setFieldsValue({
				prefixid: student.prefix ? student.prefix.prefixid : null,
				firstname: student.firstname,
      	lastname: student.lastname,
				birthdate: student.birthdate ? moment(student.birthdate) : null,
				gradelevelid: student.gradelevel ? student.gradelevel.gradelevelid : null,
				genderid: student.gender ? student.gender.genderid : null,
			});
		} else {
			form.resetFields();
		}
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		form.resetFields();
	};

  const handleDelete = (studentid: number) => {
    modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this student?',
      onOk: () => {
				console.log('Attempting to delete student with ID:', studentid);
       	deleteStudent({ variables: { studentid } });
      }
    });
  };

  const onFinish = (values: any) => {
    const input = {
      firstname: values.firstname,
      lastname: values.lastname,
      birthdate: values.birthdate ? values.birthdate.format('YYYY-MM-DD') : undefined,
      prefixid: values.prefixid ? parseInt(values.prefixid, 10) : undefined,
      gradelevelid: values.gradelevelid ? parseInt(values.gradelevelid, 10) : undefined,
      genderid: values.genderid ? parseInt(values.genderid, 10) : undefined,
    };
    if (editingStudent) {
      updateStudent({ 
        variables: { 
          input: { 
            studentid: parseInt(editingStudent.studentid, 10), 
            ...input 
          } 
        },
				onError: (error) => {
					console.error('Update error:', error);
					message.error('Failed to update student: ' + error.message);
      	} 
      });
    } else {
      createStudent({ 
				variables: { input },
				onError: (error) => {
					console.error('Create error:', error);
					message.error('Failed to create student: ' + error.message);
				}
			});
    }
  };

	const columns = [
		{
			title: 'Student ID',
			dataIndex: 'studentid',
			key: 'studentid',
		},
		{
			title: 'ชื่อ',
			dataIndex: 'firstname',
			key: 'firstname',
		},
		{
			title: 'นามสกุล',
			dataIndex: 'lastname',
			key: 'lastname',
		},
		{
			title: 'Gender',
			dataIndex: ['gender', 'gendername'],
			key: 'gendername',
		},
		{
			title: 'ชั้น',
			dataIndex: ['gradelevel', 'levelname'],
			key: 'gradelevel',
		},
		{
			title: 'Action',
			key: 'action',
			render: (text: any, record: any) => (
				<Space>
					<Button onClick={() => showModal(record)}>Edit</Button>
					<Button 
						danger 
						onClick={() => {
							console.log('Delete button clicked for student ID:', record.studentid);
							console.log('Student record:', record);
							handleDelete(record.studentid);
						}}
					>
						Delete
					</Button>
					  {contextHolder}
				</Space>
			),
		},
	];

	if (studentsLoading || gradelevelsLoading || gendersLoading || prefixesLoading) return <p>Loading...</p>;
	if (studentsError) return <p>Error : {studentsError.message}</p>;

	return (
		<div>
			<h1>Student Management</h1>
			<div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
				<Input.Search
          placeholder="Search by name..."
          onChange={e => setSearchValue(e.target.value)}
          value={searchValue} // Controlled component: bind value to state
          style={{ width: 300 }}
        />

        <Select
          placeholder="Select Grade Level"
          style={{ width: 200 }}
          allowClear
          onChange={value => setSelectedGradelevel(value)}
          value={selectedGradelevel} // Controlled component: bind value to state
        >
          {gradelevelsData?.gradelevels.map((gradelevel: any) => (
            <Option key={gradelevel.gradelevelid} value={gradelevel.gradelevelid}>
              {gradelevel.levelname}
            </Option>
          ))}
        </Select>
        <Button type="primary" onClick={() => showModal()}>
          Add Student
        </Button>
      </div>

			<Button type="primary" onClick={() => showModal()}>Add Student</Button>
			<Table dataSource={(studentsData as any)?.students || []} columns={columns} rowKey="studentid" loading={studentsLoading} />
			<Modal
				title={editingStudent ? "Edit Student" : "Add Student"}
				open={isModalVisible}
				onCancel={handleCancel}
				footer={null}
			>
				<Form form={form} onFinish={onFinish}>
					<Form.Item name="prefixid" label="ชื่อคำนำหน้า">
						<Select placeholder="Select a prefix">
							{(prefixesData as any)?.prefixes?.map((prefix: any) => (
								<Option key={prefix.prefixid} value={prefix.prefixid}>
									{prefix.prefixname}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name="firstname" label="ชื่อ" rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name="lastname" label="นามสกุล" rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name="birthdate" label="วันเกิด" rules={[{ required: true }]}>
						<DatePicker format="YYYY-MM-DD" />
					</Form.Item>
					<Form.Item name="gradelevelid" label="ชั้น">
						<Select placeholder="Select a grade level">
							{(gradelevelsData as any)?.gradelevels?.map((gradelevel: any) => (
								<Option key={gradelevel.gradelevelid} value={gradelevel.gradelevelid}>
									{gradelevel.levelname}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name="genderid" label="เพศ">
						<Select placeholder="Select gender">
							{(gendersData as any)?.genders?.map((gender: any) => (
								<Option key={gender.genderid} value={gender.genderid}>
									{gender.gendername}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">Submit</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default StudentManagementPage;