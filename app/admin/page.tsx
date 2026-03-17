"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClinicInfo } from "../services/adminService";

export default function AdminDashboard() {
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const clinicRes = await getClinicInfo();
      setClinic(clinicRes.data);
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
              {clinic?.name || "Clinic Dashboard"}
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
        <h1 className="mb-8 text-2xl font-bold text-gray-800">Overview</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{clinic?.userCount || 0}</p>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Appointments</p>
              <p className="text-3xl font-bold text-gray-900">{clinic?.appointmentCount || 0}</p>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Queue Size</p>
              <p className="text-3xl font-bold text-gray-900">{clinic?.queueCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => router.push("/admin/users")}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors"
          >
            Manage Users
          </button>
        </div>
      </main>
    </div>
  );
}
