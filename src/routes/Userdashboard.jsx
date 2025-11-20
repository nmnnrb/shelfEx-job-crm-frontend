import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";

const Userdashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState({
    company: "",
    role: "",
    appliedDate: "",
    notes: "",
    status: "Applied",
  });

 

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${import.meta.env.VITE_backend_url}/job`, { withCredentials: true });
      setJobs(resp?.data || []);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openCreate = () => {
    setEditingJob(null);
    setForm({ company: "", role: "", appliedDate: "", notes: "", status: "Applied" });
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

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(`${import.meta.env.VITE_backend_url}/job`, form, { withCredentials: true });
      const created = resp?.data;
      setJobs((s) => [created, ...s]);
      setShowForm(false);
      setForm({ company: "", role: "", appliedDate: "", notes: "", status: "Applied" });
    } catch (err) {
      console.error("Create job error", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingJob) return;
    try {
      const resp = await axios.put(`${import.meta.env.VITE_backend_url}/job/${editingJob._id}`, form, { withCredentials: true });
      const updated = resp?.data;
      setJobs((s) => s.map((j) => (j._id === updated._id ? updated : j)));
      setEditingJob(null);
      setShowForm(false);
      setForm({ company: "", role: "", appliedDate: "", notes: "", status: "Applied" });
    } catch (err) {
      console.error("Update job error", err);
    }
  };

  const handleDelete = async (id) => {
 
    try {
      await axios.delete(`${import.meta.env.VITE_backend_url}/job/${id}`, { withCredentials: true });
      setJobs((s) => s.filter((j) => j._id !== id));
      console.log("Job deleted:", id);
    } catch (err) {
      console.error("Delete job error", err);
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

      {showForm && (
        <form onSubmit={editingJob ? handleUpdate : handleCreate} className="mb-6 bg-white p-4 rounded shadow">
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
            <input
              placeholder="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="border p-2 rounded md:col-span-2"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
              {editingJob ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingJob(null);
                setForm({ company: "", role: "", appliedDate: "", notes: "", status: "Applied" });
              }}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs && jobs.length ? (
            jobs.map((job) => (
              <JobCard key={job._id} job={job} onEdit={openEdit} onDelete={handleDelete} />
            ))
          ) : (
            <div className="text-gray-600">No jobs found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Userdashboard;