import axios from 'axios';
import React, { useEffect, useState } from 'react'
import JobCard from '../components/JobCard';

const AdminDashboard = () => {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

      const fetchJobs = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${import.meta.env.VITE_backend_url}/job/admin/all`, { withCredentials: true });
      setJobs(resp?.data || []);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);


  const openEdit = (job) => {
     
  };

  const handleDelete = async (id) => {
    
  };


  return (
    <div>
        
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
  )
}

export default AdminDashboard