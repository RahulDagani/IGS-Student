"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Bell, 
  User, 
  Users, 
  FileText, 
  Eye, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  Circle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_records: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: PaginationInfo;
    unread_counts: {
      total: number;
      by_type: Record<string, number>;
    };
  };
}

type FilterType = "all" | "read" | "unread";
type NotificationType = "" | "agent" | "student" | "application";

export default function NotificationsPage() {
  const router = useRouter();
  const { token } = useAuth();
  const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;

  // State for notifications and pagination
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_records: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [notificationType, setNotificationType] = useState<NotificationType>("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  // Fetch notifications
  const fetchNotifications = useCallback(async (page: number = 1) => {
    if (!token || !BASE_URL) return;

    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", pagination.per_page.toString());

      // Add filter parameters
      if (filterType === "read") {
        params.append("is_read", "1");
      } else if (filterType === "unread") {
        params.append("is_read", "0");
      }

      if (notificationType) {
        params.append("type", notificationType);
      }

      if (startDate) {
        params.append("start_date", startDate.toISOString().split('T')[0]);
      }
      if (endDate) {
        params.append("end_date", endDate.toISOString().split('T')[0]);
      }

      const response = await fetch(
        `${BASE_URL}/notifications?${params.toString()}`,
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
        setPagination(data.data.pagination);
      } else {
        throw new Error('Failed to load notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [token, BASE_URL, filterType, notificationType, startDate, endDate, pagination.per_page]);

  // Initial fetch and filter changes
  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchNotifications(page);
  };

  // Handle filter changes
  const handleFilterChange = (type: FilterType) => {
    setFilterType(type);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNotificationType(e.target.value as NotificationType);
  };

  const clearFilters = () => {
    setFilterType("all");
    setNotificationType("");
    setDateRange([null, null]);
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'student':
        return <User className="w-5 h-5 text-blue-500" />;
      case 'agent':
        return <Users className="w-5 h-5 text-green-500" />;
      case 'application':
        return <FileText className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Parse HTML message to plain text
  const parseHtmlMessage = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  // Mark notification as read (optional - you can implement this)
  const markAsRead = async (notificationId: number) => {
    try {
      await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: 1 } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const hasActiveFilters = filterType !== "all" || notificationType !== "" || startDate || endDate;

  return (
    <div className="">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and manage all your notifications
        </p>
      </div>

      {/* Filters Section */}
      <div className="flex justify-between mb-6 space-y-4">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 items-center my-auto">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filterType === "all"
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange("unread")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filterType === "unread"
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => handleFilterChange("read")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filterType === "read"
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Read
          </button>
        </div>

        {/* Advanced Filters */}
        <div className="flex flex-wrap items-center gap-4">
          

          {/* Date Range Picker */}
          <div className="relative">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              placeholderText="Select date range"
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              dateFormat="yyyy-MM-dd"
              isClearable={true}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No notifications found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors  ${
                  notification.is_read === 0 ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex items-start gap-4"> 
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {parseHtmlMessage(notification.message)}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            {notification.is_read === 1 ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <Circle className="w-3 h-3 text-blue-500" />
                            )}
                            {notification.is_read === 1 ? 'Read' : 'Unread'}
                          </span>
                          <span>{formatDate(notification.created_at)}</span>
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                            {notification.type}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {notification.is_read === 0 && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <Link
                          href={notification.path}
                          className="px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-brand-500 text-white"
                          title="View details"
                        >
                           View 
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && notifications.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
              {Math.min(pagination.current_page * pagination.per_page, pagination.total_records)} of{' '}
              {pagination.total_records} notifications
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                  let pageNumber;
                  if (pagination.total_pages <= 5) {
                    pageNumber = i + 1;
                  } else if (pagination.current_page <= 3) {
                    pageNumber = i + 1;
                  } else if (pagination.current_page >= pagination.total_pages - 2) {
                    pageNumber = pagination.total_pages - 4 + i;
                  } else {
                    pageNumber = pagination.current_page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        pageNumber === pagination.current_page
                          ? 'bg-brand-500 text-white'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                {pagination.total_pages > 5 && pagination.current_page < pagination.total_pages - 2 && (
                  <>
                    <span className="text-gray-400">...</span>
                    <button
                      onClick={() => handlePageChange(pagination.total_pages)}
                      className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {pagination.total_pages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.total_pages}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}