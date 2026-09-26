import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, User, Mail, Lock, Phone, AlertCircle, Upload, Shield } from 'lucide-react';

export default function Register() {
  const [role, setRole] = useState<'PATIENT' | 'NURSE'>('PATIENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://nursenow.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, role })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        if (role === 'NURSE') {
          navigate('/nurse-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Activity className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">Create your account</h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in here</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => setRole('PATIENT')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors ${role === 'PATIENT' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              Patient Signup
            </button>
            <button
              type="button"
              onClick={() => setRole('NURSE')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors ${role === 'NURSE' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              Nurse Signup
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="ml-3 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 border bg-slate-50" placeholder="John Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700">Phone Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 border bg-slate-50" placeholder="+91..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700">Email address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 border bg-slate-50" placeholder="you@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 border bg-slate-50" placeholder="••••••••" />
                </div>
              </div>
            </div>

            {role === 'NURSE' && (
              <div className="pt-6 mt-6 border-t border-slate-100">
                <h3 className="text-md font-bold text-slate-900 mb-2 flex items-center"><Shield className="h-5 w-5 mr-2 text-blue-600" /> Professional Credentials</h3>
                <p className="text-sm text-slate-500 mb-6">INC/State Board certification is required to accept jobs on NurseGo.</p>
                
                <div className="space-y-4">
                  <div className="border-2 border-slate-200 border-dashed rounded-xl p-4 flex items-center cursor-pointer hover:bg-slate-50 transition-colors bg-white">
                    <Upload className="h-6 w-6 text-slate-400 mr-4" />
                    <div className="flex-1">
                      <p className="text-slate-700 font-bold text-sm">Upload Medical License</p>
                      <p className="text-slate-400 text-xs mt-1">Recognized Board Certificate (PDF/JPG)</p>
                    </div>
                  </div>
                  
                  <div className="border-2 border-slate-200 border-dashed rounded-xl p-4 flex items-center cursor-pointer hover:bg-slate-50 transition-colors bg-white">
                    <Upload className="h-6 w-6 text-slate-400 mr-4" />
                    <div className="flex-1">
                      <p className="text-slate-700 font-bold text-sm">Upload Experience Certificates</p>
                      <p className="text-slate-400 text-xs mt-1">Letters of recommendation or experience</p>
                    </div>
                  </div>

                  <div className="border-2 border-slate-200 border-dashed rounded-xl p-4 flex items-center cursor-pointer hover:bg-slate-50 transition-colors bg-white">
                    <Upload className="h-6 w-6 text-slate-400 mr-4" />
                    <div className="flex-1">
                      <p className="text-slate-700 font-bold text-sm">Upload Identity Card</p>
                      <p className="text-slate-400 text-xs mt-1">Government issued ID (Aadhar/PAN)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors">
                {loading ? 'Creating account...' : `Register as ${role === 'PATIENT' ? 'Patient' : 'Nurse'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

