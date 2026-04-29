/* ── AegisX App Root ── */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { FloatingAssistant } from './pages/FloatingAssistant';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/floating" element={<FloatingAssistant />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
