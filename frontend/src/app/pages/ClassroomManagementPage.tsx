import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { useQuery, useMutation,useLazyQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import moment from 'moment';

const GET_CLASSROOMS = gql`
  query {
      classrooms{
        homeroomTeacher
        classroomid
        academicyear
        classroom
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
const ClassroomManagementPage: React.FC = () => {

  const { loading, error, data, refetch } = useQuery(GET_CLASSROOMS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<any>(null);
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();

  const [createClassroom] = useMutation(CREATE_CLASSROOM, {
    onCompleted: () => {
      message.success('Classroom added successfully!');
      refetch();
      setIsModalVisible(false);
      form.resetFields();
    },
  });

  const [updateClassroom] = useMutation(UPDATE_CLASSROOM, {
    onCompleted: () => {
      message.success('Classroom updated successfully!');
      refetch();
      setIsModalVisible(false);
      form.resetFields();
    },
  });

  const [deleteClassroom] = useMutation(DELETE_CLASSROOM, {
    onCompleted: () => {
      message.success('Classroom deleted successfully!');
      refetch();
    },
  });

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
      updateClassroom({ variables: { input: { classroomid: parseInt(editingClassroom.classroomid, 10), ...values } } });
    } else {
      createClassroom({ variables: { input: values } });
    }
  };

  const handleDelete = (classroomid: number) => {
    console.log('Attempting to delete classroom with ID:', classroomid);
    console.log(typeof (classroomid));
    parseInt(classroomid.toString(), 10);
    modal.confirm({
      title: 'Are you sure you want to delete this classroom?',
      content: 'This action cannot be undone.',
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
          {contextHolder}
        </>
      ),
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      <h1>Classroom Management</h1>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => showModal()}>
        Add Classroom
      </Button>
      <Table dataSource={data.classrooms} columns={columns} rowKey="classroomid" />

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
    </div>
  );
};

export default ClassroomManagementPage;