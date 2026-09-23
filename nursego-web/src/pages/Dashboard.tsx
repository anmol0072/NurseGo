import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Stethoscope, FileText, Pill, LogOut, ChevronRight, Syringe } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }

    // Fetch dynamic services from the backend
    fetch('https://nursenow.onrender.com/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setServices(data.data);
        }
      })
      .catch(err => console.error('Failed to load services', err));
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
          <a href="#" className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
            <Activity className="h-5 w-5 mr-3" /> Dashboard
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">
            <FileText className="h-5 w-5 mr-3" /> My Bookings
          </a>
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user.name.split(' ')[0]}!</h1>
              <p className="text-slate-500 mt-2">What healthcare service do you need today?</p>
            </div>

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
          </div>
        </main>
      </div>
    </div>
  );
}