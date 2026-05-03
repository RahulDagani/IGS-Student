"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap } from "lucide-react";

interface Notification {
  id: number;
  type: string;
  message: string;
  path: string;
  is_read: number;
  created_at: string;
  updated_at: string;
  sender_id: number;
  sender_name: string;
  sender_email: string;
  sender_type: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      current_page: number;
      per_page: number;
      total_pages: number;
      total_records: number;
    };
    unread_counts: {
      total: number;
      by_type: Record<string, number>;
    };
  };
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { token } = useAuth();
  const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;

  const fetchNotifications = useCallback(async () => {
    if (!token || !BASE_URL) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${BASE_URL}/notifications?limit=4&is_read=0`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setNotifications(data.data.notifications);
        setUnreadCount(data.data.unread_counts.total);
      } else {
        throw new Error('Failed to load notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [token, BASE_URL]);

  useEffect(() => {
    fetchNotifications();
    
    // Optional: Set up polling for real-time updates
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Refresh notifications when opening dropdown
      fetchNotifications();
    }
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'student':
        return '/images/user/user-01.jpg';
      case 'agent':
        return '/images/user/user-02.jpg';
      case 'application':
        return '/images/user/user-03.jpg';
      default:
        return '/images/user/user-01.jpg';
    }
  };

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'student':
        return 'New Student';
      case 'agent':
        return 'New Agent';
      case 'application':
        return 'Application Update';
      default:
        return 'Notification';
    }
  };

  const parseHtmlMessage = (html: string) => {
    // Create a temporary div to parse HTML and extract text
    const div = document.createElement('div');
    div.innerHTML = html;
    
    // Convert to plain text and handle formatting
    const text = div.textContent || div.innerText || '';
    
    // Split by <b> tags to identify bold parts
    const parts = html.split(/<b>|<\/b>/);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <span key={index} className="font-medium text-gray-800 dark:text-white/90">{part}</span>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="relative">
      <button
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        <span
          className={`absolute z-10 h-5 w-5 flex justify-center items-center rounded-full bg-orange-400 text-white ${
            unreadCount === 0 ? "hidden" : "flex"
          }`}
          style={{
    right: "-5px",
    top: "1px",
    fontSize:" 12px"
          }}
        >{unreadCount}
         
        </span>
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-orange-100 text-orange-600 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition dropdown-toggle dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {loading ? (
            <li className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </li>
          ) : error ? (
            <li className="text-center py-8 text-red-500">{error}</li>
          ) : notifications.length === 0 ? (
            <li className="text-center py-8 text-gray-500">No new notifications</li>
          ) : (
            notifications.map((notification) => (
              <li key={notification.id}>
                <Link href={notification.path} onClick={closeDropdown}>
                  <DropdownItem
                    onItemClick={closeDropdown}
                    className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                  >
                    
                    <span className="block flex-1">
                      {/* <span className="mb-1.5 flex items-center text-theme-sm text-gray-500 dark:text-gray-400">
                        
                        <span className="ml-2 font-medium text-gray-800 dark:text-white/90">
                          {notification.sender_name}
                        </span>
                        <span className="ml-1 text-xs text-gray-400">
                          ({notification.sender_type})
                        </span>
                      </span> */}
                      <span className="mb-1 block text-theme-sm text-gray-500 dark:text-gray-400">
                       
                        {parseHtmlMessage(notification.message)}
                      </span>
                      <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                        <span>{getNotificationTitle(notification.type)}</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>{getTimeAgo(notification.created_at)}</span>
                      </span>
                    </span>
                  </DropdownItem>
                </Link>
              </li>
            ))
          )}
        </ul>
        <Link
          href="/student/notifications"
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
}