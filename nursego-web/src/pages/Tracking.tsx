import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Activity, ArrowLeft, Navigation } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const mapContainerStyle = { width: '100%', height: '500px', borderRadius: '1rem' };
const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Default to Delhi

export default function Tracking() {
  const [user, setUser] = useState<any>(null);
  const [bookingStatus, setBookingStatus] = useState('Looking for nearby nurses...');
  const [nurseLocation, setNurseLocation] = useState(defaultCenter);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get('bookingId');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyD0zm_7Fy1g-MJ7UVZKvkjQfM_c3BTacX8'
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    if (!bookingId) return;

    // Connect to WebSocket Server
    const newSocket = io('https://nursenow.onrender.com');
    setSocket(newSocket);

    // Join patient room
    newSocket.emit('join_room', `patient_${parsedUser.id}`);
    newSocket.emit('join_room', `booking_${bookingId}`);

    // Listen for events
    newSocket.on('booking_accepted', (data) => {
      setBookingStatus(`Nurse ${data.nurseId} is on their way!`);
    });

    newSocket.on('nurse_location', (data) => {
      setNurseLocation({ lat: data.latitude, lng: data.longitude });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [navigate, bookingId]);

  if (!user || !isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 bg-white shadow-sm flex items-center px-8">
        <Link to="/dashboard" className="flex items-center text-slate-500 hover:text-blue-600">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Dashboard
        </Link>
        <div className="mx-auto flex items-center">
          <Activity className="h-6 w-6 text-blue-600 mr-2" />
          <span className="font-bold text-xl text-slate-900">Live Tracking</span>
        </div>
        <div className="w-16"></div>
      </header>

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center animate-pulse mr-4">
                <Navigation className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{bookingStatus}</h2>
                <p className="text-blue-600 font-medium mt-1">Booking ID: #{bookingId?.substring(0, 8)}</p>
              </div>
            </div>
          </div>

          <div className="border-4 border-slate-100 rounded-[1.5rem] overflow-hidden shadow-inner relative">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={nurseLocation}
              zoom={15}
              options={{ disableDefaultUI: true, zoomControl: true }}
            >
              <Marker position={nurseLocation} icon={{ url: 'https://cdn-icons-png.flaticon.com/512/3004/3004455.png', scaledSize: new window.google.maps.Size(40, 40) }} />
            </GoogleMap>
          </div>
        </div>
      </main>
    </div>
  );
}