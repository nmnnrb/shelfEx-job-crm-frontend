import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react'
import socket from '../socket';
import AdminFilter from '../components/AdminFilter'
import JobCard from '../components/JobCard'
const AdminDashboard = () => {

    const [jobs, setJobs] = useState([]);
      const [allJobs, setAllJobs] = useState([]);
      const [page, setPage] = useState(1);
      const [pages, setPages] = useState(1);
      const [total, setTotal] = useState(0);
      const [limit, setLimit] = useState(10);
      const [deletingId, setDeletingId] = useState(null);
    const [loading, setLoading] = useState(false);

  
      const fetchJobs = async (pageArg = 1) => {
    setLoading(true);
    try {
      const resp = await axios.get(`http://localhost:8080/api/job/admin/all?page=${pageArg || 1}&limit=${limit}`, { withCredentials: true });
      const data = resp?.data || {};
      // response expected: { jobs, total, page, pages }
      const jobsPage = data.jobs || [];
      setAllJobs(jobsPage);
      // keep local sort/filter capability on this page
      const sorted = sortByDateField(jobsPage, 'appliedDate', 'desc');
      setJobs(sorted);
      setTotal(data.total || 0);
      setPage(data.page || (pageArg || 1));
      setPages(data.pages || 1);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchJobs(page);
  }, []);

    useEffect(() => {
      // unify event listeners so both admin and user dashboards respond
      const events = [
        'jobCreated',
        'newJob',
        'jobUpdated',
        'jobDeleted',
        'jobStatusUpdated',
        'statusUpdated',
        'adminJobCreated',
        'adminJobUpdated',
        'adminJobDeleted'
      ];

      const handler = (payload) => {
        console.debug('[socket] AdminDashboard received event, refreshing page', payload && (payload._id || payload.id || payload));
        // refresh current page
        fetchJobs(page);
      };

      events.forEach(ev => socket.on(ev, handler));

      return () => {
        events.forEach(ev => socket.off(ev, handler));
      }
  }, [])


  //---delete

    const deletePost = async (id) => {
      setDeletingId(id);
      try{
        await axios.delete(`http://localhost:8080/api/job/admin/${id}` , {
          withCredentials: true
        });
        await fetchJobs(page);
      } catch (err) {
        console.error('deletePost failed', err);
      } finally {
        setDeletingId(null);
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
      await axios.put(`http://localhost:8080/api/job/admin/${editJob._id}`, payload, { withCredentials: true });
      await fetchJobs(page);
      closeEdit();
    } catch (err) {
      console.error('submitEdit failed', err);
    }
    setEditLoading(false);
  };
 


    //------------ change status
  const changeStatus = async (id, newStatus) => {
    try {
    const res =   await axios.put(`http://localhost:8080/api/job/admin/${id}`, { status: newStatus } , {
      withCredentials: true
    });
    console.log('changeStatus response', res);
      fetchJobs(page);
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

  // Render pagination controls
  const renderPagination = () => {
    if (!pages || pages <= 1) return null;
    const visible = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(pages, page + 2);
    if (start > 1) visible.push(1);
    if (start > 2) visible.push('left-ellipsis');
    for (let p = start; p <= end; p++) visible.push(p);
    if (end < pages - 1) visible.push('right-ellipsis');
    if (end < pages) visible.push(pages);

    return (
      <div className="mt-6 flex items-center justify-center gap-2">

        <button
          disabled={page <= 1}
          onClick={() => fetchJobs(Math.max(1, page - 1))}
          className="px-2 py-1 rounded border border-gray-200 hover:border-indigo-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Prev
        </button>

        {visible.map((v, i) => {
          if (v === 'left-ellipsis' || v === 'right-ellipsis') return <span key={i} className="px-2">…</span>;
          return (
            <button
              key={i}
              onClick={() => fetchJobs(v)}
              className={`px-3 py-1 rounded ${v === page ? 'bg-indigo-600 text-white' : 'border border-gray-200 hover:border-indigo-400 cursor-pointer hover:shadow-sm'} focus:outline-none transition`}
              aria-current={v === page ? 'page' : undefined}
            >
              {v}
            </button>
          )
        })}

        <button
          disabled={page >= pages}
          onClick={() => fetchJobs(Math.min(pages, page + 1))}
          className="px-2 py-1 rounded border border-gray-200 hover:border-indigo-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>

        <button
          disabled={page >= pages}
          onClick={() => fetchJobs(pages)}
          className="px-2 py-1 rounded border border-gray-200 hover:border-indigo-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Last
        </button>
      </div>
    )
  }

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
            isDeleting={deletingId === (u._id || idx)}
          />
        ))}
      </div>

      {renderPagination()}

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