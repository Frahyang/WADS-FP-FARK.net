import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService, ApiErrorResponse } from "../api/api";
import { AxiosError } from "axios";

const OTPVerification: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    // Check if user has email in localStorage
    const email = localStorage.getItem("verificationEmail");
    if (!email) {
      navigate("/signup");
    }

    // Start countdown for resend button
    if (resendDisabled) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resendDisabled, navigate]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[name=otp-${index + 1}]`) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=otp-${index - 1}]`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = localStorage.getItem("verificationEmail"); // Get email from localStorage
    if (!email) {
      setError("Email not found. Please sign up again.");
      setLoading(false);
      return;
    }

    try {
      const otpString = otp.join("");
      await authService.verifyOtp(email, otpString); // Pass email and otp
      localStorage.removeItem("verificationEmail"); // Clean up
      navigate("/signin");
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      setError(error.response?.data?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setResendDisabled(true);
    setCountdown(60);

    const email = localStorage.getItem("verificationEmail"); // Get email from localStorage
    if (!email) {
      setError("Email not found. Please sign up again.");
      setResendDisabled(false);
      return;
    }

    try {
      await authService.resendOtp(email); // Pass email
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      setError(error.response?.data?.message || "Failed to resend verification code");
      setResendDisabled(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden h-fit sm:scale-75 scale-90">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-[#7B4BFF] p-6 sm:p-8 md:p-10 text-white sm:flex hidden flex-col justify-start items-center md:items-start text-center md:text-left">
          <div className="flex items-center mb-6">
            <img src="src/assets/tooth_vector.png" alt="Dentalign Logo" className="h-6 sm:h-7 md:h-8 mr-2" />
            <span className="text-xl sm:text-2xl font-bold">Dentalign</span>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5">
              Verify Your Email
            </h2>
            <p className="text-sm sm:text-base max-w-xs sm:max-w-sm md:max-w-md">
              Please enter the verification code sent to your email address to complete your registration.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:w-1/2 w-full p-8 md:p-10 flex flex-col justify-evenly">
          <div>
            <h2 className="sm:text-4xl text-xl font-semibold text-gray-800 mb-1">Enter Verification Code</h2>
            <p className="sm:text-lg text-gray-500 mb-6">Please enter the 6-digit code sent to your email</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-sm sm:text-base md:text-lg">
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  name={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  maxLength={1}
                  pattern="\d*"
                  inputMode="numeric"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 text-white py-2 sm:py-3 rounded-lg hover:bg-violet-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>

            <div className="text-center">
              <p className="text-sm sm:text-base text-gray-600">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendDisabled}
                  className="text-violet-600 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendDisabled ? `Resend in ${countdown}s` : "Resend Code"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification; 
