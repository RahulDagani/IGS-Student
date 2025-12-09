'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';

interface CollaborationPartner {
  id: number;
  name: string;
  logo: string;
  description: string;
  website_url?: string;
  category: 'university' | 'corporation' | 'government' | 'nonprofit' | 'research';
  country: string;
  established_year?: number;
  key_projects?: string[];
}

interface CollaborationStats {
  total_partners: number;
  universities_count: number;
  corporations_count: number;
  countries_count: number;
  ongoing_projects: number;
}

interface CollaborationComponentProps {
  initialData?: {
    partners: CollaborationPartner[];
    stats: CollaborationStats;
    featured_partners: CollaborationPartner[];
  };
}

const CollaborationComponent = ({ initialData }: CollaborationComponentProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  const data = initialData || {
    partners: [],
    stats: {
      total_partners: 0,
      universities_count: 0,
      corporations_count: 0,
      countries_count: 0,
      ongoing_projects: 0
    },
    featured_partners: []
  };

  // Extract unique categories and countries
  const categories = [
    { id: 'all', name: 'All Partners', icon: 'ri-global-line' },
    { id: 'university', name: 'Universities', icon: 'ri-graduation-cap-line' },
    { id: 'corporation', name: 'Corporations', icon: 'ri-building-line' },
    { id: 'government', name: 'Government', icon: 'ri-government-line' },
    { id: 'nonprofit', name: 'Non-Profit', icon: 'ri-heart-line' },
    { id: 'research', name: 'Research', icon: 'ri-microscope-line' }
  ];

  const countries = Array.from(new Set(data.partners.map(partner => partner.country))).sort();

  // Filter partners
  const filteredPartners = data.partners.filter(partner => {
    const matchesCategory = activeCategory === 'all' || partner.category === activeCategory;
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         partner.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || partner.country === selectedCountry;
    
    return matchesCategory && matchesSearch && matchesCountry;
  });

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'university': return 'ri-graduation-cap-line';
      case 'corporation': return 'ri-building-line';
      case 'government': return 'ri-government-line';
      case 'nonprofit': return 'ri-heart-line';
      case 'research': return 'ri-microscope-line';
      default: return 'ri-global-line';
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'university': return 'bg-blue-100 text-blue-700';
      case 'corporation': return 'bg-green-100 text-green-700';
      case 'government': return 'bg-purple-100 text-purple-700';
      case 'nonprofit': return 'bg-red-100 text-red-700';
      case 'research': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-screen bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Global <span className="text-yellow-300">Collaborations</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Building bridges across borders through strategic partnerships and innovative collaborations
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="font-bold text-2xl">{data.stats.total_partners}+</span>
                <p className="text-sm">Partners Worldwide</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="font-bold text-2xl">{data.stats.countries_count}</span>
                <p className="text-sm">Countries</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="font-bold text-2xl">{data.stats.ongoing_projects}</span>
                <p className="text-sm">Active Projects</p>
              </div>
            </div>
          </div>
        </div>
      </div>
        <Footer />
    
    </>
  );
};

export default CollaborationComponent;