"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyAppointments, bookAppointment } from "../services/patientService";

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isBooking, setIsBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      const [apptRes] = await Promise.all([
        getMyAppointments(),
      ]);
      setAppointments(apptRes.data);
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

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");
    try {
      await bookAppointment({
        appointmentDate: bookingDate,
        timeSlot: bookingTime
      });
      setIsBooking(false);
      setBookingDate("");
      setBookingTime("");
      fetchPatientData(); 
    } catch (err: any) {
      setBookingError(err.response?.data?.error || "Failed to book appointment");
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'queued': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': 
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'done': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': 
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
              Patient Dashboard
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
        
        <div className="mb-12 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Book Appointment</h2>
              <p className="text-sm text-gray-500 mt-1">Schedule a visit.</p>
            </div>
            {!isBooking && (
              <button 
                onClick={() => setIsBooking(true)}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors"
              >
                Book Now
              </button>
            )}
          </div>

          {isBooking && (
            <form onSubmit={handleBookAppointment} className="mt-6 border-t border-gray-100 pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    required
                    className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:00-10:15"
                    className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  />
                </div>
              </div>
              
              {bookingError && <p className="mt-4 text-sm text-red-500">{bookingError}</p>}
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBooking(false)}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">My Appointments</h2>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Date/Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Token Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-medium text-gray-900">{apt.appointmentDate}</div>
                      <div className="text-sm text-gray-500">{apt.timeSlot}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(apt.status)}`}>
                        {apt.status.replace('_', '-')}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                      {apt.queueEntry?.tokenNumber ? `#${apt.queueEntry.tokenNumber}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && (
              <div className="p-8 text-center text-gray-500">No appointments found.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
