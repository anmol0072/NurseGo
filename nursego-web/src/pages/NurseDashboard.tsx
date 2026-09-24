import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, LogOut, MapPin, CheckCircle, Clock, Navigation } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

export default function NurseDashboard() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [activeJob, setActiveJob] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const locationInterval = useRef<NodeJS.Timeout | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const userToken = localStorage.getItem('token');
    
    if (!userData || !userToken) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'NURSE') {
      navigate('/dashboard');
      return;
    }
    
    setUser(parsedUser);
    setToken(userToken);

    // Initial Fetch for available jobs
    fetch('https://nursenow.onrender.com/api/bookings/available', {
      headers: { 'Authorization': `Bearer ${userToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setAvailableJobs(data.bookings);
      })
      .catch(console.error);

    // Setup Socket
    const newSocket = io('https://nursenow.onrender.com');
    setSocket(newSocket);

    newSocket.emit('join_room', 'nurses');

    newSocket.on('new_booking', (booking) => {
      setAvailableJobs(prev => [booking, ...prev]);
    });

    newSocket.on('booking_removed', (bookingId) => {
      setAvailableJobs(prev => prev.filter(b => b.id !== bookingId));
    });

    // Broadcast idle location
    let idleInterval: NodeJS.Timeout;
    if (navigator.geolocation) {
      idleInterval = setInterval(() => {
        if (!activeJob) { // Only broadcast idle if not on an active job
          navigator.geolocation.getCurrentPosition((position) => {
            newSocket.emit('idle_nurse_location', {
              nurseId: parsedUser.id,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          });
        }
      }, 5000);
    }

    return () => {
      if (idleInterval) clearInterval(idleInterval);
      if (locationInterval.current) clearInterval(locationInterval.current);
      newSocket.disconnect();
    };
  }, [navigate, activeJob]);

  const handleAcceptJob = async (jobId: string) => {
    try {
      const res = await fetch(`https://nursenow.onrender.com/api/bookings/${jobId}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        const acceptedJob = availableJobs.find(j => j.id === jobId);
        setActiveJob(acceptedJob);
        setAvailableJobs([]);
        
        // Start streaming location
        if (socket) {
          socket.emit('join_room', `booking_${jobId}`);
          
          if (navigator.geolocation) {
            locationInterval.current = setInterval(() => {
              navigator.geolocation.getCurrentPosition((position) => {
                socket.emit('update_nurse_location', {
                  bookingId: jobId,
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                });
              }, (err) => console.error("Location error:", err), 
              { enableHighAccuracy: true });
            }, 5000);
          } else {
            alert('Geolocation is not supported by your browser');
          }
        }
      }
    } catch (err) {
      console.error(err);
      alert('Failed to accept job');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 shadow-sm hidden md:flex flex-col text-white">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Activity className="h-6 w-6 text-green-400 mr-2" />
          <span className="font-bold text-xl text-white">Nurse Portal</span>
        </div>
        <div className="flex-1 py-6 px-4 space-y-2">
          <a href="#" className="flex items-center px-4 py-3 bg-slate-800 text-green-400 rounded-lg font-medium">
            <Activity className="h-5 w-5 mr-3" /> Job Board
          </a>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center px-4 py-2 text-slate-400 hover:text-white font-medium w-full">
            <LogOut className="h-5 w-5 mr-3" /> Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <div>
            <h2 className="font-bold text-slate-900">Duty Roster</h2>
          </div>
          <div className="flex items-center">
            <span className="flex h-3 w-3 relative mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-slate-600">Online & Ready</span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {activeJob ? (
              <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-8">
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Navigation className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Active Duty</h2>
                    <p className="text-green-600 font-medium flex items-center">
                      <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                      Broadcasting Live Location
                    </p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6">
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{activeJob.serviceName}</h3>
                  <div className="flex items-center text-slate-600 mb-2">
                    <MapPin className="h-5 w-5 mr-2 text-slate-400" />
                    Patient Location (GPS)
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Clock className="h-5 w-5 mr-2 text-slate-400" />
                    Requested just now
                  </div>
                </div>
                
                <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                  Mark Job as Completed
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Available Jobs near you</h1>
                
                {availableJobs.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                    <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No jobs available right now</h3>
                    <p className="text-slate-500">Stay online. New requests will appear here instantly.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableJobs.map(job => (
                      <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{job.serviceName}</h3>
                          <div className="flex items-center text-slate-500 text-sm mt-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.distance} km away
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right mr-4">
                            <p className="text-xs text-slate-500 uppercase font-bold">Earnings</p>
                            <p className="text-lg font-bold text-green-600">₹{job.totalAmount}</p>
                          </div>
                          <button 
                            onClick={() => handleAcceptJob(job.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
                          >
                            Accept Job
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}