
import React, { useEffect, useState } from 'react'

const AdminFilter = ({ onFilter, roles = [] }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')

  // Debounce filter calls so typing isn't too chatty
  useEffect(() => {
    const t = setTimeout(() => {
      onFilter({ name, email, company, role, status })
    }, 200)
    return () => clearTimeout(t)
  }, [name, email, company, role, status, onFilter])

  return (
    <div className="mb-3">
      <div className="flex flex-wrap items-center gap-2 bg-white border border-gray-100 rounded-md p-2">
        <div className="flex items-center gap-2 px-1">
          <input
            aria-label="Applicant name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-40 text-sm placeholder-gray-400 px-2 py-1 bg-transparent border border-gray-200 rounded-sm focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 px-1">
          <input
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-44 text-sm placeholder-gray-400 px-2 py-1 bg-transparent border border-gray-200 rounded-sm focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 px-1">
          <input
            aria-label="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
            className="w-36 text-sm placeholder-gray-400 px-2 py-1 bg-transparent border border-gray-200 rounded-sm focus:outline-none"
          />
        </div>

        <div className="px-1">
          <select
            aria-label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="text-sm px-2 py-1 bg-transparent border border-gray-200 rounded-sm focus:outline-none"
          >
            <option value="">All roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="px-1">
          <select
            aria-label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="text-sm px-2 py-1 bg-transparent border border-gray-200 rounded-sm focus:outline-none"
          >
            <option value="">All statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Accepted">Accepted</option>
            <option value="Accepted">Offer Sent</option>
          </select>
        </div>

        <div className="ml-auto px-1" />
      </div>
    </div>
  )
}

export default AdminFilter
