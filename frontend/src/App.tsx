import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AegisSystemProvider } from './state/AegisSystemContext';
import ParticleBackground from './components/ParticleBackground';
import Automation from './pages/Automation';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import Logs from './pages/Logs';
import Monitoring from './pages/Monitoring';
import Network from './pages/Network';
import Settings from './pages/Settings';
import Terminal from './pages/Terminal';
import './styles/aegis.css';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ParticleBackground />
      <AegisSystemProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/network" element={<Network />} />
          <Route path="/automation" element={<Automation />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/terminal" element={<Terminal />} />
        </Routes>
      </AegisSystemProvider>
    </Router>
  );
}

export default App;
