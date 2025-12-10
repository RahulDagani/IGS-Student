// app/contact/page.tsx
"use client";

import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { LandPlot, MessageCircle } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;

    try {
      const response = await fetch(`${BASE_URL}/front/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Header />
      {/* Full Background Header Section */}
      <div className="bg-white content">
        <section className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-b-3xl">
        
        {/* Top Navigation */}
        

        {/* Contact Heading */}
        <h1 className="text-center text-6xl lg:text-[90px] font-serif font-bold py-20">
          Contact
        </h1>
        </section>
      

      {/* Floating Info Box */}
      <div className="w-full px-6 lg:px-20 flex justify-center mt-[-70px]">
        <div className="w-full max-w-6xl bg-white border border-black rounded-3xl shadow-md p-10 flex flex-col lg:flex-row gap-10 relative">

          {/* Address */}
          <div className="flex items-start gap-6 flex-1">
            {/* Icon */}
            <div className="flex items-center mt-10 ">
              <LandPlot size={30}/>
            </div>

            {/* Text */}
            <div>
              <h3 className="text-2xl font-bold mb-2">Address</h3>
              <p className="text-lg leading-relaxed text-gray-800">
                2nd Floor, 10 Skyview, South Tower <br />
                Sy. No. 83/1, Madhapur, Hyderabad 500081
              </p>
            </div>
          </div>

          {/* Divider (Desktop Only) */}
          <div className="hidden lg:flex items-center">
            <div className="h-40 w-px bg-black"></div>
          </div>

          {/* Client Portal */}
          <div className="flex items-start gap-6 flex-1">
            {/* Icon */}
            <div className="flex items-center mt-10 ">
              <MessageCircle size={30}/>
            </div>
            
            {/* Text */}
            <div>
              <h3 className="text-2xl font-bold mb-2">Client portal</h3>
              <p className="text-lg leading-relaxed text-gray-800">
                Give us call <br />
                at +91 9912881199
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="min-h-screen w-full bg-white">
        {/* Container */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* LEFT SIDE TEXT */}
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
              {"We'd love to"} <br /> {"hear from you!"}
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
              {"We're here to provide fast, accurate, and helpful responses – just ask!"}
            </p>
          </div>

          {/* RIGHT SIDE FORM */}
          <div>
            {/* Status Messages */}
            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                {"Thank you for your message! We'll get back to you soon."}
              </div>
            )}
            
            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                There was an error sending your message. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:ring-1 focus:ring-black focus:outline-none"
                >
                  <option value="">Select subject</option>
                  <option value="Partnership Inquiry">Partnership Inquiry</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Support">Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message *
                </label>
                <textarea
                  name="message"
                  placeholder="Enter your message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full h-40 border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:ring-1 focus:ring-black focus:outline-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-4 rounded-lg text-lg font-medium hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>

      </div>


      {/* HELP SECTION */}
      <Footer />
    </>
  );
}