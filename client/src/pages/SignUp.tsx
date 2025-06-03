import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, ApiErrorResponse } from "../api/api";
import axios, { AxiosError } from "axios";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await authService.signUp({
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      // Store email in localStorage for OTP verification
      localStorage.setItem("verificationEmail", formData.email);
      navigate("/verify-email");
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      setError(
        error.response?.data?.message || "An error occurred during sign up"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden h-fit sm:scale-75 scale-90">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-[#7B4BFF] p-6 sm:p-8 md:p-10 text-white sm:flex hidden flex-col justify-start items-center md:items-start text-center md:text-left ">
          <div className="flex items-center mb-6">
            <img
              src="src/assets/tooth_vector.png"
              alt="Dentalign Logo"
              className="h-6 sm:h-7 md:h-8 mr-2"
            />
            <span className="text-xl sm:text-2xl font-bold">Dentalign</span>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 hidden sm:block">
              Create Your Dentalign Account
            </h2>
            <p className="text-sm sm:text-base max-w-xs sm:max-w-sm md:max-w-md">
              Join our support portal to manage your dental alignment journey
              with ease.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:w-1/2 w-full p-8 md:p-10 flex flex-col justify-evenly">
          <div>
            <h2 className="sm:text-4xl text-xl font-semibold text-gray-800 mb-1">
              Sign Up
            </h2>
            <p className="sm:text-lg text-gray-500 mb-6">
              Create an account to get started
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6 text-sm sm:text-base md:text-lg"
          >
            <div>
              <label className="block text-base sm:text-lg md:text-xl font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-base sm:text-lg md:text-xl font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-base sm:text-lg md:text-xl font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-base sm:text-lg md:text-xl font-semibold text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 text-white py-2 sm:py-3 rounded-lg hover:bg-violet-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
            <p className="text-sm sm:text-base text-center mt-4 sm:mt-6 text-gray-600">
              Already have an account?{" "}
              <a
                href="/signin"
                className="text-violet-600 font-semibold hover:underline"
              >
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
