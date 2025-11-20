import React from "react";

export default function JobCard({ job, onEdit, onDelete }) {
  const { company, role, appliedDate, notes, status } = job || {};
  const formattedDate = appliedDate ? new Date(appliedDate).toLocaleDateString() : "";

  return (
    <div className="bg-white shadow rounded p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{company}</h3>
          <p className="text-sm text-gray-600">{role}</p>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
        <div>
          <span className="px-2 py-1 rounded bg-gray-100 text-sm">{status}</span>
        </div>
      </div>

      {notes && <p className="mt-2 text-sm text-gray-700">{notes}</p>}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onEdit && onEdit(job)}
          className="text-sm px-3 py-1 bg-yellow-400 rounded hover:opacity-90"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete && onDelete(job?._id)}
          className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:opacity-90"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
