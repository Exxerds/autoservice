import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CrmAuthProvider } from './context/CrmAuthContext';

// Сайт
import Header from './components/site/Header';
import Footer from './components/site/Footer';
import Home from './pages/site/Home';
import Services from './pages/site/Services';
import Locations from './pages/site/Locations';
import Booking from './pages/site/Booking';
import Login from './pages/site/Login';
import Cabinet from './pages/site/Cabinet';

// CRM
import CrmLayout from './components/crm/CrmLayout';
import CrmLogin from './pages/crm/CrmLogin';
import Dashboard from './pages/crm/Dashboard';
import Leads from './pages/crm/Leads';
import LeadCard from './pages/crm/LeadCard';
import Tasks from './pages/crm/Tasks';

// Сайт + Header/Footer
function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CrmAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Сайт */}
            <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
            <Route path="/services" element={<SiteLayout><Services /></SiteLayout>} />
            <Route path="/locations" element={<SiteLayout><Locations /></SiteLayout>} />
            <Route path="/booking" element={<SiteLayout><Booking /></SiteLayout>} />
            <Route path="/login" element={<SiteLayout><Login /></SiteLayout>} />
            <Route path="/cabinet" element={<SiteLayout><Cabinet /></SiteLayout>} />

            {/* CRM */}
            <Route path="/crm/login" element={<CrmLogin />} />
            <Route path="/crm" element={<CrmLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="leads" element={<Leads />} />
              <Route path="leads/:id" element={<LeadCard />} />
              <Route path="tasks" element={<Tasks />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CrmAuthProvider>
    </AuthProvider>
  );
}

export default App;