"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDoctorQueue } from "../services/doctorService";

export default function DoctorDashboard() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await getDoctorQueue();
      setQueue(res.data);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': 
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'done': return 'bg-emerald-100 text-emerald-800';
      case 'skipped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-indigo-600 px-6 py-4 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-wide">
              Doctor Dashboard
            </span>
            <span className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold hidden md:inline-block">
              {user?.name}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md bg-transparent border border-white px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Today's Queue</h1>
            <p className="text-sm text-gray-500 mt-1">Manage patients</p>
          </div>
          <button 
            onClick={fetchQueue}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-300 transition-colors"
          >
            Refresh Queue
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500 tracking-wider">Token</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500 tracking-wider">Patient Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500 tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {queue.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-lg font-bold text-indigo-600">#{item.tokenNumber}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-medium text-gray-900">{item.patientName}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', '-')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {queue.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No patients
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
