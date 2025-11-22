import React, { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import socket from '../socket'



export default function NotificationBell(){
const [notes, setNotes] = useState(() => {
  const stored = localStorage.getItem("notifications");
  try {
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
});
	const [open, setOpen] = useState(false)

	useEffect(() => {
		const pushNotification = (message) => {
			const n = { message, time: new Date().toLocaleString(), read: false }
			setNotes(prev => {
				const next = [n, ...prev]
				localStorage.setItem('notifications', JSON.stringify(next));
				return next
			})
		}

		const extract = (payload) => payload?.job || payload?.data || payload || {}

		const onStatus = (job) => {
			const p = extract(job)
			const message = `Status changed: ${p.company || '—'} — ${p.role || '—'} is now ${p.status || '—'}`
			pushNotification(message)
		}

		const onDeleted = (data) => {
			const id = data?.id || data?._id || data?.jobId || data
			const message = `Application deleted (id: ${id || '—'})`;
			pushNotification(message)
		}

		const onCreated = (job) => {
			const p = extract(job)
			const message = `New application: ${p.company || '—'} — ${p.role || '—'}`
			pushNotification(message)
		}

		const onUpdated = (job) => {
			const p = extract(job)
			const message = `Application updated: ${p.company || '—'} — ${p.role || '—'}`
			pushNotification(message)
		}

		// listen for many event names used across admin/user flows
		socket.on('statusUpdated', onStatus)
		socket.on('jobStatusUpdated', onStatus)
		socket.on('jobDeleted', onDeleted)
		socket.on('adminJobDeleted', onDeleted)
		socket.on('jobCreated', onCreated)
		socket.on('newJob', onCreated)
		socket.on('adminJobCreated', onCreated)
		socket.on('jobUpdated', onUpdated)
		socket.on('adminJobUpdated', onUpdated)

		return () => {
			socket.off('statusUpdated', onStatus)
			socket.off('jobDeleted', onDeleted)
		}
	}, [])

	const unreadCount = notes.filter(n => !n.read).length

	const toggleOpen = () => {
		const newOpen = !open
		setOpen(newOpen)
		// mark all as read when opening
		if (newOpen && unreadCount > 0) {
			const next = notes.map(n => ({ ...n, read: true }))
			setNotes(next)
			localStorage.setItem('notifications', JSON.stringify(next));
		}


	}
const handleClickOutside = (event) => {
	const panel = document.getElementById('notificationPannel');
	if (panel && !panel.contains(event.target)) {
		setOpen(false);
	}
};

useEffect(() => {
	document.addEventListener('mousedown', handleClickOutside);
	return () => {
		document.removeEventListener('mousedown', handleClickOutside);
	};
}, []);

	const markAsRead = (idx) => {
		const next = notes.map((n, i) => i === idx ? { ...n, read: true } : n)
		setNotes(next)
		localStorage.setItem('notifications', JSON.stringify(next));
	}

	const clearAll = () => {
		setNotes([])
		localStorage.setItem('notifications', JSON.stringify([]));

	}

	return (
	<div className="relative">
		<button onClick={toggleOpen} className="relative p-1 rounded-md hover:bg-gray-100 focus:outline-none" aria-label="notifications">
			<Bell size={20} strokeWidth={1.8} />
			{unreadCount > 0 && (
				<span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]">{unreadCount}</span>
			)}
		</button>

		{open && (
			<div id='notificationPannel' className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-2 z-50">
				<div className="flex items-center justify-between mb-2">
					<div className="font-medium">Notifications</div>
					<div className="text-xs">
						<button
							className="text-blue-600 mr-2 hover:underline"
							onClick={() => {
								const next = notes.map((n) => ({ ...n, read: true }))
								setNotes(next)
								localStorage.setItem('notifications', JSON.stringify(next))
							}}
						>
							Mark all
						</button>
						<button className="text-red-600 hover:underline" onClick={clearAll}>Clear</button>
					</div>
				</div>

				{notes.length === 0 ? (
					<p className="p-2 text-gray-500">No notifications</p>
				) : (
					notes.map((n, i) => (
						<div key={i} className={`p-2 border-b flex justify-between items-start ${n.read ? 'opacity-60' : ''}`}>
							<div>
								<div className="text-sm text-gray-900">{n.message}</div>
								<div className="text-xs text-gray-400">{n.time}</div>
							</div>
							{!n.read && (
								<button className="text-xs text-blue-600 ml-2 hover:underline" onClick={() => markAsRead(i)}>Mark</button>
							)}
						</div>
					))
				)}
			</div>
		)}
	</div>
	)
}