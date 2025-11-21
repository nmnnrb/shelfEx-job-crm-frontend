import axios from 'axios'
import React from 'react'

const Navbar = ({ onLogout }) => {
	const handleLogout = async () => {
	const res = await axios.post(`${import.meta.env.VITE_backend_url}/auth/logout`, {}, {
        withCredentials: true
    });

        localStorage.removeItem('User');
        window.location.href = '/login';

	}

	return (
		<header style={styles.header}>
			<div style={styles.title}>minicrm</div>
			<div style={styles.right}>
				<button aria-label="notifications" title="Notifications" style={styles.iconBtn}>🔔</button>
				<button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
			</div>
		</header>
	)
}

const styles = {
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '10px 16px',
		borderBottom: '1px solid #e5e7eb',
		background: '#fff',
		position: 'sticky',
		top: 0,
		zIndex: 1000,
	},
	title: {
		fontSize: 18,
		fontWeight: 700,
		color: '#111827',
		textTransform: 'lowercase',
	},
	right: {
		display: 'flex',
		alignItems: 'center',
		gap: 12,
	},
	iconBtn: {
		background: 'transparent',
		border: 'none',
		fontSize: 18,
		cursor: 'pointer',
	},
	logoutBtn: {
		background: '#ef4444',
		color: '#fff',
		border: 'none',
		padding: '6px 12px',
		borderRadius: 6,
		cursor: 'pointer',
		fontWeight: 600,
	},
}

export default Navbar

