import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiDownload } from "react-icons/fi";

const ImagePanel = () => {
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.31.149:8000/ws/thermal-images/");
    setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);

    socket.onopen = () => {
      console.log("WebSocket Connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket Message Received:", data);

        if (
          data.type === "thermal_images" &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          setImageData(data.data);
        }
      } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleCapture = () => {
    console.log("Capture button clicked (MQTT removed)");
  };

  const handleAutoCapture = () => {
    console.log("Auto Capture button clicked (MQTT removed)");
  };

  const handleDownloadAll = async () => {
    try {
      const response = await axios.post(
        "http://192.168.31.149:8000/download_all_thermal_images/",
        null,
        { responseType: "blob" }
      );

      const fileURL = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "thermal_images.zip";
      link.click();
      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("Error during downloading thermal images:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full space-y-6 mt-4 px-4 max-w-screen-xl mx-auto">
      {/* Buttons Section */}
      <div className="flex flex-col justify-center items-center gap-6">
        <div className="flex flex-row flex-wrap justify-center gap-6">
          <button
            onClick={handleCapture}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transform transition duration-300 ease-in-out"
          >
            Capture
          </button>
          <button
            onClick={handleAutoCapture}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transform transition duration-300 ease-in-out"
          >
            Auto Capture
          </button>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleDownloadAll}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transform transition duration-300 ease-in-out"
          >
            Download All
          </button>
        </div>
      </div>

      {/* Gallery View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 w-full">
        {imageData
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((img, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-full bg-white rounded-2xl shadow-xl transition hover:shadow-2xl p-2"
            >
              <div className="rounded-xl overflow-hidden border-4 border-gray-200">
                <img
                  src={`data:image/png;base64,${img.thermal_image}`}
                  alt={`Thermal Image ${index + 1}`}
                  className="object-cover w-full h-auto transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between mt-3 mb-1 w-full px-1 text-xs text-gray-700 font-medium">
                <div className="bg-gray-200 px-2 py-1 rounded-md shadow-sm">
                  {new Date(img.created_at).toLocaleString()}
                </div>
                <button
                  onClick={() => {
                    const base64Data = img.thermal_image;
                    const fileName = `thermal_image_${index + 1}.png`;
                    const url = `data:image/png;base64,${base64Data}`;
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = fileName;
                    link.click();
                  }}
                  className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md shadow-sm transition duration-200"
                >
                  <FiDownload className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ImagePanel;