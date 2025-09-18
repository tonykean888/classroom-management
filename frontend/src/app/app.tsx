import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import StudentManagementPage from './pages/StudentManagementPage';
import ClassroomManagementPage from './pages/ClassroomManagementPage';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:3000/graphql' }), // URL ของ GraphQL Backend
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="students" element={<StudentManagementPage />} />
            <Route path="classrooms" element={<ClassroomManagementPage />} />
            {/* Add a Route for Classroom in the next Story */}
          </Route>
        </Routes>
      </Router>
    </ApolloProvider>
  );
};

export default App;
