import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Building2, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminRegister() {
    const navigate = useNavigate()
  const [formData, setFormData] = useState({
    adminName: '',
    adminEmail: '',
    companyName: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'adminName':
        return value.length < 2 ? 'Name must be at least 2 characters' : '';
      case 'adminEmail':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email address' : '';
      case 'companyName':
        return value.length < 2 ? 'Company name is required' : '';
      case 'password':
        return value.length < 8 ? 'Password must be at least 8 characters' : '';
      case 'confirmPassword':
        return value !== formData.password ? 'Passwords do not match' : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      alert('Admin account created successfully!');
    } else {
      setErrors(newErrors);
      setTouched({
        adminName: true,
        adminEmail: true,
        companyName: true,
        password: true,
        confirmPassword: true
      });
    }
  };

  const getInputClassName = (fieldName: string) => {
    const baseClass = "w-full pl-11 pr-4 py-3 border rounded-lg transition-all duration-200 outline-none";
    if (touched[fieldName] && errors[fieldName]) {
      return `${baseClass} border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200`;
    }
    if (touched[fieldName] && !errors[fieldName] && formData[fieldName as keyof typeof formData]) {
      return `${baseClass} border-green-400 bg-green-50 focus:border-green-500 focus:ring-2 focus:ring-green-200`;
    }
    return `${baseClass} border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 font-['Inter',sans-serif]">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 order-2 lg:order-1">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <div className="text-white font-bold text-xl">S</div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Sprintly
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Admin Account</h1>
            <p className="text-gray-600">Set up your Sprintly workspace and start managing projects</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Admin Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName('adminName')}
                  placeholder="John Doe"
                />
                {touched.adminName && !errors.adminName && formData.adminName && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
                {touched.adminName && errors.adminName && (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
                )}
              </div>
              {touched.adminName && errors.adminName && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  {errors.adminName}
                </p>
              )}
            </div>

            {/* Admin Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName('adminEmail')}
                  placeholder="admin@company.com"
                />
                {touched.adminEmail && !errors.adminEmail && formData.adminEmail && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
                {touched.adminEmail && errors.adminEmail && (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
                )}
              </div>
              {touched.adminEmail && errors.adminEmail && (
                <p className="text-red-600 text-sm mt-1">{errors.adminEmail}</p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName('companyName')}
                  placeholder="Acme Inc."
                />
                {touched.companyName && !errors.companyName && formData.companyName && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
                {touched.companyName && errors.companyName && (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
                )}
              </div>
              {touched.companyName && errors.companyName && (
                <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName('password')}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName('confirmPassword')}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
            onClick={()=>navigate('/')}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-6"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              Login
            </a>
          </p>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center order-1 lg:order-2 p-8">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-12 w-full max-w-md">
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg transform rotate-2 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-100 rounded"></div>
                  <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-100 rounded"></div>
                  <div className="h-2 bg-gray-100 rounded w-4/6"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Manage Your Team Efficiently
              </h3>
              <p className="text-gray-600">
                Join thousands of teams using Sprintly to streamline their project management
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}