import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Phone } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [loginMode, setLoginMode] = useState<'EMAIL' | 'OTP'>('OTP');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') === 'NURSE' ? 'NURSE' : 'PATIENT';
  const [role, setRole] = useState<'PATIENT' | 'NURSE'>(initialRole);

  const handleSuccess = (data: any) => {
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    if (data.user.role === 'NURSE') navigate('/nurse-dashboard');
    else navigate('/dashboard');
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('https://nursenow.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password })
      });
      const data = await res.json();
      if (data.success) handleSuccess(data);
      else setError(data.message || 'Login failed');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('https://nursenow.onrender.com/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (data.success) setOtpSent(true);
      else setError(data.message || 'Failed to send OTP');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('https://nursenow.onrender.com/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp, role })
      });
      const data = await res.json();
      if (data.success) handleSuccess(data);
      else setError(data.message || 'Invalid OTP');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true); setError('');
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: "Bearer " + tokenResponse.access_token },
        }).then(res => res.json());
        
        const res = await fetch('https://nursenow.onrender.com/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            googleId: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name,
            role
          })
        });
        const data = await res.json();
        if (data.success) handleSuccess(data);
        else setError(data.message || 'Google Login failed');
      } catch(err) {
         setError('Google login failed.');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img src="/nursego_logo.png" alt="NurseGo Logo" className="h-12 w-auto object-contain" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Sign in to your account
        </h2>
        
        <div className="mt-6 flex justify-center space-x-4">
          <button onClick={() => setRole('PATIENT')} className={"px-4 py-2 rounded-full font-medium text-sm transition-colors " + (role === 'PATIENT' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300')}>
            Patient
          </button>
          <button onClick={() => setRole('NURSE')} className={"px-4 py-2 rounded-full font-medium text-sm transition-colors " + (role === 'NURSE' ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300')}>
            Nurse
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          <div className="flex space-x-2 mb-6">
            <button onClick={() => {setLoginMode('OTP'); setError('');}} className={"flex-1 py-2 text-sm font-medium border-b-2 " + (loginMode === 'OTP' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700')}>
              Phone (OTP)
            </button>
            <button onClick={() => {setLoginMode('EMAIL'); setError('');}} className={"flex-1 py-2 text-sm font-medium border-b-2 " + (loginMode === 'EMAIL' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700')}>
              Email
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {loginMode === 'EMAIL' ? (
            <form className="space-y-6" onSubmit={handleEmailLogin}>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-3 border" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-3 border" placeholder="••••••••" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {loading ? 'Signing in...' : 'Sign in with Email'}
              </button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
              <div>
                <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} disabled={otpSent} className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-3 border" placeholder="9876543210" />
                </div>
              </div>
              
              {otpSent && (
                <div>
                  <label className="block text-sm font-medium text-slate-700">Verification Code</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="focus:ring-blue-500 focus:border-blue-500 block w-full text-center tracking-[0.5em] text-lg font-bold sm:text-sm border-slate-300 rounded-md py-3 border" placeholder="123456" maxLength={6} />
                  </div>
                </div>
              )}
              
              <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {loading ? 'Processing...' : (otpSent ? 'Verify & Sign In' : 'Send OTP')}
              </button>
              {otpSent && (
                <div className="text-center">
                  <button type="button" onClick={() => {setOtpSent(false); setOtp('');}} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Change Phone Number
                  </button>
                </div>
              )}
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => loginWithGoogle()}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
                Sign in with Google
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
             <Link to="/register" className="font-medium text-sm text-blue-600 hover:text-blue-500">
                Don't have an account? Register now
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
