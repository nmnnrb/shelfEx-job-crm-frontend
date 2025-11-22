import { Edit, Eye, EyeIcon } from "lucide-react";
import React from "react";

export default function JobCard({ job, onEdit, onDelete, onView, onChangeStatus, allowEdit = true, allowStatusChange = true, isDeleting = false }) {
  const { company, role, appliedDate, notes, status, userId } = job || {};
  const formattedDate = appliedDate ? new Date(appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "";

  return (
    <div className="bg-white shadow rounded p-4">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <h3 className="text-md font-semibold text-gray-900">{company || '—'}</h3>
          <div className="text-sm text-gray-600">{role || '—'}</div>
          <div className="text-xs text-gray-400 mt-1">{userId?.name ? `${userId.name} • ${userId.email}` : ''}</div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-sm text-gray-500">{formattedDate}</div>
          <div>
            {allowStatusChange ? (
              <select
                value={status}
                onChange={(e) => onChangeStatus && onChangeStatus(job?._id, e.target.value)}
                className="px-2 py-1 rounded text-sm border"
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
                <option>Accepted</option>
              </select>
            ) : (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status || '—'}</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-700 truncate">{notes ? (notes.length > 120 ? notes.slice(0, 120) + '…' : notes) : 'No notes'}</div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onView && onView(job)}
          className="text-sm px-3 py-1 border rounded hover:cursor-pointer hover:bg-gray-50"
          aria-label="View note"
        >
           <EyeIcon className="w-4 h-4" />
        </button>

        {allowEdit && (
          <button
            onClick={() => onEdit && onEdit(job)}
            className="text-sm px-3 py-1 bg-yellow-400 hover:cursor-pointer rounded hover:opacity-90"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
        )}
        <button
          onClick={() => onDelete && onDelete(job?._id)}
          disabled={isDeleting}
          className="text-sm px-3 py-1 bg-red-500 text-white hover:cursor-pointer rounded hover:opacity-90 flex items-center"
        >
          {isDeleting && (
            <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          )}
          Delete
        </button>
      </div>
    </div>
  );
}
