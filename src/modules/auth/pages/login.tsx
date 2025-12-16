import { useState } from "react"
import { useLogin } from "../hooks/useLogin"
import { Link } from "react-router-dom"

export default function Login() {
    const { mutate: login, isPending } = useLogin()

    const [form, setForm] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        login(form)
    }

    return (
        <div className="min-h-screen w-full flex bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 relative overflow-hidden">
            {/* Decorative Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <svg className="absolute top-10 left-10 w-96 h-96 opacity-40" viewBox="0 0 400 400">
                    <path fill="#93C5FD" d="M150,50 Q250,80 300,150 T280,280 Q200,320 120,260 T150,50Z" />
                </svg>
                <svg className="absolute top-1/4 right-20 w-64 h-64 opacity-30" viewBox="0 0 200 200">
                    <path fill="#BFDBFE" d="M100,30 Q150,50 160,100 T120,170 Q70,180 50,130 T100,30Z" />
                </svg>
                <div className="absolute top-20 right-32 w-4 h-4 bg-indigo-400 rounded-full opacity-60"></div>
                <div className="absolute bottom-40 right-1/4 w-3 h-3 bg-blue-400 rounded-full opacity-50"></div>
            </div>

            {/* Left Side - Form */}
            <div className="w-full lg:w-5/12 flex items-center justify-center p-8 relative z-10">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold text-gray-800">Sprintly</span>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">
                                Welcome back
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Sign in to your account to continue
                            </p>
                        </div>

                        {/* THIS IS THE KEY PART - Wrap inputs in form element */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white outline-none transition-all duration-200 placeholder:text-gray-400 text-sm"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Password
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white outline-none transition-all duration-200 placeholder:text-gray-400 text-sm"
                                />
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-gray-600">Remember me</span>
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                                >
                                    Forgot password?
                                </Link>

                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 mt-6"
                            >
                                {isPending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg
                                            className="animate-spin h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Logging in...
                                    </span>
                                ) : (
                                    "LOGIN"
                                )}
                            </button>
                        </form>
                        {/* End of form element */}

                        {/* Footer Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                                >
                                    register?
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Illustration (copy from artifact) */}
            <div className="hidden lg:flex lg:w-7/12 items-center justify-center p-12 relative z-10">
                <div className="relative w-full max-w-4xl">
                    {/* Background Wave Blob */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg viewBox="0 0 800 600" className="w-full h-auto">
                            <defs>
                                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0.4" />
                                </linearGradient>
                            </defs>
                            <path
                                fill="url(#waveGradient)"
                                d="M200,100 Q400,50 500,150 Q600,250 550,350 Q500,450 350,480 Q200,510 100,400 Q0,290 100,200 Q150,150 200,100Z"
                            />
                        </svg>
                    </div>

                    {/* Main Dashboard Card - Centered */}
                    <div className="relative z-20 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200/50 mx-auto max-w-2xl">
                        {/* Dashboard Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="space-y-1">
                                <div className="h-4 w-32 bg-indigo-500 rounded"></div>
                                <div className="h-3 w-24 bg-indigo-300 rounded"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                                <div className="h-3 w-20 bg-indigo-200 rounded"></div>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-3 gap-6">
                            {/* Left Sidebar - Navigation */}
                            <div className="col-span-1 space-y-2">
                                <div className="h-10 bg-indigo-500 rounded-lg"></div>
                                <div className="h-8 bg-indigo-200 rounded-lg"></div>
                                <div className="h-8 bg-indigo-200 rounded-lg"></div>
                                <div className="h-8 bg-indigo-200 rounded-lg"></div>
                                <div className="h-8 bg-indigo-200 rounded-lg"></div>
                            </div>

                            {/* Main Content */}
                            <div className="col-span-2 space-y-4">
                                {/* Chart Area */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-indigo-100">
                                    <div className="relative w-full h-48 flex items-center justify-center">
                                        {/* Pie Chart */}
                                        <svg className="w-40 h-40 transform -rotate-90">
                                            <circle cx="80" cy="80" r="70" fill="none" stroke="#BFDBFE" strokeWidth="20" />
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                fill="none"
                                                stroke="#6366F1"
                                                strokeWidth="20"
                                                strokeDasharray="439.6"
                                                strokeDashoffset="109.9"
                                            />
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                fill="none"
                                                stroke="#818CF8"
                                                strokeWidth="20"
                                                strokeDasharray="439.6"
                                                strokeDashoffset="219.8"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* List Items */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
                                        <div className="w-3 h-3 rounded bg-indigo-500"></div>
                                        <div className="h-2 flex-1 bg-indigo-300 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
                                        <div className="w-3 h-3 rounded bg-indigo-400"></div>
                                        <div className="h-2 flex-1 bg-indigo-200 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
                                        <div className="w-3 h-3 rounded bg-indigo-300"></div>
                                        <div className="h-2 flex-1 bg-indigo-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Person Left - with Chart Board */}
                    <div className="absolute left-8 bottom-8 z-30">
                        <div className="relative">
                            {/* Person */}
                            <div className="w-20 h-32 relative">
                                {/* Head */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-full"></div>
                                {/* Body */}
                                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-12 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-t-xl"></div>
                                {/* Legs */}
                                <div className="absolute top-26 left-1/2 -translate-x-1/2 flex gap-1">
                                    <div className="w-5 h-8 bg-indigo-700 rounded-b-lg"></div>
                                    <div className="w-5 h-8 bg-indigo-700 rounded-b-lg"></div>
                                </div>
                            </div>
                            {/* Chart Board */}
                            <div className="absolute -right-16 top-4 w-16 h-20 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                                <div className="h-full flex items-end justify-around gap-1">
                                    <div className="w-2 bg-indigo-400 rounded-t" style={{ height: '40%' }}></div>
                                    <div className="w-2 bg-indigo-500 rounded-t" style={{ height: '70%' }}></div>
                                    <div className="w-2 bg-indigo-600 rounded-t" style={{ height: '55%' }}></div>
                                    <div className="w-2 bg-indigo-700 rounded-t" style={{ height: '85%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Person Right */}
                    <div className="absolute right-12 bottom-8 z-30">
                        <div className="w-20 h-32 relative">
                            {/* Head */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-full"></div>
                            {/* Body */}
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-12 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-t-xl"></div>
                            {/* Legs */}
                            <div className="absolute top-26 left-1/2 -translate-x-1/2 flex gap-1">
                                <div className="w-5 h-8 bg-indigo-700 rounded-b-lg"></div>
                                <div className="w-5 h-8 bg-indigo-700 rounded-b-lg"></div>
                            </div>
                        </div>
                    </div>

                    {/* 3D Cylinders/Boxes at Bottom */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-3 z-20">
                        <div className="w-12 h-16 bg-gradient-to-br from-indigo-300 to-indigo-400 rounded-lg transform perspective-1000 rotate-y-12"></div>
                        <div className="w-12 h-20 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-lg transform perspective-1000 rotate-y-12"></div>
                        <div className="w-12 h-14 bg-gradient-to-br from-indigo-300 to-indigo-400 rounded-lg transform perspective-1000 rotate-y-12"></div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-12 left-16 w-8 h-8 bg-blue-200 rounded-full opacity-60 animate-bounce"></div>
                    <div className="absolute top-32 right-20 w-6 h-6 bg-indigo-300 rounded-full opacity-50"></div>
                </div>
            </div>
        </div>
    )
}