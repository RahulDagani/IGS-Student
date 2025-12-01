"use client";

import { useState } from "react";
import { ChevronLeftIcon, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Reuse components from login page
const InputField = ({ 
  type, 
  placeholder, 
  value, 
  onChange, 
  name,
  error 
}: { 
  type: string; 
  placeholder: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  error?: string;
}) => (
  <div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
        error ? "border-red-500" : ""
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const Button = ({ 
  children, 
  onClick, 
  disabled, 
  className = "",
  size = "md"
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
      size === "sm" ? "py-3 text-sm" : "py-3"
    } ${className}`}
  >
    {children}
  </button>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
    {children}
  </label>
);

export default function AgentForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          userType: 'agent',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }

      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      {/* Left Side - Form Content */}
      <div className="flex flex-col flex-1 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md sm:pt-10 mx-auto mb-5 px-4 sm:px-0">
          <Link
            href="/signin/agent"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to login
          </Link>
        </div>

        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4 sm:px-0">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-3xl">
                Reset Your Password
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {success 
                  ? "Check your email for reset instructions" 
                  : "Enter your email address and we'll send you instructions to reset your password"
                }
              </p>
            </div>

            {success ? (
              <div className="space-y-6">
                <div className="p-4 text-green-700 bg-green-50 rounded-lg dark:bg-green-900/20 dark:text-green-400">
                  <p className="text-sm">
                    If an account exists with <strong>{email}</strong>, you will receive password reset instructions shortly.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => router.push("/agent-login")}
                    size="sm"
                  >
                    Return to Sign In
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setSuccess(false);
                      setEmail("");
                    }}
                    size="sm"
                    className="bg-gray-500 hover:bg-gray-600"
                  >
                    Reset Another Email
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <Label>
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <InputField 
                      type="email"
                      name="email"
                      placeholder="agent@company.com"
                      value={email}
                      onChange={handleChange}
                      error={error}
                    />
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg dark:bg-red-900/20">
                      {error}
                    </div>
                  )}

                  <div>
                    <Button 
                      size="sm" 
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Mail className="w-5 h-5" />
                      )}
                      {loading ? "SENDING..." : "SEND RESET INSTRUCTIONS"}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400">
                Remember your password?{" "}
                <Link
                  href="/signin/agent"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Back to sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}