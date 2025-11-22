import React, { useEffect, useState } from 'react'

const UserFilter = ({ onFilter, roles = [] }) => {
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [sortOrder, setSortOrder] = useState('desc') // desc = newest

  useEffect(() => {
    const t = setTimeout(() => {
      onFilter && onFilter({ role, status, sortField: 'appliedDate', sortOrder })
    }, 200)
    return () => clearTimeout(t)
  }, [role, status, sortOrder, onFilter])

  return (
    <div className="mb-3">
      <div className="flex flex-wrap items-center gap-2 bg-white border border-gray-100 rounded-md p-2">
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
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
            <option value="Accepted">Accepted</option>
          </select>
        </div>

        <div className="ml-auto px-1">
          <label className="sr-only">Sort by date</label>
          <select
            aria-label="Sort by applied date"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="text-sm px-2 py-1 bg-transparent border border-gray-200 rounded-sm focus:outline-none"
          >
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default UserFilter
