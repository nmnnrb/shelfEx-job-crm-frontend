import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";
import socket from "../socket";
import UserFilter from "../components/UserFilter";
const Userdashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const todayDate = () => new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    company: "",
    role: "",
    appliedDate: todayDate(),
    notes: "",
    status: "Applied",
  });

 

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`/api/job`, { withCredentials: true });
      const data = resp?.data || [];
      const sorted = sortByDateField(data, 'appliedDate', 'desc');
      setAllJobs(sorted);
      setJobs(sorted);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();

    const refresh = () => fetchJobs();

    socket.on('jobStatusUpdated', refresh)
    socket.on('statusUpdated', refresh)
    socket.on('jobDeleted', refresh)
    socket.on('jobCreated', refresh)
    socket.on('jobUpdated', refresh)

    return () => {
      socket.off('jobStatusUpdated', refresh)
      socket.off('jobDeleted', refresh)
      socket.off('jobCreated', refresh)
      socket.off('jobUpdated', refresh)
    }




  }, []);

  const openCreate = () => {
    setEditingJob(null);
    setForm({ company: "", role: "", appliedDate: todayDate(), notes: "", status: "Applied" });
    setShowForm(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setForm({
      company: job.company || "",
      role: job.role || "",
      appliedDate: job.appliedDate ? job.appliedDate.slice(0, 10) : "",
      notes: job.notes || "",
      status: job.status || "Applied",
    });
    setShowForm(true);
  };

  const openView = (job) => {
    setSelectedJob(job);
  };
  const closeView = () => setSelectedJob(null);

  const sortByDateField = (list = [], field = 'appliedDate', order = 'desc') => {
    const out = Array.isArray(list) ? [...list] : [];
    out.sort((a, b) => {
      const da = new Date(a?.[field] || 0).getTime();
      const db = new Date(b?.[field] || 0).getTime();
      return order === 'asc' ? da - db : db - da;
    });
    return out;
  }

  const roles = useMemo(() => {
    const s = new Set();
    allJobs.forEach(j => { if (j?.role) s.add(j.role) });
    return Array.from(s);
  }, [allJobs]);

  const handleFilter = ({ role, status, sortField = 'appliedDate', sortOrder = 'desc' } = {}) => {
    let out = Array.isArray(allJobs) ? [...allJobs] : [];
    if (role) out = out.filter(j => (j.role || '') === role);
    if (status) out = out.filter(j => (j.status || '') === status);
    out = sortByDateField(out, sortField, sortOrder);
    setJobs(out);
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const resp = await axios.post(`/api/job`, form, { withCredentials: true });
      const created = resp?.data;
      setJobs((s) => [created, ...s]);
      setAllJobs((s) => [created, ...s]);
      setShowForm(false);
      setForm({ company: "", role: "", appliedDate: todayDate(), notes: "", status: "Applied" });
    } catch (err) {
      console.error("Create job error", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingJob) return;
    setFormLoading(true);
    try {
      const resp = await axios.put(`/api/job/${editingJob._id}`, form, { withCredentials: true });
      console.log("Update response", resp);
      const updated = resp?.data;
      setJobs((s) => s.map((j) => (j._id === updated._id ? updated : j)));
      setAllJobs((s) => s.map((j) => (j._id === updated._id ? updated : j)));
      setEditingJob(null);
      setShowForm(false);
      setForm({ company: "", role: "", appliedDate: todayDate(), notes: "", status: "Applied" });
    } catch (err) {
      console.error("Update job error", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`/api/job/${id}`, { withCredentials: true });
      setJobs((s) => s.filter((j) => j._id !== id));
      setAllJobs((s) => s.filter((j) => j._id !== id));
      console.log("Job deleted:", id);
    } catch (err) {
      console.error("Delete job error", err);
    } finally {
      setDeletingId(null);
      fetchJobs();
    }
  };

    const changeStatus = async (id, newStatus) => {
    try {
    const res =   await axios.put(`/api/job/${id}`, { status: newStatus } , {
      withCredentials: true
    });
    console.log('changeStatus response', res);
      fetchJobs();
    } catch (err) {
      console.error('changeStatus failed', err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Create Job
        </button>


      </div>

      <div className="mb-4">
        <UserFilter roles={roles} onFilter={handleFilter} />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowForm(false); setEditingJob(null); setForm({ company: "", role: "", appliedDate: "", notes: "", status: "Applied" }); }} />
          <form onSubmit={editingJob ? handleUpdate : handleCreate} className="relative w-full max-w-2xl bg-white p-6 rounded shadow-lg z-50 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editingJob ? 'Edit Job' : 'Create Job'}</h3>
              <button type="button" onClick={() => { setShowForm(false); setEditingJob(null); setForm({ company: "", role: "", appliedDate: "", notes: "", status: "Applied" }); }} className="px-3 py-1 hover:cursor-pointer rounded bg-gray-100">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                placeholder="Company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <input
                placeholder="Role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <input
                type="date"
                value={form.appliedDate}
                onChange={(e) => setForm({ ...form, appliedDate: e.target.value })}
                className="border p-2 rounded"
              />
              
            </div>
            <div className="flex flex-col my-3">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border p-2 rounded"
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
                <option>Accepted</option>
              </select>
              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="border p-2 mt-3 rounded md:col-span-2 h-32"
              />
            </div>

              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => { setShowForm(false); setEditingJob(null); setForm({ company: "", role: "", appliedDate: "", notes: "", status: "Applied" }); }} className="px-4 py-2 bg-gray-200 hover:cursor-pointer rounded">Cancel</button>
                <button type="submit" disabled={formLoading} className="px-4 py-2 bg-green-600 hover:cursor-pointer text-white rounded flex items-center">
                  {formLoading && (
                    <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  )}
                  {editingJob ? 'Update' : 'Create'}
                </button>
              </div>
          </form>
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs && jobs.length ? (
              jobs.map((job) => (
                <JobCard key={job._id} job={job} onEdit={openEdit} onDelete={handleDelete} onView={openView} allowEdit={true} allowStatusChange={true} isDeleting={deletingId === job._id} 
                  onChangeStatus={(id, newStatus) => changeStatus(id, newStatus)}
                />
              ))
            ) : (
              <div className="text-gray-600">No jobs found.</div>
            )}
          </div>

          {/* View modal for full details */}
          {selectedJob && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/60" onClick={closeView} />

              <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedJob.company || '—'}</h2>
                    <div className="text-sm text-gray-500">{selectedJob.role || '—'}</div>
                    <div className="text-xs text-gray-400 mt-1">{selectedJob.appliedDate ? new Date(selectedJob.appliedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm text-gray-500">{selectedJob.userId?.name} {selectedJob.userId?.email ? `• ${selectedJob.userId.email}` : ''}</div>
                    <div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{selectedJob.status || '—'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Notes</h3>
                  <p className="whitespace-pre-wrap text-gray-800">{selectedJob.notes || 'No notes'}</p>
                </div>

                <div className="mt-4 flex justify-end">
                  <a onClick={closeView} className="px-3 py-2 hover:cursor-pointer rounded bg-gray-100">Close</a>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Userdashboard;