import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Stethoscope, FileText, Pill, LogOut, ChevronRight, Syringe, MapPin, Clock } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { io, Socket } from 'socket.io-client';

const mapContainerStyle = { width: '100%', height: '300px', borderRadius: '1rem' };
const defaultCenter = { lat: 28.6139, lng: 77.2090 };

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings'>('dashboard');
  const [patientLocation, setPatientLocation] = useState(defaultCenter);
  const [nearbyNurses, setNearbyNurses] = useState<Record<string, {lat: number, lng: number}>>({});
  
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyD0zm_7Fy1g-MJ7UVZKvkjQfM_c3BTacX8'
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const userToken = localStorage.getItem('token');
    if (!userData || !userToken) {
      navigate('/login');
      return;
    } 
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setToken(userToken);

    // Get patient's live location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPatientLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => console.error("Location error:", err),
        { enableHighAccuracy: true }
      );
    }

    // Connect to WebSocket for nearby nurses
    const socket = io('https://nursenow.onrender.com');
    socket.emit('join_global_patients');
    
    socket.on('nearby_nurse_update', (data) => {
      setNearbyNurses(prev => ({
        ...prev,
        [data.nurseId]: { lat: data.latitude, lng: data.longitude }
      }));
    });

    // Fetch dynamic services
    fetch('https://nursenow.onrender.com/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setServices(data.data);
        }
      })
      .catch(err => console.error('Failed to load services', err));

    // Fetch patient bookings
    if (userToken) {
      fetch('https://nursenow.onrender.com/api/bookings/patient', {
        headers: { 'Authorization': `Bearer ${userToken}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setBookings(data.bookings);
          }
        })
        .catch(err => console.error('Failed to load bookings', err));
    }

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Activity className="h-6 w-6 text-blue-600 mr-2" />
          <span className="font-bold text-xl text-slate-900">NurseGo</span>
        </div>
        <div className="flex-1 py-6 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Activity className="h-5 w-5 mr-3" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'bookings' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <FileText className="h-5 w-5 mr-3" /> My Bookings
          </button>
        </div>
        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center px-4 py-2 text-slate-600 hover:text-red-600 font-medium w-full">
            <LogOut className="h-5 w-5 mr-3" /> Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 md:hidden">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-blue-600 mr-2" />
            <span className="font-bold text-xl text-slate-900">NurseGo</span>
          </div>
          <button onClick={handleLogout} className="text-slate-500"><LogOut className="h-5 w-5" /></button>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'dashboard' ? (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user.name.split(' ')[0]}!</h1>
                  <p className="text-slate-500 mt-2">What healthcare service do you need today?</p>
                </div>

                {isLoaded && (
                  <div className="mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm font-bold text-slate-800 text-sm flex items-center">
                      <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                      {Object.keys(nearbyNurses).length} Nurses Nearby
                    </div>
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={patientLocation}
                      zoom={14}
                      options={{ disableDefaultUI: true, zoomControl: true }}
                    >
                      {/* Patient Marker */}
                      <Marker position={patientLocation} icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }} />
                      
                      {/* Nearby Nurses Markers */}
                      {Object.values(nearbyNurses).map((loc, idx) => (
                        <Marker key={idx} position={loc} icon={{ url: 'https://cdn-icons-png.flaticon.com/512/3004/3004455.png', scaledSize: new window.google.maps.Size(30, 30) }} />
                      ))}
                    </GoogleMap>
                  </div>
                )}

                <h2 className="text-xl font-bold text-slate-900 mb-4">Available Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {services.map(service => (
                    <Link to={`/checkout?serviceId=${service.id}&name=${encodeURIComponent(service.name)}&price=${service.basePrice}`} key={service.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between">
                      <div>
                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Syringe className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{service.name}</h3>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-bold text-blue-600 text-xl">₹{service.basePrice}</span>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                      </div>
                    </Link>
                  ))}
                  {services.length === 0 && (
                    <p className="text-slate-500 col-span-3">Loading services from backend...</p>
                  )}
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
                  <div className="mb-6 md:mb-0">
                    <h2 className="text-2xl font-bold mb-2">Need a quick consultation?</h2>
                    <p className="text-blue-100 max-w-md">Connect with a certified nurse online before booking a home visit.</p>
                  </div>
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">Chat Now</button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
                  <p className="text-slate-500 mt-2">Track and view your healthcare service history.</p>
                </div>

                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
                      <p className="text-slate-500">You don't have any bookings yet.</p>
                    </div>
                  ) : (
                    bookings.map(booking => (
                      <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-slate-900">{booking.serviceName}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                              booking.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' :
                              booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex items-center text-slate-500 text-sm gap-4">
                            <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {new Date(booking.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {booking.distance} km</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right mr-4">
                            <p className="text-xs text-slate-500 uppercase font-bold">Paid</p>
                            <p className="text-lg font-bold text-slate-900">₹{booking.totalAmount}</p>
                          </div>
                          {(booking.status === 'PENDING' || booking.status === 'ACCEPTED' || booking.status === 'IN_PROGRESS') && (
                            <Link 
                              to={`/tracking?bookingId=${booking.id}`}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
                            >
                              Track Live
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}