import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Select } from 'antd';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';

const GET_CLASSROOMS = gql`
  query {
      classrooms{
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

// Mutation สำหรับการลบข้อมูล
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

  // Define types to help with TypeScript
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

  const { data, refetch: refetchClassrooms } = useQuery(GET_CLASSROOMS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);

  const { loading: classroomsLoading, error: classroomsError } = useQuery(GET_CLASSROOMS);
  const { data: studentsWithoutClassroomData, refetch: refetchStudents } = useQuery<StudentsWithoutClassroomData>(GET_STUDENTS_WITHOUT_CLASSROOM);
  const { data: allStudentsData, refetch: refetchAllStudents } = useQuery<AllStudentsData>(GET_ALL_STUDENTS);
  
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
      // Display error message if the mutation fails
      message.error(`Failed to add student: ${error.message}`);
      // Refetch data to ensure UI is in sync with server
      refetchStudents();
      refetchAllStudents();
      refetchClassrooms();
    }
  });

  const [removeStudent] = useMutation(REMOVE_STUDENT_FROM_CLASSROOM, {
    onCompleted: (_data, options: any) => {
      message.success('Student removed from classroom successfully!');
      
      // Get the studentId that was removed
      const studentId = options?.variables?.studentid;
      
      // Update the local state immediately
      if (selectedClassroom && studentId) {
        setSelectedClassroom({
          ...selectedClassroom,
          students: (selectedClassroom.students || []).filter(
            (s: any) => Number(s.studentid) !== Number(studentId)
          )
        });
      }
      
      // Also refetch the data to ensure everything is in sync
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
      
      // Update UI optimistically before the server responds
      if (studentToAdd) {
        // Add student to current students list
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
    
    // Update UI optimistically
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
            classroomid: editingClassroom.classroomid, 
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

  if (classroomsLoading) return <p>Loading...</p>;
  if (classroomsError) return <p>Error : {classroomsError.message}</p>;

  return (
    <div>
      <h1>Classroom Management</h1>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => showModal()}>
        Add Classroom
      </Button>
      <Table dataSource={(data as any)?.classrooms} columns={columns} rowKey="classroomid" />

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