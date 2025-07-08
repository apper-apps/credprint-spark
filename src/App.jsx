import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { UserProvider } from '@/contexts/UserContext';
import Layout from '@/components/organisms/Layout';
import Dashboard from '@/components/pages/Dashboard';
import EventManager from '@/components/pages/EventManager';
import EventDetail from '@/components/pages/EventDetail';
import AttendeeEditor from '@/components/pages/AttendeeEditor';
import TemplateDesigner from '@/components/pages/TemplateDesigner';
import PrintPreview from '@/components/pages/PrintPreview';
import Settings from '@/components/pages/Settings';
function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<EventManager />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/events/:eventId/attendees/:attendeeId" element={<AttendeeEditor />} />
            <Route path="/events/:eventId/template" element={<TemplateDesigner />} />
            <Route path="/events/:eventId/print" element={<PrintPreview />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
</Layout>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;