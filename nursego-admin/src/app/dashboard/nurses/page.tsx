'use client';
import { useState, useEffect } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface Nurse {
  id: string;
  name: string;
  phone: string;
  email: string;
  incRegistrationNumber: string;
  experience: number;
  skills: string;
  createdAt: string;
}

export default function NurseApprovalsPage() {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // You can set this to process.env.NEXT_PUBLIC_API_URL if configured
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nursenow.onrender.com';

  const fetchPendingNurses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/nurses/pending`);
      const data = await res.json();
      if (data.success) {
        setNurses(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch nurses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingNurses();
  }, []);

  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this nurse?')) return;
    
    setProcessingId(id);
    try {
      const res = await fetch(`${API_URL}/api/admin/nurses/${id}/verify`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (data.success) {
        setNurses(nurses.filter(n => n.id !== id));
      } else {
        alert(data.message || 'Failed to approve nurse');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while approving the nurse.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pending Approvals</h1>
          <p className="text-slate-500 mt-2">Verify and approve new nurse registrations</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Name & Contact</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">INC Reg No.</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Experience</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Skills</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {nurses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No pending nurse registrations found.
                </td>
              </tr>
            ) : (
              nurses.map((nurse) => (
                <tr key={nurse.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{nurse.name || 'N/A'}</div>
                    <div className="text-sm text-slate-500">{nurse.email || nurse.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    {nurse.incRegistrationNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {nurse.experience ? `${nurse.experience} years` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                    {nurse.skills || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleApprove(nurse.id)}
                      disabled={processingId === nurse.id}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
                    >
                      {processingId === nurse.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 mr-2" />
                      )}
                      Approve
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
