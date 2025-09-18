import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, message, Select ,Spin} from 'antd';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
const GET_CLASSROOMS = gql`
  query {
    classrooms {
      homeroomTeacher
      classroomid
      academicyear
      classroom
      students {
        studentid
        firstname
        lastname
      }
    }
  }
`;

const CREATE_CLASSROOM = gql`
  mutation CreateClassroom($input: CreateClassroomInput!) {
    createClassroom(input: $input) {
      classroomid
    }
  }
`;

const UPDATE_CLASSROOM = gql`
  mutation UpdateClassroom($input: UpdateClassroomInput!) {
    updateClassroom(input: $input) {
      classroomid
    }
  }
`;

// We'll use client-side filtering instead of a separate query

const DELETE_CLASSROOM = gql`
  mutation DeleteClassroom($classroomid: Int!) {
    deleteClassroom(classroomid: $classroomid) {
      classroomid
    }
  }
`;

const GET_STUDENTS_WITHOUT_CLASSROOM = gql`
  query {
    studentsWithoutClassroom {
      studentid
      firstname
      lastname
    }
  }
`;

const GET_ALL_STUDENTS = gql`
  query {
    students {
      studentid
      firstname
      lastname
      classrooms {
        classroomid
      }
    }
  }
`;

const ADD_STUDENT_TO_CLASSROOM = gql`
  mutation AddStudentToClassroom($classroomid: Int!, $studentid: Int!) {
    addStudentToClassroom(classroomid: $classroomid, studentid: $studentid) {
      classroomid
    }
  }
`;

const REMOVE_STUDENT_FROM_CLASSROOM = gql`
  mutation RemoveStudentFromClassroom($classroomid: Int!, $studentid: Int!) {
    removeStudentFromClassroom(classroomid: $classroomid, studentid: $studentid) {
      classroomid
    }
  }
`;

const ClassroomManagementPage: React.FC = () => {


  type Student = {
    studentid: number;
    firstname: string;
    lastname: string;
    classrooms?: { classroomid: number }[];
  };

  type Classroom = {
    classroomid: number;
    academicyear: string;
    classroom: string;
    homeroomTeacher: string;
    students: Student[];
  };

  type StudentsWithoutClassroomData = {
    studentsWithoutClassroom: Student[];
  };

  type AllStudentsData = {
    students: Student[];
  };
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState('');
  const [modal, contextHolder] = Modal.useModal();
  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);

  const { data: studentsWithoutClassroomData, refetch: refetchStudents } = useQuery<StudentsWithoutClassroomData>(GET_STUDENTS_WITHOUT_CLASSROOM);
  const { data: allStudentsData, refetch: refetchAllStudents } = useQuery<AllStudentsData>(GET_ALL_STUDENTS);
  const { loading: classroomsLoading, data: classroomsData, error: classroomsError, refetch: refetchClassrooms } = useQuery(GET_CLASSROOMS);
  
  // Client-side filtering for classrooms based on search value
  const filteredClassrooms = useMemo(() => {
    if (!classroomsData?.classrooms || !searchValue) {
      return classroomsData?.classrooms || [];
    }
    
    const searchLower = searchValue.toLowerCase();
    return classroomsData.classrooms.filter((classroom: any) => 
      classroom.classroom.toLowerCase().includes(searchLower) || 
      classroom.homeroomTeacher.toLowerCase().includes(searchLower) ||
      classroom.classroomid.toString().includes(searchLower)
    );
  }, [classroomsData, searchValue]);


  const [addStudent] = useMutation(ADD_STUDENT_TO_CLASSROOM, {
    onCompleted: () => {
      message.success('Student added to classroom successfully!');
      
      // Refetch all student data to update the dropdown options
      refetchStudents();
      refetchAllStudents();
      
      // After refetching, update the selectedClassroom with the updated data
      refetchClassrooms().then((result: any) => {
        const classrooms = result?.data?.classrooms || [];
        const updatedClassroom = classrooms.find(
          (c: any) => Number(c.classroomid) === Number(selectedClassroom?.classroomid)
        );
        
        if (updatedClassroom) {
          setSelectedClassroom(updatedClassroom);
        }
      });
    },
    onError: (error) => {
      message.error(`Failed to add student: ${error.message}`);
      refetchStudents();
      refetchAllStudents();
      refetchClassrooms();
    }
  });

  const [removeStudent] = useMutation(REMOVE_STUDENT_FROM_CLASSROOM, {
    onCompleted: (_data, options: any) => {
      message.success('Student removed from classroom successfully!');

      const studentId = options?.variables?.studentid;
      if (selectedClassroom && studentId) {
        setSelectedClassroom({
          ...selectedClassroom,
          students: (selectedClassroom.students || []).filter(
            (s: any) => Number(s.studentid) !== Number(studentId)
          )
        });
      }
      refetchClassrooms();
      refetchStudents();
      refetchAllStudents();
    },
    onError: (error) => {
      message.error(`Failed to remove student: ${error.message}`);
      refetchStudents();
      refetchAllStudents();
      refetchClassrooms();
    }
  });
  
  const [createClassroom] = useMutation(CREATE_CLASSROOM, {
    onCompleted: () => {
      message.success('Classroom added successfully!');
      refetchClassrooms();
      setIsModalVisible(false);
      form.resetFields();
    },
  });

  const [updateClassroom] = useMutation(UPDATE_CLASSROOM, {
    onCompleted: () => {
      message.success('Classroom updated successfully!');
      refetchClassrooms();
      setIsModalVisible(false);
      form.resetFields();
    },
  });

  const [deleteClassroom] = useMutation(DELETE_CLASSROOM, {
    onCompleted: () => {
      message.success('Classroom deleted successfully!');
      refetchClassrooms();
    },
  });

   const showStudentModal = (classroom: any) => {
    setSelectedClassroom(classroom);
    setIsStudentModalVisible(true);
  };

  const handleStudentModalCancel = () => {
    setIsStudentModalVisible(false);
  };

  const handleAddStudent = (studentid: string | number) => {
    console.log('Adding student with ID:', studentid, 'Type:', typeof studentid);
    const studentIdNumber = typeof studentid === 'string' ? parseInt(studentid, 10) : studentid;
    
    if (!selectedClassroom) return;
    
    const classroomIdNumber = parseInt(String(selectedClassroom.classroomid), 10);
    console.log('Converted IDs - classroom:', classroomIdNumber, 'student:', studentIdNumber);
    

    if (studentsWithoutClassroomData && studentsWithoutClassroomData.studentsWithoutClassroom) {
      const studentToAdd = studentsWithoutClassroomData.studentsWithoutClassroom.find(
        (s) => Number(s.studentid) === Number(studentIdNumber)
      );

      if (studentToAdd) {
        setSelectedClassroom({
          ...selectedClassroom,
          students: [...(selectedClassroom.students || []), studentToAdd]
        });
      }
    }
    
    // Send the mutation to the server
    addStudent({ 
      variables: { 
        classroomid: classroomIdNumber, 
        studentid: studentIdNumber 
      } 
    });
  };

  const handleRemoveStudent = (studentid: string | number) => {
    console.log('Removing student with ID:', studentid, 'Type:', typeof studentid);
    const studentIdNumber = typeof studentid === 'string' ? parseInt(studentid, 10) : studentid;
    
    if (!selectedClassroom) return;
    const classroomIdNumber = parseInt(String(selectedClassroom.classroomid), 10);
    setSelectedClassroom({
      ...selectedClassroom,
      students: (selectedClassroom.students || []).filter(
        (s) => Number(s.studentid) !== Number(studentIdNumber)
      )
    });
    
    removeStudent({ 
      variables: { 
        classroomid: classroomIdNumber, 
        studentid: studentIdNumber 
      } 
    });
  };

  // Simple useEffect for search with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      console.log("Searching for:", searchValue);
    }, 700);
    
    return () => clearTimeout(handler);
  }, [searchValue]);


  const showModal = (classroom = null) => {
    setEditingClassroom(classroom);
    if (classroom) {
      form.setFieldsValue(classroom);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = (values: any) => {
    if (editingClassroom) {
      updateClassroom({ 
        variables: { 
          input: { 
            classroomid: parseInt(editingClassroom.classroomid.toString(), 10), 
            ...values 
          } 
        } 
      });
    } else {
      createClassroom({ variables: { input: values } });
    }
  };

  const handleDelete = (classroomid: number) => {
    console.log('Attempting to delete classroom with ID:', classroomid);
    console.log(typeof (classroomid));
    parseInt(classroomid.toString(), 10);
    modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this classroom?',
      onOk() {
        deleteClassroom({ variables: { classroomid: parseInt(classroomid.toString(), 10) } });
      },
    });
  };

  const columns = [
    {
      title: 'เลขที่ห้อง',
      dataIndex: 'classroomid',
      key: 'classroomid',
    },
    {
      title: 'ปีการศึกษา',
      dataIndex: 'academicyear',
      key: 'academicyear',
    },

    {
      title: 'ชื่อห้อง',
      dataIndex: 'classroom',
      key: 'classroom',
    },
    {
      title: 'ชื่อครูประจำชั้น',
      dataIndex: 'homeroomTeacher',
      key: 'homeroomTeacher',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <>
          <Button onClick={() => showModal(record)}>Edit</Button>
          <Button 
            onClick={() => handleDelete(record.classroomid)} 
            danger 
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
          <Button onClick={() => showStudentModal(record)} style={{ marginLeft: 8 }}>
            Manage Students
          </Button>
          {contextHolder}
        </>
      ),
    },
  ];

  if (classroomsLoading) return <Spin size="large" tip="กำลังโหลดข้อมูล..." style={{ margin: '100px auto', display: 'block' }} />;
  if (classroomsError) return <p>Error : {classroomsError.message}</p>;

  return (
    <div>
      <h1>จัดการห้องเรียน</h1>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Input.Search
                placeholder="Search by name..."
                onChange={e => setSearchValue(e.target.value)}
                value={searchValue} // Controlled component: bind value to state
                style={{ width: 300 }}
              />
        <Button type="primary" style={{ marginBottom: 16 }} onClick={() => showModal()}>
          Add Classroom
        </Button>
      </div>

      <Table 
        dataSource={
          searchValue 
            ? filteredClassrooms
            : (classroomsData as any)?.classrooms || []
        } 
        columns={columns} 
        rowKey="classroomid" 
        loading={classroomsLoading}
      />

      <Modal
        title={editingClassroom ? "Edit Classroom" : "Add Classroom"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="academicyear" label="ปีการศึกษา" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="homeroomTeacher" label="ชื่อครูประจำชั้น" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="classroom" label="ชื่อห้อง" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Manage Students in ${selectedClassroom?.classroom || ''}`}
        open={isStudentModalVisible}
        onCancel={handleStudentModalCancel}
        footer={null}
        width={700}
      >
        <h4>Current Students</h4>
        <Table
          dataSource={selectedClassroom?.students || []}
          columns={[
            { title: 'Name', render: (text: any, record: any) => `${record.firstname} ${record.lastname}` },
            { 
              title: 'Action', 
              render: (text: any, record: any) => (
                <Button onClick={() => handleRemoveStudent(record.studentid)} danger>Remove</Button>
              )
            }
          ]}
          rowKey="studentid"
          pagination={false}
        />

        <h4 style={{ marginTop: 20 }}>Add Student</h4>
        <Select 
          placeholder="Select a student to add" 
          style={{ width: '100%' }}
          onChange={handleAddStudent}
          value={undefined} 
          options={
            studentsWithoutClassroomData?.studentsWithoutClassroom
              ?.filter(student => {
                // Check if student is already in the current classroom
                const inCurrentClassroom = selectedClassroom?.students?.some(
                  classroomStudent => Number(classroomStudent.studentid) === Number(student.studentid)
                );
                
                // Check if student is in any classroom based on the allStudentsData
                const inAnyClassroom = allStudentsData?.students?.some(
                  s => Number(s.studentid) === Number(student.studentid) && 
                       (s.classrooms && s.classrooms.length > 0)
                );
                
                // Only show students that are not in any classroom
                return !inCurrentClassroom && !inAnyClassroom;
              })
              .map(student => ({
                key: student.studentid,
                value: Number(student.studentid),
                label: `${student.firstname} ${student.lastname}`
              }))
          }
        />
      </Modal>

    </div>
  );
};

export default ClassroomManagementPage;