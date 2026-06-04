"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, User, ChevronLeftIcon, Save, CheckCircle, X, Info, GraduationCap, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";


// Types for country data
interface Country {
  id: number;
  name: string;
  dial_code: string;  // mapped from phone_code
  code: string;       // mapped from iso_code
  flag: string;
}

// Phone Input with Country Code — matches admin add-student style
const PhoneInput = ({
  value,
  onChange,
  name,
  error,
  disabled = false,
  selectedCountry,
  onCountryChange,
  allCountries = [],
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  error?: string;
  disabled?: boolean;
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  allCountries?: Country[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const filtered = search.trim()
    ? (allCountries || []).filter((c: Country) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dial_code.includes(search) ||
        c.code.toLowerCase().startsWith(search.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => searchRef.current?.focus(), 0);
  };

  return (
    <div ref={containerRef}>
      <div className="flex gap-2">
        {/* Country code button */}
        <div className="relative">
          <button
            type="button"
            onClick={handleOpen}
            disabled={disabled}
            className={`flex items-center gap-1.5 h-11 px-3 rounded-lg border bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span className="text-base leading-none">{selectedCountry?.flag}</span>
            <span className="text-xs font-medium min-w-[36px]">{selectedCountry?.dial_code ?? "—"}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => { setIsOpen(false); setSearch(""); }} />
              <div
                className="absolute left-0 z-20 mt-1 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search country name or code..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {!search.trim() ? (
                    <div className="px-3 py-4 text-sm text-center text-gray-400 dark:text-gray-500">
                      Type to search countries...
                    </div>
                  ) : filtered.length > 0 ? filtered.map(c => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => { onCountryChange(c); setIsOpen(false); setSearch(""); }}
                      className={`flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        selectedCountry?.code === c.code ? "bg-brand-50 dark:bg-brand-900/20" : ""
                      }`}
                    >
                      <span className="text-base w-6 text-center">{c.flag}</span>
                      <span className="flex-1 text-left text-gray-700 dark:text-gray-300 truncate">{c.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{c.dial_code}</span>
                    </button>
                  )) : (
                    <div className="px-3 py-4 text-sm text-center text-gray-400">No countries found</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Phone number input */}
        <input
          type="tel"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder="Phone number"
          className={`h-11 flex-1 rounded-lg border px-4 text-sm text-gray-700 dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 ${
            error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};


// InputField component
const InputField = ({
  type,
  placeholder,
  value,
  onChange,
  name,
  error,
  icon: Icon,
  disabled = false
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  error?: string;
  icon?: React.ComponentType<{className?: string}>;
  disabled?: boolean;
}) => (
  <div>
    <div className="relative">
      {Icon && (
        <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
          disabled ? "text-gray-300 dark:text-gray-600" : "text-gray-400"
        }`} />
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
          error ? "border-red-500" : ""
        } ${Icon ? "pl-10" : ""} ${
          disabled ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed" : ""
        }`}
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Button component
const Button = ({
  children,
  onClick,
  disabled,
  className = "",
  size = "md",
  type = "button"
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
  type?: "button" | "submit";
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
      size === "sm" ? "py-3 text-sm" : "py-3"
    } ${className}`}
  >
    {children}
  </button>
);

// Label component
const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

// Alert component
interface AlertProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}

const Alert = ({ type, message, onClose }: AlertProps) => {
  const bgColors = {
    success: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    error: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
  };

  const textColors = {
    success: 'text-green-700 dark:text-green-300',
    error: 'text-red-700 dark:text-red-300',
    info: 'text-blue-700 dark:text-blue-300'
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  return (
    <div className={`flex items-center justify-between p-4 mb-4 border rounded-lg ${bgColors[type]}`}>
      <div className="flex items-center gap-3">
        <div className={`${textColors[type]}`}>
          {icons[type]}
        </div>
        <p className={`text-sm ${textColors[type]}`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default function StudentRegistrationPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    id: 0, name: "India", dial_code: "+91", code: "IN", flag: "🇮🇳",
  });

  const BASE_URL_PUBLIC = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;
  useEffect(() => {
    fetch(`${BASE_URL_PUBLIC}/countries`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const list: Country[] = (d.data || []).map((c: any) => ({
            id: c.id,
            name: c.name,
            dial_code: c.phone_code,
            code: c.iso_code,
            flag: c.flag || "",
          }));
          setAllCountries(list);
          const india = list.find(c => c.code === "IN") || list[0];
          if (india) setSelectedCountry(india);
        }
      })
      .catch(() => {});
  }, []);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  const [errors, setErrors] = useState<{
    firstName?: string;
    middleName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    submit?: string;
  }>({});
  const [alert, setAlert] = useState<{type: 'success' | 'error' | 'info'; message: string} | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;

  // Auto-hide alert after 5 seconds
  useEffect(() => {
    if (showAlert && alert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert, alert]);

  const showAlertMessage = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ type, message });
    setShowAlert(true);
  };

  const handleGoogleSuccess = () => {
    router.push('/student');
  };

  const handleGoogleError = (error: string) => {
    setErrors({ submit: error });
    showAlertMessage('error', error);
  };

  const validateDetails = (): boolean => {
    const newErrors: {
      firstName?: string;
      middleName?: string;
      lastName?: string;
      phoneNumber?: string;
      email?: string;
    } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else {
      const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        newErrors.phoneNumber = "Please enter a valid phone number";
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateDetails()) return;

    setLoading(true);

    try {
      const fullPhoneNumber = `${selectedCountry.dial_code}${formData.phoneNumber.replace(/\D/g, '')}`;

      const payload: {
        first_name: string;
        last_name: string;
        phone_number: string;
        email: string;
        middle_name?: string;
      } = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone_number: fullPhoneNumber,
        email: formData.email,
      };

      if (formData.middleName.trim()) {
        payload.middle_name = formData.middleName.trim();
      }

      const response = await fetch(`${BASE_URL}/student/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setRegisteredEmail(formData.email);
        setRegistrationComplete(true);
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to register. Please try again.";
      setErrors({ submit: errorMessage });
      showAlertMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const phoneValue = value.replace(/[^\d\s\-\(\)\+]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: phoneValue,
      }));
      if (errors.phoneNumber) {
        setErrors(prev => ({ ...prev, phoneNumber: undefined }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      if (errors[name as keyof typeof errors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col flex-1 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md sm:pt-10 mx-auto mb-5 px-4 sm:px-0">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back
          </button>
        </div>

        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4 sm:px-0">
          <div>
            <div className="mb-5 sm:mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-brand-50 rounded-lg dark:bg-brand-900/20">
                  <GraduationCap className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-3xl">
                  Student Registration
                </h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your details to create an account
              </p>
            </div>

            {registrationComplete ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Registration Successful!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We've sent a password setup link to
                </p>
                <p className="font-medium text-gray-800 dark:text-white mb-6">
                  {registeredEmail}
                </p>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800 text-left mb-6">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Next steps:
                  </p>
                  <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                    <li>• Check your inbox for an email from us</li>
                    <li>• Check your spam folder if you don't see it</li>
                    <li>• Click the link in the email to set your password</li>
                    <li>• The link is valid for 7 days</li>
                  </ul>
                </div>
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400 text-sm"
                >
                  Already set your password? Sign in
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <GoogleLoginButton
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    role="student"
                  />
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                      Or sign up with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmitDetails}>
                  <div className="space-y-6">
                    {/* First Name Field */}
                    <div>
                      <Label required>First Name</Label>
                      <InputField
                        type="text"
                        name="firstName"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                        icon={User}
                      />
                    </div>

                    {/* Middle Name Field - Optional */}
                    <div>
                      <Label>Middle Name <span className="text-gray-400 text-xs">(Optional)</span></Label>
                      <InputField
                        type="text"
                        name="middleName"
                        placeholder="Enter your middle name (if any)"
                        value={formData.middleName}
                        onChange={handleChange}
                        error={errors.middleName}
                        icon={User}
                      />
                    </div>

                    {/* Last Name Field */}
                    <div>
                      <Label required>Last Name</Label>
                      <InputField
                        type="text"
                        name="lastName"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                        icon={User}
                      />
                    </div>

                    <div>
                      <Label required>Phone Number</Label>
                      <PhoneInput
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        error={errors.phoneNumber}
                        selectedCountry={selectedCountry}
                        onCountryChange={handleCountryChange}
                        allCountries={allCountries}
                      />
                    </div>

                    <div>
                      <Label required>Email Address</Label>
                      <InputField
                        type="email"
                        name="email"
                        placeholder="student@university.edu"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        icon={Mail}
                      />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        We'll send a password setup link to this email.
                      </p>
                    </div>

                    {/* Display submit errors from API */}
                    {errors.submit && (
                      <Alert
                        type="error"
                        message={errors.submit}
                        onClose={() => setErrors(prev => ({ ...prev, submit: undefined }))}
                      />
                    )}

                    <div>
                      <Button
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        {loading ? "PROCESSING..." : "REGISTER"}
                      </Button>
                    </div>
                  </div>
                </form>
              </>
            )}

            {!registrationComplete && (
              <div className="mt-5">
                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
