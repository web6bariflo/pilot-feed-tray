import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMqtt } from '../store/MqttContext';

const CycleControl = () => {
  const [input, setInput] = useState('');
  const [baseValue, setBaseValue] = useState('');
  const [cycleData, setCycleData] = useState([]);

  const apiurl = "http://192.168.31.27:8000";

  const { publishMessage } = useMqtt();

  const handleSubmit = async (e) => {

     publishMessage("456/data", input);

    e.preventDefault();
    try {
      await axios.post(`${apiurl}/pilot_feedtray_view/`, { value: input });
      console.log("data posted successfully");
      setInput('');
      getLogData();
    } catch (error) {
      console.log('Error posting data', error);
      if (error.response && error.response.data && error.response.data.available !== undefined) {
        const remainingValue = error.response.data.available;
        toast.error(`Input value exceeds remaining value! Remaining value is ${remainingValue}`);
      } else {
        toast.error('Error posting data');
      }
    }
  };

  const getLogData = async () => {
    try {
      const response = await axios.get(`${apiurl}/get_recent_cycle_data/`);
      const data = response.data.data;
      setCycleData(data);
      if (data.length > 0) {
        setBaseValue(data[0].base_value);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error('Error fetching data', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    getLogData();
  }, []);

  const handleStop = () => {
  toast("Process stopped");
  publishMessage("123/data", "stop");
};

  // Desired column order
  const columns = ['cycle_count', 'base_value', 'intial_value', 'cycle_value', 'remaining_value', 'timestamp'];

  return (
    <div className=" max-w-4xl mx-auto rounded-xl">
      <div className=" flex flex-row justify-between mb-6 p-4 bg-indigo-100 rounded-lg">
        <h2 className="text-xl font-semibold text-indigo-800">Current Base Value</h2>
        <p className="text-3xl font-bold text-indigo-600">{baseValue}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg flex-grow focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter data"
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 px-4 rounded-lg hover:bg-green-600 transition-colors shadow-md"
        >
          Post
        </button>
        <button
          type="button"
          onClick={handleStop}
          className="bg-red-500 text-white p-2 px-4 rounded-lg hover:bg-red-600 transition-colors shadow-md"
        >
          Stop
        </button>
      </form>

      {/* Table Section */}
      {cycleData.length > 0 && (
        <div className="overflow-auto rounded-lg shadow-md md:max-h-[440px]">
          <table className="min-w-full bg-white shadow-md">
            <thead className="bg-gray-800 text-white">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="py-3 px-3 text-center capitalize ">
                    {col.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cycleData.map((item, index) => (
                <tr key={index} className='text-center'>
                  {columns.map((col) => {
                    if (col === 'timestamp') {
                      const date = new Date(item[col]);
                      const formatted = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`;
                      return <td key={col} className="py-3 px-4">{formatted}</td>;
                    } else {
                      return <td key={col} className="py-3 px-4">{item[col] ?? '0'}</td>;
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CycleControl;