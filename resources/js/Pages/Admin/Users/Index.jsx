import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ auth, users }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [confirmingUserApproval, setConfirmingUserApproval] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const { patch, delete: destroy, processing, reset } = useForm();

    const confirmUserApproval = (user) => {
        setSelectedUser(user);
        setConfirmingUserApproval(true);
    };

    const confirmUserDeletion = (user) => {
        setSelectedUser(user);
        setConfirmingUserDeletion(true);
    };

    const closeModal = () => {
        setConfirmingUserApproval(false);
        setConfirmingUserDeletion(false);
        setTimeout(() => {
            setSelectedUser(null);
            reset();
        }, 200);
    };

    const approveUser = (e) => {
        e.preventDefault();
        patch(route("admin.users.approve", selectedUser.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route("admin.users.reject", selectedUser.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    User Management
                </h2>
            }
        >
            <Head title="User Management - C.A.T. Project" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Workspace Access Requests
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Review and manage user access to the
                                        platform.
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Email
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Role
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 uppercase">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.is_approved ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {!user.is_approved && (
                                                        <button
                                                            onClick={() =>
                                                                confirmUserApproval(
                                                                    user,
                                                                )
                                                            }
                                                            className="text-orange-600 hover:text-orange-900 font-semibold mr-4 transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    {user.id !==
                                                        auth.user.id && (
                                                        <button
                                                            onClick={() =>
                                                                confirmUserDeletion(
                                                                    user,
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900 font-semibold transition-colors"
                                                        >
                                                            {user.is_approved
                                                                ? "Revoke"
                                                                : "Reject"}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-6 py-8 text-center text-sm text-gray-500"
                                                >
                                                    No users found in the
                                                    system.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {confirmingUserApproval && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div
                        className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
                        onClick={closeModal}
                    ></div>
                    <div className="relative w-full max-w-lg p-6 mx-auto bg-white rounded-xl shadow-2xl z-50">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                Approve User Access
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Are you sure you want to approve access for{" "}
                                    <span className="font-bold text-gray-800">
                                        {selectedUser?.name}
                                    </span>
                                    ? They will gain immediate access to the
                                    workspace.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={approveUser}
                                disabled={processing}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                            >
                                {processing ? "Processing..." : "Approve User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {confirmingUserDeletion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div
                        className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
                        onClick={closeModal}
                    ></div>
                    <div className="relative w-full max-w-lg p-6 mx-auto bg-white rounded-xl shadow-2xl z-50">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 text-red-600">
                                Reject / Remove User
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Are you sure you want to completely remove{" "}
                                    <span className="font-bold text-gray-800">
                                        {selectedUser?.name}
                                    </span>
                                    ? This action cannot be undone and their
                                    account will be permanently deleted.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={deleteUser}
                                disabled={processing}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            >
                                {processing ? "Processing..." : "Delete User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
