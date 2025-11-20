import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("user");
	const [showPassword, setShowPassword] = useState(false);
	const [message, setMessage] = useState(null);

	function handleSubmit(e) {
		e.preventDefault();
		if (!name || !email || !password) {
			setMessage({ type: "error", text: "Please fill all required fields." });
			return;
		}
		const payload = { name, email, password, role };
		console.log("Dummy register", payload);
		setMessage({ type: "success", text: "Dummy registration successful." });
		setPassword("");
	}

	return (
		<div className="min-h-screen bg-gradient-to-tr from-pink-50 via-purple-50 to-indigo-50 flex items-center">
			<div className="container mx-auto px-4 py-12">
				<div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
					<div className="hidden md:flex flex-col justify-center p-8 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-lg shadow-lg">
						<h3 className="text-3xl font-bold">Join ShelfEx</h3>
						<p className="mt-3 text-pink-100 max-w-md">Create an account to track jobs, applicants and collaborate with your team.</p>
						<div className="mt-6 flex gap-3">
							<span className="inline-block px-3 py-1 bg-white/20 rounded">For Teams</span>
							<span className="inline-block px-3 py-1 bg-white/20 rounded">For Individuals</span>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-extrabold text-gray-900">Create your account</h2>

						{message && (
							<div className={`mt-4 p-3 rounded text-sm ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
								{message.text}
							</div>
						)}

						<form onSubmit={handleSubmit} className="mt-6 space-y-5">
							<div>
								<label htmlFor="name" className="block text-sm font-medium text-gray-700">Full name</label>
								<input id="name" value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-200" placeholder="Your full name" />
							</div>

							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
								<input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-200" placeholder="you@example.com" />
							</div>

							<div>
								<label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
								<div className="relative mt-1">
									<input id="password" type={showPassword?"text":"password"} value={password} onChange={(e)=>setPassword(e.target.value)} className="block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-200" placeholder="Create password" />
									<button type="button" onClick={()=>setShowPassword(s=>!s)} className="absolute right-3 top-2 text-sm text-gray-600">{showPassword?'Hide':'Show'}</button>
								</div>
							</div>

							<div>
								<label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
								<select id="role" value={role} onChange={(e)=>setRole(e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg">
									<option value="user">User</option>
									<option value="admin">Admin</option>
								</select>
							</div>

							<div>
								<button type="submit" className="w-full py-2 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium shadow">Create account</button>
							</div>
						</form>

						<p className="mt-4 text-sm text-gray-600">Already registered? <Link to="/login" className="text-pink-600 font-medium hover:underline">Sign in</Link></p>
					</div>
				</div>
			</div>
		</div>
	);
}
