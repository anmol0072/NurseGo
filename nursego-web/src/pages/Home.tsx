
import { Stethoscope, Activity, FileText, MapPin, Download, ChevronRight } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-2xl text-slate-900">NurseGo</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#services" className="text-slate-600 hover:text-blue-600 font-medium">Services</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 font-medium">How it Works</a>
              <a href="#download" className="text-slate-600 hover:text-blue-600 font-medium">Download App</a>
              <div className="flex gap-2">
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium border border-blue-600 px-4 py-1 rounded-full text-sm flex items-center">Patient Login</a>
                <a href="/login" className="text-slate-700 hover:text-slate-900 font-medium border border-slate-300 px-4 py-1 rounded-full text-sm flex items-center">Nurse Login</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-cyan-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                Professional Healthcare at Your <span className="text-blue-600">Doorstep</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg">
                Skip the hospital queues. NurseGo connects you with certified paramedical staff, nurses, and lab technicians for medical care, tests, and x-rays directly in your home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#download" className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                  Download the App
                  <ChevronRight className="ml-2 h-5 w-5" />
                </a>
                <a href="#services" className="inline-flex justify-center items-center px-8 py-3.5 border-2 border-slate-200 text-base font-medium rounded-full text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                  Explore Services
                </a>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="w-64 h-[500px] bg-slate-900 rounded-[3rem] mx-auto border-[8px] border-slate-900 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-b-3xl z-10 w-32 mx-auto"></div>
                <div className="bg-blue-600 h-1/3 p-6 flex flex-col justify-end text-white">
                  <h3 className="font-bold text-lg">NurseGo</h3>
                  <p className="text-blue-100 text-sm">Your care is on the way</p>
                </div>
                <div className="bg-slate-50 h-2/3 p-4 space-y-4">
                  <div className="h-20 bg-white rounded-xl shadow-sm p-3 flex items-center gap-3">
                     <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                       <MapPin className="h-5 w-5 text-green-600" />
                     </div>
                     <div>
                       <div className="h-2 w-20 bg-slate-200 rounded mb-2"></div>
                       <div className="h-2 w-12 bg-slate-200 rounded"></div>
                     </div>
                  </div>
                  <div className="h-20 bg-white rounded-xl shadow-sm p-3"></div>
                  <div className="h-20 bg-white rounded-xl shadow-sm p-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Complete Medical Care at Home</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">From post-consultation procedures to diagnostic testing, we bring the clinic to you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Stethoscope className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Medical Procedures</h3>
              <p className="text-slate-600 mb-4">Professional nursing care including IV medication, catheterization, Ryle's tube insertion, and expert wound dressing.</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="h-14 w-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <Activity className="h-7 w-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Laboratory Services</h3>
              <p className="text-slate-600 mb-4">Convenient blood sample collection from your home with fast, digital reporting delivered directly to your app.</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="h-14 w-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Radiology</h3>
              <p className="text-slate-600 mb-4">No need to travel with a fracture. We bring portable X-ray machines to your home for safe and quick imaging.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How NurseGo Works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
             <div className="relative">
               <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto relative z-10">1</div>
               <h3 className="text-lg font-bold text-center mb-2">Download App</h3>
               <p className="text-slate-600 text-center text-sm">Get the NurseGo app and create your patient profile.</p>
             </div>
             <div className="relative">
               <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto relative z-10">2</div>
               <h3 className="text-lg font-bold text-center mb-2">Upload Prescription</h3>
               <p className="text-slate-600 text-center text-sm">Upload your doctor's prescription for the required service.</p>
             </div>
             <div className="relative">
               <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto relative z-10">3</div>
               <h3 className="text-lg font-bold text-center mb-2">Track Arrival</h3>
               <p className="text-slate-600 text-center text-sm">Watch your certified nurse arrive via live GPS tracking.</p>
             </div>
             <div className="relative">
               <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto relative z-10">4</div>
               <h3 className="text-lg font-bold text-center mb-2">Get Care</h3>
               <p className="text-slate-600 text-center text-sm">Receive professional medical care in the comfort of your home.</p>
             </div>
          </div>
         </div>
      </section>

      {/* CTA Section */}
      <section id="download" className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Experience Healthcare at Home?</h2>
          <p className="text-blue-100 text-lg mb-10">Download the NurseGo app today and bring the clinic to your living room.</p>
          <div className="flex justify-center gap-4">
             <button className="bg-black hover:bg-slate-900 text-white px-8 py-4 rounded-xl font-medium flex items-center gap-3 transition-colors">
               <Download className="h-6 w-6" />
               <div className="text-left">
                 <div className="text-xs">GET IT ON</div>
                 <div className="text-lg font-bold leading-none">Google Play</div>
               </div>
             </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
           <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                  <Activity className="h-6 w-6 text-blue-600" />
                  <span className="font-bold text-xl text-slate-900">NurseGo</span>
                </div>
                <p className="text-slate-500 text-sm">NurseGO Healthcare Company.<br/>Professional medical care at your doorstep.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Contact Us</h4>
                <p className="text-slate-500 text-sm mb-2">Email: nursegohealthcarecompany@gmail.com</p>
                <p className="text-slate-500 text-sm">WhatsApp: +91 6284833390</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Join as a Nurse</h4>
                <p className="text-slate-500 text-sm mb-4">Upload your medical license and ID via our app to start earning.</p>
              </div>
           </div>
           <div className="mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
             © 2026 NurseGo Healthcare Company. All rights reserved.
           </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/916284833390" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50 flex items-center justify-center group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>
    </div>
  );
}

export default Home;
