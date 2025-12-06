"use client";

import { useState, useEffect } from "react";
import { Plus, Printer, Edit, Trash2, X, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Permission {
    id: string;
    name: string;
    category: string;
    description?: string;
}

interface Role {
    id: number;
    tenant_id: number;
    role_name: string;
    role_key: string;
    created_at: string;
    permissions_count: number;
    modules: {
        module_id: number;
        module_name: string;
        module_key: string;
        permissions: string[];
    }[];
}

interface ApiResponse {
    success: boolean;
    data: Role[];
}

const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;

export default function RolesAndPermissionsPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [perPage, setPerPage] = useState<number>(10);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [success, setSuccess] = useState<string>("");
    const [error, setError] = useState<string>("");
    const {token} = useAuth();

    const router = useRouter();

    // Fetch roles
    useEffect(() => {
        fetchRoles();
    }, []);

    // Auto-hide toasts
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess("");
                setError("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    const fetchRoles = async () => {
        try {
            const response = await fetch(`${BASE_URL}/tenant/roles`,{
                headers:{
                    "Authorization": `Bearer ${token}`
                }
            });
            const data: ApiResponse = await response.json();

            if (data.success) {
                setRoles(data.data);
                showToast("Roles loaded successfully!", "success");
            } else {
                showToast("Failed to load roles", "error");
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            showToast("Failed to load roles", "error");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: "success" | "error") => {
        if (type === "success") {
            setSuccess(message);
            setError("");
        } else {
            setError(message);
            setSuccess("");
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to delete the role "${name}"?`)) {
            return;
        }

        setDeletingId(id);

        try {
            // Note: You'll need to replace this with your actual DELETE endpoint
            const response = await fetch(`/api/tenant/roles/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                showToast("Role deleted successfully!", "success");
                await fetchRoles(); // Refresh the list
            } else {
                const errorData = await response.json();
                showToast(errorData.error || "Failed to delete role", "error");
            }
        } catch (error) {
            console.error("Error deleting role:", error);
            showToast("Failed to delete role", "error");
        } finally {
            setDeletingId(null);
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get permissions summary for display
    const getPermissionsSummary = (role: Role) => {
        let totalPermissions = 0;
        const moduleNames: string[] = [];
        
        role.modules.forEach(module => {
            totalPermissions += module.permissions.length;
            moduleNames.push(module.module_name);
        });
        
        return {
            totalPermissions,
            moduleNames: moduleNames.slice(0, 3) // Show first 3 modules
        };
    };

    // Check if role is system role (you can customize this logic)
    const isSystemRole = (role: Role) => {
        const systemRoles = ['admin', 'super_admin', 'user'];
        return systemRoles.includes(role.role_key.toLowerCase());
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-[#0f172a]">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-white">Loading roles...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#0f172a]">
            {/* Main Content */}
            <div className="flex-1 mt-6  lg:mt-0 mb-6 ">
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

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#111827] rounded-xl border border-white/10 p-4">
                        <h3 className="text-sm text-gray-400 mb-2">Total Roles</h3>
                        <p className="text-2xl font-bold text-white">{roles.length}</p>
                    </div>
                    {/* <div className="bg-[#111827] rounded-xl border border-white/10 p-4">
                        <h3 className="text-sm text-gray-400 mb-2">System Roles</h3>
                        <p className="text-2xl font-bold text-blue-400">
                            {roles.filter(role => isSystemRole(role)).length}
                        </p>
                    </div> */}
                    <div className="bg-[#111827] rounded-xl border border-white/10 p-4">
                        <h3 className="text-sm text-gray-400 mb-2">Custom Roles</h3>
                        <p className="text-2xl font-bold text-green-400">
                            {roles.filter(role => !isSystemRole(role)).length}
                        </p>
                    </div>
                </div>

                <div className="bg-[#111827] rounded-xl shadow-lg border border-white/10 p-6">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Roles & Permissions
                            </h2>
                            <p className="text-gray-400 mt-1">
                                Manage user roles and their permissions
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            

                            {/* Create Button */}
                            <button
                                onClick={() =>
                                    router.push("/admin/roles/create")
                                }
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition"
                            >
                                <Plus className="w-4 h-4" />
                                Create Role
                            </button>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-[#1F2937]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                        Role Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                        Role Key
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                        Permissions
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                        Modules
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                        Created Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {roles.slice(0, perPage).map((role, index) => {
                                    const permissionsSummary = getPermissionsSummary(role);
                                    const systemRole = isSystemRole(role);
                                    
                                    return (
                                        <tr
                                            key={role.id}
                                            className="hover:bg-[#1F2937] transition-colors"
                                        >
                                            <td className="px-6 py-4 text-gray-300">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-indigo-400" />
                                                    <span className="text-white font-medium">
                                                        {role.role_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">
                                                <code className="px-2 py-1 text-xs bg-gray-800 rounded">
                                                    {role.role_key}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-gray-300">
                                                        {permissionsSummary.totalPermissions} permissions
                                                    </span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {role.modules.map((module, idx) => (
                                                            module.permissions.map((perm, permIdx) => (
                                                                <span
                                                                    key={`${module.module_id}-${permIdx}`}
                                                                    className="px-2 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30"
                                                                >
                                                                    {module.module_key}.{perm}
                                                                </span>
                                                            ))
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">
                                                <div className="flex flex-wrap gap-1">
                                                    {permissionsSummary.moduleNames.map((moduleName, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded border border-purple-500/30"
                                                        >
                                                            {moduleName}
                                                        </span>
                                                    ))}
                                                    {role.modules.length > 3 && (
                                                        <span className="px-2 py-1 text-xs bg-gray-600 text-gray-300 rounded">
                                                            +{role.modules.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">
                                                {formatDate(role.created_at)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                        systemRole
                                                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                                            : "bg-green-500/20 text-green-300 border border-green-500/30"
                                                    }`}
                                                >
                                                    {systemRole ? "System" : "Custom"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            router.push(
                                                                `/admin/roles/edit/${role.id}`
                                                            )
                                                        }
                                                        className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                                                        title="Edit role"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>

                                                    {!systemRole && (
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    role.id,
                                                                    role.role_name
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId === role.id
                                                            }
                                                            className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition disabled:opacity-50"
                                                            title="Delete role"
                                                        >
                                                            {deletingId === role.id ? (
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                <Trash2 className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {roles.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-300 mb-2">
                                    No roles found
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Get started by creating your first role
                                </p>
                                <button
                                    onClick={() =>
                                        router.push("/admin/roles/create")
                                    }
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
                                >
                                    Create Role
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer Section */}
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-700 pt-4 gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-300">
                                Rows per page
                            </span>
                            <select
                                value={perPage}
                                onChange={(e) =>
                                    setPerPage(Number(e.target.value))
                                }
                                className="text-sm rounded-md bg-[#111827] border border-gray-700 text-white px-2 py-1 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div className="text-sm text-gray-400">
                            Showing {Math.min(perPage, roles.length)} of {roles.length} role
                            {roles.length !== 1 ? "s" : ""}
                        </div>
                    </div>
                </div>

                
            </div>
        </div>
    );
}