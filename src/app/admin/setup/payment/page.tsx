"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import SetupSettingsSidebar from "../../layout/SetupSettingsSidebar";

interface PaymentConfiguration {
  id: string;
  payment_gateway: string;
  publishable_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function PaymentTablePage() {
  const [payments, setPayments] = useState<PaymentConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;
  const { token } = useAuth();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/tenant/settings/payment`,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        const data = result.data;
        setPayments(Array.isArray(data) ? data : [data]);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment configuration?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`${BASE_URL}/tenant/settings/payment/${id}`, {
        method: "DELETE",
        headers: {
            
            'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setPayments(payments.filter(payment => payment.id !== id));
      } else {
        alert("Failed to delete payment configuration");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Failed to delete payment configuration");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${BASE_URL}/tenant/settings/payment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`

        },
        body: JSON.stringify({
          is_active: currentStatus ? 0 : 1,
        }),
      });

      if (response.ok) {
        setPayments(payments.map(payment =>
          payment.id === id
            ? { ...payment, is_active: !currentStatus }
            : payment
        ));
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  if (loading) {
      return (
        <div className="flex min-h-screen bg-[#0f172a]">
          <SetupSettingsSidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-white">
              Loading Payment settings...
            </div>
          </div>
        </div>
      );
    }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0f172a]">
          {/* Sidebar */}
          <SetupSettingsSidebar />
      <div className="flex-1 mt-6 ml-0 lg:ml-6 lg:mt-0 mb-6 bg-[#111827] rounded-xl shadow-lg border border-white/10 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Payment Configurations</h1>
          <Link
            href="/admin/setup/payment/add"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
          >
            <Plus className="w-4 h-4" />
            Add Payment Gateway
          </Link>
        </div>

        {/* Table */}
        <div className="bg-[#111827] rounded-xl shadow-lg border border-white/10 overflow-hidden">
          {payments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">No payment configurations found</div>
              <Link
                href="/admin/setup/payment/add"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
              >
                <Plus className="w-4 h-4" />
                Add Your First Payment Gateway
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Gateway
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Publishable Key
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white capitalize">
                          {payment.payment_gateway}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300 font-mono">
                          {payment.publishable_key && payment.publishable_key.substring(0, 20)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleActive(payment.id, payment.is_active)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            payment.is_active
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {payment.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {payment.is_active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(payment.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/setup/payment/edit/${payment.id}`}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-500/30 border border-blue-500/30"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Link>
                          {/* <button
                            onClick={() => handleDelete(payment.id)}
                            disabled={deletingId === payment.id}
                            className="flex items-center gap-1 px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-500/30 border border-red-500/30 disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                            {deletingId === payment.id ? "Deleting..." : "Delete"}
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
          <h3 className="text-sm font-medium text-blue-400 mb-2">
            Payment Gateway Information:
          </h3>
          <ul className="text-xs text-blue-300 space-y-1">
            <li>• You can have multiple payment gateway configurations</li>
            <li>• Only one gateway can be active at a time</li>
            <li>• Toggle active status to switch between gateways</li>
            <li>• Keep your secret keys secure and never share them</li>
          </ul>
        </div>
      </div>
    </div>
  );
}