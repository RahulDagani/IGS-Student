"use client";

import { useState, useEffect } from "react";
import { Phone, ChevronLeftIcon, CheckCircle, X, ChevronDown, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import countries from "country-list-with-dial-code-and-flag";

// Types for country data
interface Country {
  name: string;
  dial_code: string;
  code: string;
  flag: string;
}

// InputField component
const InputField = ({ 
  type, 
  placeholder, 
  value, 
  onChange, 
  name,
  error,
  icon: Icon,
  disabled = false,
  required = false
}: { 
  type: string; 
  placeholder: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  error?: string;
  icon?: React.ComponentType<{className?: string}>;
  disabled?: boolean;
  required?: boolean;
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
        required={required}
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

// Phone Input with Country Code
const PhoneInput = ({
  value,
  onChange,
  name,
  error,
  disabled = false,
  selectedCountry,
  onCountryChange
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  error?: string;
  disabled?: boolean;
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get all countries using getAll() method
  const allCountries = countries.getAll() as Country[];
  
  // Filter countries based on search
  const filteredCountries = allCountries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dial_code.includes(searchTerm) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex">
        {/* Country Code Dropdown */}
        <div className="relative mr-2">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            className={`flex items-center gap-2 px-3 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 ${
              error ? "border-red-500" : ""
            } ${disabled ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-50" : ""}`}
          >
            <span className="text-gray-700 dark:text-gray-300">{selectedCountry.flag}</span>
            <span className="text-gray-700 dark:text-gray-300">{selectedCountry.dial_code}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* Country Dropdown Menu */}
          {isOpen && (
            <>
              {/* Overlay */}
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              
              {/* Dropdown */}
              <div className="absolute left-0 z-20 w-72 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                {/* Search Input */}
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    autoFocus
                  />
                </div>
                
                {/* Country List */}
                <div className="max-h-60 overflow-y-auto">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => {
                        onCountryChange(country);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="text-xl mr-3">{country.flag}</span>
                      <span className="flex-1 text-left text-gray-700 dark:text-gray-300">
                        {country.name}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {country.dial_code}
                      </span>
                    </button>
                  ))}
                  
                  {filteredCountries.length === 0 && (
                    <div className="px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="flex-1 relative">
          <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            disabled ? "text-gray-300 dark:text-gray-600" : "text-gray-400"
          }`} />
          <input
            type="tel"
            name={name}
            placeholder="Phone number"
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full px-4 py-3 pl-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              error ? "border-red-500" : ""
            } ${disabled ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed" : ""}`}
          />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Button component
const Button = ({ 
  children, 
  onClick, 
  disabled, 
  className = "",
  type = "button"
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white font-semibold rounded-lg py-3 flex items-center justify-center gap-2 transition-all duration-200 ${className}`}
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
    info: <X className="w-5 h-5" />
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

export default function SavePhonePage() {
  const router = useRouter();
  const { login, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  }>({});
  const [alert, setAlert] = useState<{type: 'success' | 'error' | 'info'; message: string} | null>(null);
  
  const allCountries = countries.getAll() as Country[];
  const defaultCountry = allCountries.find(c => c.code === "US") || allCountries[0];
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry);

  const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setFetchingUser(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/student`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        
        if (data.success && data.data) {
          setFormData({
            firstName: data.data.first_name || "",
            middleName: data.data.middle_name || "",
            lastName: data.data.last_name || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setFetchingUser(false);
      }
    };

    fetchUserData();
  }, [token, BASE_URL]);

  const validateForm = (): boolean => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
    } = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Phone validation
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else {
      const phoneDigits = phoneNumber.replace(/\D/g, '');
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        newErrors.phoneNumber = "Please enter a valid phone number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setAlert(null);
    
    try {
      // Combine country code with phone number and remove all non-digit characters
      const fullPhoneNumber = `${selectedCountry.dial_code}${phoneNumber.replace(/\D/g, '')}`;
      
      // Prepare payload with name fields
      const payload: {
        first_name: string;
        last_name: string;
        phone_number: string;
        middle_name?: string;
      } = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone_number: fullPhoneNumber,
      };

      // Only add middle_name if it's not empty
      if (formData.middleName.trim()) {
        payload.middle_name = formData.middleName.trim();
      }
      
      const response = await fetch(`${BASE_URL}/student/save-basic-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Login the user with the returned data
        if (data.data?.user && data.data?.token) {
          login(data.data.user, data.data.token);
          
          setAlert({
            type: 'success',
            message: data.message || 'Profile updated successfully! Redirecting...'
          });

          // Redirect to home page
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          throw new Error("Invalid response format from server");
        }
      } else {
        throw new Error(data.message || "Failed to save profile");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save profile. Please try again.";
      setAlert({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits, spaces, and basic phone number characters
    const value = e.target.value.replace(/[^\d\s\-\(\)\+]/g, '');
    setPhoneNumber(value);
    if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: undefined }));
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
  };

  if (fetchingUser) {
    return (
      <div className="min-h-screen flex flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-1 flex-col bg-white dark:bg-gray-900">
      <div className="w-full max-w-md mx-auto pt-10 px-4 sm:px-0">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-8"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-3xl mb-2">
            Complete Your Profile
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please provide your name and phone number to continue.
          </p>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name Field */}
          <div>
            <Label required>First Name</Label>
            <InputField 
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleNameChange}
              error={errors.firstName}
              icon={User}
              disabled={loading}
              required
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
              onChange={handleNameChange}
              icon={User}
              disabled={loading}
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
              onChange={handleNameChange}
              error={errors.lastName}
              icon={User}
              disabled={loading}
              required
            />
          </div>

          {/* Phone Number Field */}
          <div>
            <Label required>Phone Number</Label>
            <PhoneInput
              name="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneChange}
              error={errors.phoneNumber}
              selectedCountry={selectedCountry}
              onCountryChange={handleCountryChange}
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Save Profile"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}