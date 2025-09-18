import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, Alert, Typography } from 'antd';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
  UserOutlined,
  TeamOutlined,
  HomeOutlined,
  PieChartOutlined
} from '@ant-design/icons';

const { Title } = Typography;

// GraphQL queries
const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    students {
      studentid
      firstname
      lastname
      gender {
        gendername
      }
      classrooms {
        classroomid
        classroom
        academicyear
      }
    }
    classrooms {
      classroomid
      classroom
      academicyear
      homeroomTeacher
    }
  }
`;

// Define types for our data
interface Student {
  studentid: number;
  firstname: string;
  lastname: string;
  gender?: {
    gendername: string;
  };
  classrooms?: { classroomid: number }[];
}

interface Classroom {
  classroomid: number;
  classroom: string;
  academicyear: string | number;
  homeroomTeacher: string;
}

interface DashboardData {
  students: Student[];
  classrooms: Classroom[];
}

interface ClassroomStat extends Classroom {
  studentCount: number;
}

interface DashboardStats {
  totalStudents: number;
  totalClassrooms: number;
  studentsWithClassroom: number;
  studentsWithoutClassroom: number;
  maleStudents: number;
  femaleStudents: number;
  classroomStats: ClassroomStat[];
}

const DashboardPage: React.FC = () => {
  const { loading, error, data } = useQuery<DashboardData>(GET_DASHBOARD_DATA);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalClassrooms: 0,
    studentsWithClassroom: 0,
    studentsWithoutClassroom: 0,
    maleStudents: 0,
    femaleStudents: 0,
    classroomStats: [],
  });

  useEffect(() => {
    if (data) {
      const students = data.students || [];
      const classrooms = data.classrooms || [];
      
      // Count students by gender
      let maleCount = 0;
      let femaleCount = 0;
      let withClassroomCount = 0;
      
      students.forEach((student) => {
        // Count by gender
        if (student.gender && student.gender.gendername === 'ชาย') {
          maleCount++;
        } else if (student.gender && student.gender.gendername === 'หญิง') {
          femaleCount++;
        }
        
        // Count students with classroom
        if (student.classrooms && student.classrooms.length > 0) {
          withClassroomCount++;
        }
      });
      
      // Count students per classroom
      const classroomStats = classrooms.map((classroom) => {
        const studentsInClassroom = students.filter((student) => 
          student.classrooms && 
          student.classrooms.some((c) => c.classroomid === classroom.classroomid)
        ).length;
        
        return {
          classroomid: classroom.classroomid,
          classroom: classroom.classroom,
          academicyear: classroom.academicyear,
          homeroomTeacher: classroom.homeroomTeacher,
          studentCount: studentsInClassroom
        };
      });
      
      setStats({
        totalStudents: students.length,
        totalClassrooms: classrooms.length,
        studentsWithClassroom: withClassroomCount,
        studentsWithoutClassroom: students.length - withClassroomCount,
        maleStudents: maleCount,
        femaleStudents: femaleCount,
        classroomStats
      });
    }
  }, [data]);
  
  const classroomColumns = [
    {
      title: 'ห้องเรียน',
      dataIndex: 'classroom',
      key: 'classroom',
    },
    {
      title: 'ปีการศึกษา',
      dataIndex: 'academicyear',
      key: 'academicyear',
    },
    {
      title: 'ครูประจำชั้น',
      dataIndex: 'homeroomTeacher',
      key: 'homeroomTeacher',
    },
    {
      title: 'จำนวนนักเรียน',
      dataIndex: 'studentCount',
      key: 'studentCount',
      sorter: (a: any, b: any) => a.studentCount - b.studentCount,
    },
  ];

  if (loading) return <Spin size="large" tip="กำลังโหลดข้อมูล..." style={{ margin: '100px auto', display: 'block' }} />;
  if (error) return <Alert message={`เกิดข้อผิดพลาด: ${error.message}`} type="error" />;

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ marginBottom: '30px', color: '#1890ff' }}>
        <PieChartOutlined /> รายงานข้อมูลนักเรียน
      </Title>
      
      {/* Main Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="นักเรียนทั้งหมด"
              value={stats.totalStudents}
              valueStyle={{ color: '#1890ff' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="ห้องเรียนทั้งหมด"
              value={stats.totalClassrooms}
              valueStyle={{ color: '#52c41a' }}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="นักเรียนชาย"
              value={stats.maleStudents}
              valueStyle={{ color: '#722ed1' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="นักเรียนหญิง"
              value={stats.femaleStudents}
              valueStyle={{ color: '#eb2f96' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
    </div>
  );
};

export default DashboardPage;