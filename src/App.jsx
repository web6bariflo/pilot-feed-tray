import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ImagePanel from './pages/ImagePanel';
import CycleControl from './pages/CycleControl';
import { useMqtt } from './store/MqttContext';
import FilterData from './pages/FilterData';

const App = () => {
  const { connectionStatus = 'disconnected' } = useMqtt();
  const isConnected = connectionStatus === 'connected';

  return (
    <Router>
      <nav className="bg-gray-800 p-4 text-white flex items-center justify-between">
        <div className="flex gap-4">
          <Link to="/image" className="hover:underline">Image Display Panel</Link>
          <Link to="/" className="hover:underline">Cycle Control Panel</Link>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            title={`MQTT status: ${connectionStatus}`}
          />
          <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </nav>

      <Routes>
        <Route path="/image" element={<ImagePanel />} />
        <Route
          path="/"
          element={
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-[73%] p-3  border-1 border-gray-300 rounded-xl">
                <CycleControl />
              </div>
              <div className="w-full md:w-[25%] p-2 md:p-4 overflow-auto border-l border-gray-300">
                <FilterData />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
