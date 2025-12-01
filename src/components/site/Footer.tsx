"use client";

import Image from "next/image";
import { Mail, Phone, Send, Facebook, Twitter, Instagram, Linkedin, ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0E2A47] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* TOP FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12">

          {/* LOGO + CONTACT */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3">
              <Image src="/images/site/igslogo.png" alt="Indoglobalstudies" width={88} height={68} />
              <span className="text-2xl font-bold">Indoglobalstudies</span>
            </div>

            <p className="mt-6 text-gray-300 leading-relaxed max-w-xs">
              <div className="info-text">
            <small>Address</small>
            <strong>2nd Floor, 10 Skyview, South Tower</strong><br/>
            <strong> Sy. No. 83/1, Madhapur, Hyderabad 500081</strong>
          </div>
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-full">
                  <Phone size={18} />
                </div>
                <span className="text-gray-200 font-medium">9912881199</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-full">
                  <Mail size={18} />
                </div>
                <span className="text-gray-200 font-medium">info@indoglobalstudies.org</span>
              </div>
            </div>
          </div>

          {/* NAVIGATION LINKS */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigations</h3>
            <ul className="space-y-3 text-gray-300">
              <li>About Us</li>
              <li>FAQs Page</li>
              <li>Checkout</li>
              <li>Contact</li>
              <li>Blog</li>
            </ul>
          </div>

          {/* NEW CATEGORIES */}
          <div>
            <h3 className="text-lg font-semibold mb-4">New Categories</h3>
            <ul className="space-y-3 text-gray-300">
              <li>Designing</li>
              <li>Business</li>
              <li>Software</li>
              <li>WordPress</li>
              <li>PHP</li>
            </ul>
          </div>

          {/* HELP & SUPPORT */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
            <ul className="space-y-3 text-gray-300">
              <li>Documentation</li>
              <li>Live Chat</li>
              <li>Mail Us</li>
              <li>Privacy</li>
              <li>Faqs</li>
            </ul>
          </div>

          {/* <div>
                <div className="bg-white/5 border border-white/10 px-6 py-5 rounded-xl flex items-center gap-4">
            <Image src="/google-play.png" alt="Google Play" width={36} height={36} />
            <div>
              <p className="font-semibold">Google Play</p>
              <p className="text-sm text-gray-300">Get It Now</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 px-6 py-5 rounded-xl flex items-center gap-4">
            <Image src="/app-store.png" alt="App Store" width={36} height={36} />
            <div>
              <p className="font-semibold">App Store</p>
              <p className="text-sm text-gray-300">Now it Available</p>
            </div>
          </div>
          </div> */}
        </div>

        

        
      </div>
      <div className="border-t border-white/10 mt-12  pt-6">
        {/* SOCIAL + COPYRIGHT */}
        <div className="max-w-7xl mx-auto px-4 md:px-8  flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* COPYRIGHT */}
          <p className="text-gray-300 text-sm">
            © 2025 ApplyTech.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-4">
            <IconCircle><Facebook size={18} /></IconCircle>
            <IconCircle><Twitter size={18} /></IconCircle>
            <IconCircle><Instagram size={18} /></IconCircle>
            <IconCircle><Linkedin size={18} /></IconCircle>
          </div>

          {/* BACK TO TOP */}
          <button className="bg-white/10 hover:bg-white/20 transition p-3 rounded-lg">
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
}

/* SOCIAL ICON ROUND BACKGROUND */
function IconCircle({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/10 p-3 rounded-full cursor-pointer hover:bg-white/20 transition">
      {children}
    </div>
  );
}
