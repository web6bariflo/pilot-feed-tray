import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import ImagePanel from './pages/ImagePanel';
import CycleControl from './pages/CycleControl';
import { useMqtt } from './store/MqttContext';
import FilterData from './pages/FilterData';
import Login from './pages/Login';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

const AppLayout = ({ children }) => {
  const { connectionStatus = 'disconnected' } = useMqtt();
  const isConnected = connectionStatus === 'connected';

  return (
    <>
      <nav className="relative bg-gray-800 p-4 text-white flex items-center justify-between">
        {/* Left - Nav Links */}
        <div className="flex gap-4">
          <NavLink
            to="/pilotfeedtraydashboard/image"
            end
            className={({ isActive }) =>
              `px-3 py-1 rounded-md transition ${isActive ? 'bg-gray-500' : 'bg-gray-700 hover:bg-gray-600'
              }`
            }
          >
            Image Display Panel
          </NavLink>

          <NavLink
            to="/pilotfeedtraydashboard"
            end
            className={({ isActive }) =>
              `px-3 py-1 rounded-md transition ${isActive ? 'bg-gray-500' : 'bg-gray-700 hover:bg-gray-600'
              }`
            }
          >
            Cycle Control Panel
          </NavLink>
        </div>

        {/* Center - Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold tracking-widest text-white ">
          Pilot Feed Tray
        </div>


        {/* Right - Connection Status */}
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

      {children}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/pilotfeedtraydashboard"
          element={
            <PrivateRoute>
              <AppLayout>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-[73%] p-3 border-1 border-gray-300 rounded-xl">
                    <CycleControl />
                  </div>
                  <div className="w-full md:w-[25%] p-2 md:p-4 overflow-auto border-l border-gray-300">
                    <FilterData />
                  </div>
                </div>
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pilotfeedtraydashboard/image"
          element={
            <PrivateRoute>
              <AppLayout>
                <ImagePanel />
              </AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;