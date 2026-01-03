
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import Sync from './pages/Sync';
import Tests from './pages/Tests';
import Reports from './pages/Reports';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/student/:id" element={<StudentDetail />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/sync" element={<Sync />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
