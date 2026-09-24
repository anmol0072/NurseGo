import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Activity, ArrowLeft, Upload, MapPin, CreditCard, Banknote } from 'lucide-react';

export default function Checkout() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serviceName = queryParams.get('name') || 'Medical Service';
  const servicePrice = parseInt(queryParams.get('price') || '500');

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('cash');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const userToken = localStorage.getItem('token');
    if (!userData || !userToken) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
      setToken(userToken);
    }

    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, [navigate]);

  const handleBooking = async () => {
    setLoading(true);
    const amount = servicePrice;

    if (paymentMethod === 'cash') {
      try {
        const res = await fetch('https://nursenow.onrender.com/api/bookings', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            patientId: user.id,
            serviceName: serviceName,
            totalAmount: amount,
            distance: 4,
            paymentMethod: 'cash',
            isEmergency: false
          })
        });
        const data = await res.json();
        if (data.success) {
          navigate(`/tracking?bookingId=${data.booking.id}`);
        } else {
          alert('Failed to book: ' + data.message);
        }
      } catch (err) {
        alert('Network error');
      } finally {
        setLoading(false);
      }
    } else {
      // Razorpay Flow
      try {
        const orderRes = await fetch('https://nursenow.onrender.com/api/payments/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount })
        });
        const orderData = await orderRes.json();

        const options = {
          key: 'rzp_test_xxxx', // Demo key
          amount: orderData.amount,
          currency: "INR",
          name: "NurseGo",
          description: `Payment for ${serviceName}`,
          order_id: orderData.id,
          handler: async function () {
            // Payment success, create booking
            const bookingRes = await fetch('https://nursenow.onrender.com/api/bookings', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                patientId: user.id,
                serviceName: serviceName,
                totalAmount: amount,
                distance: 4,
                paymentMethod: 'card',
                isEmergency: false
              })
            });
            const data = await bookingRes.json();
            if (data.success) {
              navigate(`/tracking?bookingId=${data.booking.id}`);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: { color: "#2563eb" }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setLoading(false);
      } catch (err) {
        alert('Payment setup failed');
        setLoading(false);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 bg-white shadow-sm flex items-center px-8">
        <Link to="/dashboard" className="flex items-center text-slate-500 hover:text-blue-600">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back
        </Link>
        <div className="mx-auto flex items-center">
          <Activity className="h-6 w-6 text-blue-600 mr-2" />
          <span className="font-bold text-xl text-slate-900">Checkout</span>
        </div>
        <div className="w-16"></div>
      </header>

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Confirm your Booking</h1>
          
          <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between mb-8">
            <div>
              <p className="text-blue-600 text-sm font-bold uppercase tracking-wider">Service</p>
              <p className="text-lg font-bold text-slate-900">{serviceName}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-600 text-sm font-bold uppercase tracking-wider">Total</p>
              <p className="text-lg font-bold text-slate-900">₹{servicePrice}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Required Details</h2>
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-4 flex items-center">
                <MapPin className="h-5 w-5 text-slate-400 mr-4" />
                <input type="text" placeholder="Enter your full address" className="flex-1 bg-transparent outline-none text-slate-700" defaultValue="123 Patient Home, New Delhi" />
              </div>
              <div className="border border-slate-200 border-dashed rounded-xl p-4 flex items-center cursor-pointer hover:bg-slate-50 transition-colors">
                <Upload className="h-5 w-5 text-slate-400 mr-4" />
                <div className="flex-1">
                  <p className="text-slate-700 font-medium">Upload Doctor's Prescription</p>
                  <p className="text-slate-500 text-sm">Required for all medical procedures</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
              >
                <CreditCard className={`h-8 w-8 mb-2 ${paymentMethod === 'card' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className={`font-medium ${paymentMethod === 'card' ? 'text-blue-700' : 'text-slate-600'}`}>Pay Online (UPI/Card)</span>
              </button>
              <button 
                onClick={() => setPaymentMethod('cash')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors ${paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
              >
                <Banknote className={`h-8 w-8 mb-2 ${paymentMethod === 'cash' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className={`font-medium ${paymentMethod === 'cash' ? 'text-blue-700' : 'text-slate-600'}`}>Cash on Arrival</span>
              </button>
            </div>
          </div>

          <button 
            onClick={handleBooking} 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
          >
            {loading ? 'Processing...' : 'Confirm & Book Nurse'}
          </button>
        </div>
      </main>
    </div>
  );
}
