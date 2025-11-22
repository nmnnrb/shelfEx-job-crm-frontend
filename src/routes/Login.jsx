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
			const resp = await axios.post(`/api/auth/login`, { email, password } ,{
                withCredentials: true
            });
			const data = resp?.data || {};

			// store user in context + localStorage
			if (data.user) {

				localStorage.setItem("User", JSON.stringify(data.user));
				// store token if backend returned one (used for socket auth)
				if (data.token) localStorage.setItem('token', data.token);

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

    const adminCred = () => {
        setEmail("admin@shelfEx.com");
        setPassword("admin@shelfEx.com");
    }

    const dummy1 = () => {
        setEmail("m@m.com");
        setPassword("namannaman");
    }

    const dummy2 = () => {
         setEmail("Dummy2@temp.com");
        setPassword("Dummy2@temp.com");
    }

	    return (
            <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-purple-50 to-indigo-50 flex items-center">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="hidden md:flex flex-col justify-center p-8 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-lg shadow-lg">
                            <h3 className="text-3xl text-center font-bold">Join ShelfEx</h3>
                            <p className="mt-3 text-pink-100 text-center max-w-md">Create an account to track jobs, applicants and collaborate with your team.</p>
                            <div className="mt-6 flex flex-wrap bg-black/20 rounded-2xl py-4 px-4 justify-center  gap-3">
                                <span onClick={adminCred} className="inline-block px-3 py-1 bg-white/20 rounded">Admin Credential</span>
                                <span onClick={dummy1} className="inline-block px-3 py-1 bg-white/20 rounded">Dummy User1</span>
                                <span onClick={dummy2} className="inline-block px-3 py-1 bg-white/20 rounded">Dummy User2</span>
                            </div>
                        </div>
    
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h2 className="text-2xl font-extrabold font-mono mb-4 text-gray-900">Login</h2>
    
                            {message && (
                                <div className={`mt-4 p-3 rounded text-sm ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
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
                </div>
            </div>
        );
}

