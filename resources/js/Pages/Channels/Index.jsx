import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ channels }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
    });

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [deleteModalId, setDeleteModalId] = useState(null);

    const submitAdd = (e) => {
        e.preventDefault();
        post(route("channels.store"), {
            preserveScroll: true,
            onSuccess: () => reset("name"),
        });
    };

    const startEdit = (channel) => {
        setEditingId(channel.id);
        setEditName(channel.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName("");
    };

    const submitEdit = (id) => {
        router.patch(
            route("channels.update", id),
            { name: editName },
            {
                preserveScroll: true,
                onSuccess: () => cancelEdit(),
            },
        );
    };

    const confirmDelete = () => {
        if (deleteModalId) {
            router.delete(route("channels.destroy", deleteModalId), {
                preserveScroll: true,
                onSuccess: () => setDeleteModalId(null),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Channel Management
                </h2>
            }
        >
            <Head title="Channels" />

            {deleteModalId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 transition-opacity">
                    <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Delete Channel
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete this channel?
                                This action cannot be undone and it will be
                                removed from all associated assets.
                            </p>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteModalId(null)}
                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cat-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-4xl space-y-6">
                <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Add New Channel
                    </h3>
                    <form
                        onSubmit={submitAdd}
                        className="flex gap-4 items-start"
                    >
                        <div className="flex-1">
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="Enter channel name (e.g., YouTube, Instagram, Official Website)"
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-cat-500 focus:ring-cat-500"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex justify-center rounded-md bg-cat-500 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-cat-600 disabled:opacity-50"
                        >
                            {processing ? "Adding..." : "Add Channel"}
                        </button>
                    </form>
                </div>

                <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Channel Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Linked Assets
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
                            {channels.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="px-6 py-8 text-center text-sm text-gray-500"
                                    >
                                        No channels created yet. Add your first
                                        channel above!
                                    </td>
                                </tr>
                            ) : (
                                channels.map((channel) => (
                                    <tr
                                        key={channel.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingId === channel.id ? (
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) =>
                                                        setEditName(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-cat-500 focus:ring-cat-500 text-sm py-1"
                                                    autoFocus
                                                />
                                            ) : (
                                                <div className="text-sm font-medium text-gray-900">
                                                    {channel.name}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                                {channel.assets_count} assets
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {editingId === channel.id ? (
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() =>
                                                            submitEdit(
                                                                channel.id,
                                                            )
                                                        }
                                                        className="text-cat-600 hover:text-cat-900"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="text-gray-500 hover:text-gray-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() =>
                                                            startEdit(channel)
                                                        }
                                                        className="text-cat-600 hover:text-cat-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setDeleteModalId(
                                                                channel.id,
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
