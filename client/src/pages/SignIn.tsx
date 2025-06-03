import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, ApiErrorResponse } from "../api/api";
import { AxiosError } from "axios";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.signIn({
        email: formData.email,
        password: formData.password,
      });

      // Check if user needs verification
      if (response.needsVerification) {
        // Store email in localStorage for OTP verification
        localStorage.setItem("verificationEmail", response.email);
        navigate("/verify-email");
        return;
      }

      // Store token in localStorage if remember me is checked
      if (formData.rememberMe) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      } else {
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("user", JSON.stringify(response.user));
      }
      
      console.log("User ID:", response.user.id);
      // Redirect based on user role
      if (response.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/tickets");
      }
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
         // Check if the error is an Axios error with a response
      if (error.response) {
        // Check if the status is 403 and needsVerification is true
        if (error.response.status === 403 && error.response.data?.needsVerification) {
          // Store email in localStorage for OTP verification
          localStorage.setItem("verificationEmail", error.response.data.email || formData.email);
          navigate("/verify-email");
          return;
        } else {
          // For other API errors with a response, display the server's message
          setError(error.response.data?.message || "An error occurred during sign in");
        }
      } else {
        // For network errors or other issues without a response
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden h-fit sm:scale-75 scale-90">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-[#7B4BFF] p-6 sm:p-8 md:p-10 text-white sm:flex hidden flex-col justify-start items-center md:items-start text-center md:text-left ">
          <div className="flex items-center mb-6">
            <img src="src/assets/tooth_vector.png" alt="Dentalign Logo" className="h-6 sm:h-7 md:h-8 mr-2" />
            <span className="text-xl sm:text-2xl font-bold">Dentalign</span>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5">
              Welcome to Dentalign Support Portal
            </h2>
            <p className="text-sm sm:text-base max-w-xs sm:max-w-sm md:max-w-md">
              Get assistance with your dental alignment journey through our dedicated ticketing system.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:w-1/2 w-full p-8 md:p-10 flex flex-col justify-evenly">
          <div>
            <h2 className="sm:text-4xl text-xl font-semibold text-gray-800 mb-1">Sign In</h2>
            <p className="sm:text-lg text-gray-500 mb-6">Please sign in to access your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-sm sm:text-base md:text-lg">
            <div>
              <label className="block text-base sm:text-lg md:text-xl font-semibold text-gray-700">Email</label>
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
              <label className="block text-base sm:text-lg md:text-xl font-semibold text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm sm:text-base">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="mr-2 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
                />
                Remember me
              </label>
              <a href="#" className="text-sm sm:text-base text-violet-600 hover:underline cursor-pointer">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 text-white py-2 sm:py-3 rounded-lg hover:bg-violet-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-sm sm:text-base text-center mt-4 sm:mt-6 text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="text-violet-600 font-semibold hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
