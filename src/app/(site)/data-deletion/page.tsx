// app/data-deletion/page.tsx
"use client";

import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { Trash2, Mail, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function DataDeletionPage() {
  return (
    <>
      <Header />
      {/* Full Background Header Section */}
      <div className="bg-white content">
        <section className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-b-3xl">
          {/* Data Deletion Heading */}
          <h1 className="text-center text-6xl lg:text-[90px] font-serif font-bold py-20">
            Data Deletion
          </h1>
        </section>

        {/* Data Deletion Content */}
        <div className="min-h-screen w-full bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
           
            {/* Introduction */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Trash2 className="text-blue-600" size={28} />
                <h2 className="text-3xl font-bold">Data Deletion Instructions</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                If you have used our services and would like your data to be deleted, you can request data deletion by contacting us.
              </p>
            </div>

            {/* How to Request Deletion */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="text-blue-600" size={28} />
                <h2 className="text-3xl font-bold">How to request deletion</h2>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 mb-6">
                <div className="flex items-start gap-4 mb-6">
                  <Mail className="text-blue-600 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Send an email to:</h3>
                    <a 
                      href="mailto:support@applytech.org" 
                      className="text-2xl text-blue-600 hover:underline font-medium"
                    >
                      support@applytech.org
                    </a>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Subject line:</h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-300 font-mono text-gray-700">
                    Data Deletion Request
                  </div>
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Include the following information:</h3>
                  <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-3 text-lg">
                    <li>Your name</li>
                    <li>Your email address</li>
                    <li>Description of the data you want deleted</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200 flex items-start gap-4">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={24} />
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold">Our team will review the request and delete your data within a reasonable time.</span>
                </p>
              </div>
            </div>

        

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about the data deletion process, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <Mail size={20} className="text-gray-600" />
                  <p className="text-gray-700">
                    <span className="font-semibold">Email:</span>{" "}
                    <a href="mailto:info@applytech.org" className="text-blue-600 hover:underline">
                      info@applytech.org
                    </a>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <p className="text-gray-700">
                    <span className="font-semibold">Website:</span>{" "}
                    <a 
                      href="https://applytech.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      https://applytech.org
                    </a>
                  </p>
                </div>
              </div>
            </div>

          
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}