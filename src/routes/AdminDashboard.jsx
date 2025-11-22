import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react'
import socket from '../socket';
import AdminFilter from '../components/AdminFilter'
import JobCard from '../components/JobCard'
const AdminDashboard = () => {

    const [jobs, setJobs] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [loading, setLoading] = useState(false);

  
      const fetchJobs = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`/api/job/admin/all`, { withCredentials: true });
      console.log('Fetched jobs:', resp?.data);
              const data = resp?.data || [];
              // default sort by appliedDate newest first
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
  }, []);

    useEffect(() => {
    const onAdminUpdated = (job) => {
      // refresh list when another admin updates a job
      fetchJobs();
    }

    const onAdminDeleted = ({ id }) => {
      fetchJobs();
    }

    const onCreated = (job) => {
      // when a user creates a job, refresh the list so the new card appears
      fetchJobs();
    }

    const onJobUpdated = (job) => {
      // server may emit 'jobUpdated' when a user edits their job
      fetchJobs();
    }

    socket.on('adminJobUpdated', onAdminUpdated)
    socket.on('adminJobDeleted', onAdminDeleted)
    socket.on('adminJobCreated', onCreated)
    socket.on('jobCreated', onCreated)
    socket.on('newJob', onCreated)
    socket.on('jobUpdated', onJobUpdated)

    return () => {
      socket.off('adminJobUpdated', onAdminUpdated)
      socket.off('adminJobDeleted', onAdminDeleted)
      socket.off('adminJobCreated', onCreated)
      socket.off('jobCreated', onCreated)
      socket.off('newJob', onCreated)
      socket.off('jobUpdated', onJobUpdated)
    }
  }, [])


  //---delete

    const deletePost = async (id) => {
    
    try{
      await axios.delete(`/api/job/admin/${id}` , {
        withCredentials: true
      });
      fetchJobs();
    } catch (err) {
      console.error('deletePost failed', err);

    }
  };


  //----edit flow: open modal, submit changes
  const [editJob, setEditJob] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const openEdit = (job) => {
    // create editable copy
    setEditJob({
      _id: job?._id,
      company: job?.company || '',
      role: job?.role || '',
      notes: job?.notes || '',
      status: job?.status || ''
    })
  }

  const closeEdit = () => setEditJob(null);

  const submitEdit = async (e) => {
    e && e.preventDefault && e.preventDefault();
    if (!editJob || !editJob._id) return;
    setEditLoading(true);
    try {
      const payload = {
        company: editJob.company,
        role: editJob.role,
        notes: editJob.notes,
        status: editJob.status
      }
      await axios.put(`/api/job/admin/${editJob._id}`, payload, { withCredentials: true });
      await fetchJobs();
      closeEdit();
    } catch (err) {
      console.error('submitEdit failed', err);
    }
    setEditLoading(false);
  };
 


    //------------ change status
  const changeStatus = async (id, newStatus) => {
    try {
    const res =   await axios.put(`/api/job/admin/${id}`, { status: newStatus } , {
      withCredentials: true
    });
    console.log('changeStatus response', res);
      fetchJobs();
    } catch (err) {
      console.error('changeStatus failed', err);
    }
  };

  // helper: sort list by a date field (returns new array)
  const sortByDateField = (list = [], field = 'appliedDate', order = 'desc') => {
    const out = Array.isArray(list) ? [...list] : [];
    out.sort((a, b) => {
      const da = new Date(a?.[field] || 0).getTime();
      const db = new Date(b?.[field] || 0).getTime();
      return order === 'asc' ? da - db : db - da;
    });
    return out;
  }

  // format a date compactly for display
  const formatDateShort = (d) => {
    if (!d) return '—'
    try {
      return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    } catch (e) {
      return '—'
    }
  }

  const roles = useMemo(() => {
    const s = new Set();
    allJobs.forEach(j => { if (j?.role) s.add(j.role) });
    return Array.from(s);
  }, [allJobs]);

  const [sortField, setSortField] = useState('appliedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedJob, setSelectedJob] = useState(null);
  const handleFilter = ({ name, email, company, role, status }) => {
    let out = Array.isArray(allJobs) ? [...allJobs] : [];
    if (name) {
      const q = name.toLowerCase();
      out = out.filter(j => (j.userId?.name || '').toLowerCase().includes(q))
    }
    if (email) {
      const q = email.toLowerCase();
      out = out.filter(j => (j.userId?.email || '').toLowerCase().includes(q))
    }
    if (company) {
      const q = company.toLowerCase();
      out = out.filter(j => (j.company || '').toLowerCase().includes(q))
    }
    if (role) {
      out = out.filter(j => (j.role || '') === role)
    }
    if (status) {
      out = out.filter(j => (j.status || '') === status)
    }
    // apply current header-based sort
    out = sortByDateField(out, sortField, sortOrder);
    setJobs(out);
  }

  const toggleSort = (field) => {
    // field is a real data-field string (e.g. 'appliedDate')
    const nextOrder = sortField === field ? (sortOrder === 'desc' ? 'asc' : 'desc') : 'desc';
    setSortField(field);
    setSortOrder(nextOrder);
    setJobs(prev => sortByDateField(prev, field, nextOrder));
  }
  const openNote = (job) => setSelectedJob(job);
  const closeNote = () => setSelectedJob(null);

  return (
    <div className='px-8 py-8'>
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Manage Users</h2>
        <div className="flex gap-4 mb-4  items-center text-xs text-gray-500 mt-1">
          <div className="px-2 py-1 bg-gray-100 rounded text-gray-700">Count: {jobs.length}</div>
        </div>
      <AdminFilter roles={roles} onFilter={handleFilter} />
      </div>



      {/* Card grid for all screen sizes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {jobs.map((u, idx) => (
          <JobCard
            key={u._id || idx}
            job={u}
            onEdit={(job) => openEdit(job)}
            onDelete={(id) => deletePost(id)}
            onView={(job) => openNote(job)}
            onChangeStatus={(id, newStatus) => changeStatus(id, newStatus)}
          />
        ))}
      </div>

      {/* Fullscreen modal for viewing notes */}
  {selectedJob && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    
    {/* Background overlay */}
    <div 
      className="absolute inset-0 bg-black/60" 
      onClick={closeNote} 
    />

    {/* Modal Box */}
    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">
            {selectedJob.company || '—'}
          </h2>
          <div className="text-sm text-gray-500">
            {selectedJob.userId?.name} • {selectedJob.userId?.email}
          </div>
        </div>

        <button 
          onClick={closeNote} 
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Close
        </button>
      </div>

      {/* Notes */}
      <div className="prose max-w-none">
        <h3 className="text-lg font-semibold mb-2">Notes</h3>
        <p className="whitespace-pre-wrap text-gray-800">
          {selectedJob.notes || 'No notes'}
        </p>
      </div>

    </div>
  </div>
)}

      {/* Edit modal */}
      {editJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={closeEdit} />
          <form onSubmit={submitEdit} className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit job</h2>
              <button type="button" onClick={closeEdit} className="px-3 py-1 bg-gray-100 rounded-md">Cancel</button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <label className="text-xs text-gray-500">Company</label>
              <input
                value={editJob.company}
                onChange={(e) => setEditJob(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
              />

              <label className="text-xs text-gray-500">Role</label>
              <input
                value={editJob.role}
                onChange={(e) => setEditJob(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
              />

              <label className="text-xs text-gray-500">Status</label>
              <select
                value={editJob.status}
                onChange={(e) => setEditJob(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
                <option>Accepted</option>
              </select>

              <label className="text-xs text-gray-500">Notes</label>
              <textarea
                value={editJob.notes}
                onChange={(e) => setEditJob(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border rounded h-40"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={closeEdit} className="px-3 py-2 rounded border">Cancel</button>
              <button type="submit" disabled={editLoading} className="px-4 py-2 bg-blue-600 text-white rounded">
                {editLoading ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard