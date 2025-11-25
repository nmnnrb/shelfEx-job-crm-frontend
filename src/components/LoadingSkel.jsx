import React from "react";

export default function LoadingSkel() {
  return (
    <div className="w-full min-h-screen bg-gray-50 animate-pulse">


      <div className="w-full h-14 bg-gray-200 shadow-sm flex items-center px-4"></div>


      <div className="max-w-4xl mx-auto mt-6 px-3 space-y-4">


        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow p-4 space-y-3 border border-gray-100"
          >


            <div className="flex justify-between items-start gap-3">


              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>


              <div className="flex flex-col items-end gap-3">
                <div className="h-3 bg-gray-300 rounded w-16"></div>

                <div className="h-8 bg-gray-300 rounded w-24"></div>
              </div>
            </div>


            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>


            <div className="flex gap-2 pt-2">
              <div className="h-8 w-10 bg-gray-300 rounded"></div>
              <div className="h-8 w-10 bg-gray-300 rounded"></div>
              <div className="h-8 w-16 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
