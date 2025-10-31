// app/register/page.tsx
"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  companyName: string;
  subdomain: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  name?: string;
  companyName?: string;
  subdomain?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string; // Change from boolean to string
  submit?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    name: "",
    companyName: "",
    subdomain: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const validateForm = (): boolean => {
   
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.subdomain.trim()) newErrors.subdomain = "Subdomain is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms";

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
    if (formData.subdomain && !subdomainRegex.test(formData.subdomain)) {
      newErrors.subdomain = "Subdomain can only contain lowercase letters, numbers, and hyphens";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          companyName: formData.companyName,
          subdomain: formData.subdomain,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Redirect to success page or login
      router.push("/admin");
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side Image */}
      <div className="md:w-1/2 w-full h-[40vh] md:h-auto">
        <Image
          height={500}
          width={500}
          className="w-full h-full object-cover"
          src="/images/university.jpg"
          alt="Background"
        />
      </div>

      {/* Right Side Content */}
      <div className="md:w-1/2 w-full flex flex-col justify-center items-center bg-gray-50 p-6 md:p-12 overflow-y-auto">
        {/* Logo */}
        <div className="flex flex-col items-center w-full max-w-md">
          <div className="flex justify-center items-center">
            <Image
              className=""
              src="/images/logo/logo.png"
              alt="Logo"
              width={45}
              height={45}
            />
            <span className="dark:text-black ms-1 text-black font-semibold text-2xl">
              ApplyTech
            </span>
          </div>
          <p className="text-gray-600 text-center mb-8">
            Create your account to get started!
          </p>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-full border border-gray-200 py-3 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1 px-5">{errors.name}</p>}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-full border border-gray-200 py-3 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1 px-5">{errors.email}</p>}
            </div>

            <div>
              <input
                type="text"
                name="subdomain"
                placeholder="Subdomain"
                value={formData.subdomain}
                onChange={handleChange}
                className={`w-full rounded-full border border-gray-200 py-3 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  errors.subdomain ? "border-red-500" : ""
                }`}
              />
              {errors.subdomain && <p className="text-red-500 text-sm mt-1 px-5">{errors.subdomain}</p>}
              <p className="text-gray-500 text-sm mt-1 px-5">
                Your URL will be: {formData.subdomain || "yoursubdomain"}.applytech.org
              </p>
            </div>

            <div>
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                className={`w-full rounded-full border border-gray-200 py-3 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  errors.companyName ? "border-red-500" : ""
                }`}
              />
              {errors.companyName && <p className="text-red-500 text-sm mt-1 px-5">{errors.companyName}</p>}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-full border border-gray-200 py-3 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1 px-5">{errors.password}</p>}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full rounded-full border border-gray-200 py-3 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 px-5">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className={`mr-2 rounded border-gray-300 ${
                    errors.agreeToTerms ? "border-red-500" : ""
                  }`}
                />
                I agree to Terms of Service and Privacy Policy.
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-red-500 text-sm px-5">{errors.agreeToTerms}</p>}

            {errors.submit && (
              <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
                {errors.submit}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn />
              )}
              {loading ? "REGISTERING..." : "REGISTER"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              Already registered?{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Resend Verification Link?
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}