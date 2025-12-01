"use client";

import { useState, useEffect } from "react";
import SetupSettingsSidebar from "@/app/admin/layout/SetupSettingsSidebar";
import { Save, X, TestTube2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface MailConfiguration {
  mail_mailer: string;
  mail_host: string;
  mail_port: number;
  mail_username: string;
  mail_password: string;
  mail_encryption: string;
  mail_from_address: string;
  mail_from_name: string;
}

export default function MailConfigurationPage() {
  const [formData, setFormData] = useState({
    mail_mailer: "smtp",
    mail_host: "",
    mail_port: 587,
    mail_username: "",
    mail_password: "",
    mail_encryption: "tls",
    mail_from_address: "",
    mail_from_name: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  // Toast states
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [testResult, setTestResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch mail configuration
  useEffect(() => {
    fetchMailConfiguration();
  }, []);

  // Auto-hide toasts after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Auto-hide test result after 8 seconds
  useEffect(() => {
    if (testResult) {
      const timer = setTimeout(() => {
        setTestResult(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [testResult]);

  const showToast = (message: string, type: "success" | "error") => {
    if (type === "success") {
      setSuccess(message);
      setError("");
    } else {
      setError(message);
      setSuccess("");
    }
  };

    const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;
    const { token } = useAuth();

  const fetchMailConfiguration = async () => {
    try {
      const response = await fetch(`${BASE_URL}/tenant/settings/mail`,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.data) {
        const settings = data.data;
        setFormData({
          mail_mailer: settings.mail_mailer || "smtp",
          mail_host: settings.mail_host || "",
          mail_port: settings.mail_port || 587,
          mail_username: settings.mail_username || "",
          mail_password: settings.mail_password || "",
          mail_encryption: settings.mail_encryption || "tls",
          mail_from_address: settings.mail_from_address || "",
          mail_from_name: settings.mail_from_name || "",
        });
      } else {
        // If no configuration exists yet, use defaults
        console.log("No existing mail configuration found, using defaults");
      }
    } catch (error) {
      console.error("Error fetching mail configuration:", error);
      showToast("Failed to load mail configuration", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Convert port to number if it's the port field
    if (name === "mail_port") {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${BASE_URL}/tenant/settings/mail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast("Mail configuration saved successfully!", "success");
      } else {
        const errorData = await response.json();
        showToast(
          errorData.message || "Failed to save mail configuration",
          "error"
        );
      }
    } catch (error) {
      console.error("Error saving mail configuration:", error);
      showToast("Failed to save mail configuration", "error");
    } finally {
      setSaving(false);
    }
  };

  const isTestButtonDisabled =
    !formData.mail_host ||
    !formData.mail_port ||
    !formData.mail_username ||
    !formData.mail_password;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0f172a]">
        <SetupSettingsSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">
            Loading mail configuration...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0f172a]">
      {/* Sidebar */}
      <SetupSettingsSidebar />

      {/* Main Content */}
      <div className="flex-1 mt-6 ml-0 lg:ml-6 lg:mt-0 mb-6 bg-[#111827] rounded-xl shadow-lg border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">
          Mail Configuration
        </h2>

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

        {/* Test Connection Result */}
        {testResult && (
          <div
            className={`mb-6 p-4 border rounded-lg flex justify-between items-center ${
              testResult.type === "success"
                ? "bg-green-500/10 border-green-500"
                : "bg-red-500/10 border-red-500"
            }`}
          >
            <p
              className={`text-sm ${
                testResult.type === "success"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {testResult.message}
            </p>
            <button
              onClick={() => setTestResult(null)}
              className={`${
                testResult.type === "success"
                  ? "text-green-400"
                  : "text-red-400"
              } hover:opacity-70`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* MAIL MAILER */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              MAIL MAILER <span className="text-red-500">*</span>
            </label>
            <select
              name="mail_mailer"
              value={formData.mail_mailer}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 bg-[#1F2937] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="smtp">SMTP</option>
              <option value="sendmail">Sendmail</option>
              <option value="mailgun">Mailgun</option>
              <option value="ses">Amazon SES</option>
            </select>
          </div>

          {/* MAIL HOST */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              MAIL HOST <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mail_host"
              placeholder="smtp.gmail.com"
              value={formData.mail_host}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 bg-[#1F2937] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* MAIL PORT */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              MAIL PORT <span className="text-red-500">*</span>
            </label>
            <select
              name="mail_port"
              value={formData.mail_port}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 bg-[#1F2937] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={587}>587 (TLS)</option>
              <option value={465}>465 (SSL)</option>
              <option value={25}>25</option>
              <option value={2525}>2525</option>
            </select>
          </div>

          {/* MAIL USERNAME */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              MAIL USERNAME <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mail_username"
              placeholder="your-email@gmail.com"
              value={formData.mail_username}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 bg-[#1F2937] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* MAIL PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              MAIL PASSWORD <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="mail_password"
              placeholder="Enter your email password or app password"
              value={formData.mail_password}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 bg-[#1F2937] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-400">
              For Gmail, use an App Password instead of your regular password.
            </p>
          </div>

          {/* MAIL ENCRYPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              MAIL ENCRYPTION <span className="text-red-500">*</span>
            </label>
            <select
              name="mail_encryption"
              value={formData.mail_encryption}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 bg-[#1F2937] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="tls">TLS</option>
              <option value="ssl">SSL</option>
              <option value="">None</option>
            </select>
          </div>

          {/* MAIL FROM ADDRESS */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              MAIL FROM ADDRESS <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="mail_from_address"
              placeholder="noreply@yourdomain.com"
              value={formData.mail_from_address}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 bg-[#1F2937] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* MAIL FROM NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              MAIL FROM NAME <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mail_from_name"
              placeholder="Your Company Name"
              value={formData.mail_from_name}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 bg-[#1F2937] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>

            
          </div>

          {/* Configuration Tips */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
            <h3 className="text-sm font-medium text-blue-400 mb-2">
              Configuration Tips:
            </h3>
            <ul className="text-xs text-blue-300 space-y-1">
              <li>
                • For Gmail: Use port 587 with TLS, and enable 2-factor
                authentication with an App Password
              </li>
              <li>• For Outlook/Hotmail: Use port 587 with TLS</li>
              <li>• For Yahoo: Use port 465 with SSL</li>
              <li>
                • Make sure your firewall allows outbound connections on the
                specified port
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}