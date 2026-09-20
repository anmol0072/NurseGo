import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Stethoscope, FileText, Pill, LogOut, ChevronRight, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const categories = [
    { id: 'medical', name: 'Medical Procedures', icon: <Stethoscope className="h-8 w-8 text-blue-500" />, desc: 'IV medication, catheterization, wound dressing' },
    { id: 'lab', name: 'Laboratory Services', icon: <Activity className="h-8 w-8 text-cyan-500" />, desc: 'Blood sample collection with digital reporting' },
    { id: 'radiology', name: 'Radiology', icon: <FileText className="h-8 w-8 text-indigo-500" />, desc: 'Portable X-ray services at your home' }
  ];

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

            <h2 className="text-xl font-bold text-slate-900 mb-4">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {categories.map(cat => (
                <Link to={`/checkout?category=${cat.name}`} key={cat.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer">
                  <div className="h-14 w-14 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center justify-between">
                    {cat.name}
                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                  </h3>
                  <p className="text-slate-500 text-sm">{cat.desc}</p>
                </Link>
              ))}
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