import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [message, setMessage] = useState(null);
    const navigate = useNavigate();



	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage(null);


        try {
			const resp = await axios.post(`${import.meta.env.VITE_backend_url}/auth/login`, { email, password } ,{
                withCredentials: true
            });
			const data = resp?.data || {};

			// store user in context + localStorage
			if (data.user) {

				localStorage.setItem("User", JSON.stringify(data.user));

				// redirect based on role
				const role = (data.user.role || "").toString().toLowerCase();
				if (role === "admin") navigate("/admin/dashboard");
				else navigate("/dashboard");
			}
		} catch (err) {
			const msg = err?.response?.data?.message || err.message || "Network error";
			console.error("Login error:", err);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
				<h2 className="mb-6 text-center text-2xl font-extrabold text-gray-900">Sign in to your account</h2>

				{message && (
					<div
						className={`mb-4 text-sm px-3 py-2 rounded ${
							message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
						}`}
					>
						{message.text}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							Email address
						</label>
						<div className="mt-1">
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								placeholder="you@example.com"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<div className="mt-1 relative">
							<input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								autoComplete="current-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								placeholder="Password"
							/>
							<button
								type="button"
								onClick={() => setShowPassword((s) => !s)}
								className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-600 px-2"
							>
								{showPassword ? "Hide" : "Show"}
							</button>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input id="remember" name="remember" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
							<label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
								Remember me
							</label>
						</div>

						<div className="text-sm">
							<a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
								Forgot your password?
							</a>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
						>
							Sign in
						</button>
                        	<p className="mt-4 text-center text-sm text-gray-600">Don't have an account? <Link to="/register" className="text-pink-600 font-medium hover:underline">Register</Link></p>
					</div>
				</form>
			</div>
		</div>
	);
}
