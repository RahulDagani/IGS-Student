"use client";

import { useState } from "react";
import { Save, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SetupSettingsSidebar from "@/app/admin/layout/SetupSettingsSidebar";

export default function AddPaymentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    payment_gateway: "stripe",
    secret_key: "",
    publishable_key: "",
    webhook_secret: "",
    is_active: 1,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked ? 1 : 0 : value,
    });
  };

  const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${BASE_URL}/tenant/settings/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`

        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("Payment configuration added successfully!");
        setTimeout(() => {
          router.push("/admin/setup/payment");
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add payment configuration");
      }
    } catch (error) {
      console.error("Error adding payment configuration:", error);
      setError("Failed to add payment configuration");
    } finally {
      setSaving(false);
    }
  };

  return (
   <div className="flex flex-col lg:flex-row min-h-screen bg-[#0f172a]">
             {/* Sidebar */}
      <SetupSettingsSidebar />
      <div className="flex-1 mt-6 ml-0 lg:ml-6 lg:mt-0 mb-6 bg-[#111827] rounded-xl shadow-lg border border-white/10 p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/admin/setup/payment"
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Payments
          </Link>
          <h1 className="text-2xl font-bold text-white">Add Payment Gateway</h1>
        </div>

        {/* Toast Notifications */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg flex justify-between items-center">
            <p className="text-green-400 text-sm">{success}</p>
            <button
              onClick={() => setSuccess("")}
              className="text-green-400 hover:text-green-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex justify-between items-center">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#111827] rounded-xl shadow-lg border border-white/10 p-6">
            {/* Payment Gateway */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Gateway <span className="text-red-500">*</span>
              </label>
              <select
                name="payment_gateway"
                value={formData.payment_gateway}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F2937] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="stripe">Stripe</option>
                <option value="razorpay">Razorpay</option>
                
              </select>
            </div>

            {/* Secret Key */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Secret Key <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="secret_key"
                placeholder="sk_test_..."
                value={formData.secret_key}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F2937] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Publishable Key */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Publishable Key <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="publishable_key"
                placeholder="pk_test_..."
                value={formData.publishable_key}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F2937] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Webhook Secret */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Webhook Secret
              </label>
              <input
                type="password"
                name="webhook_secret"
                placeholder="whsec_..."
                value={formData.webhook_secret}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F2937] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-400">
                Required for webhook verification (Stripe, etc.)
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                name="is_active"
                id="is_active"
                checked={formData.is_active === 1}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
              />
              <label htmlFor="is_active" className="ml-2 text-sm text-gray-300">
                Set as active payment gateway
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Adding Payment Gateway..." : "Add Payment Gateway"}
            </button>
          </div>

          {/* Configuration Tips */}
          <div className="p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
            <h3 className="text-sm font-medium text-blue-400 mb-2">
              Configuration Tips:
            </h3>
            <ul className="text-xs text-blue-300 space-y-1">
              <li>• For Stripe: Use test keys (sk_test_, pk_test_) for development</li>
              <li>• Webhook secret is required for proper webhook verification</li>
              <li>• Only one payment gateway can be active at a time</li>
              <li>• Keep your secret keys secure and never expose them publicly</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}