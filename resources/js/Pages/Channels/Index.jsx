import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import Spinner from "@/Components/Spinner";

export default function Index({ channels }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editChannel, setEditChannel] = useState(null);
    const [deleteChannel, setDeleteChannel] = useState(null);

    const {
        data: createData,
        setData: setCreateData,
        post: createPost,
        processing: createProcessing,
        errors: createErrors,
        reset: resetCreate,
    } = useForm({
        name: "",
    });

    const {
        data: editData,
        setData: setEditData,
        put: editPut,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        name: "",
    });

    const { delete: destroy, processing: deleteProcessing } = useForm();

    const openCreateModal = () => {
        resetCreate();
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        resetCreate();
    };

    const submitCreate = (e) => {
        e.preventDefault();
        createPost(route("channels.store"), {
            preserveScroll: true,
            onSuccess: () => closeCreateModal(),
        });
    };

    const openEditModal = (channel) => {
        setEditChannel(channel);
        setEditData("name", channel.name);
    };

    const closeEditModal = () => {
        setEditChannel(null);
        resetEdit();
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (editChannel) {
            editPut(route("channels.update", editChannel.id), {
                preserveScroll: true,
                onSuccess: () => closeEditModal(),
            });
        }
    };

    const openDeleteModal = (channel) => {
        setDeleteChannel(channel);
    };

    const closeDeleteModal = () => {
        setDeleteChannel(null);
    };

    const submitDelete = () => {
        if (deleteChannel) {
            destroy(route("channels.destroy", deleteChannel.id), {
                preserveScroll: true,
                onSuccess: () => closeDeleteModal(),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Channels
                    </h2>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center rounded-md bg-cat-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cat-600 focus:outline-none focus:ring-2 focus:ring-cat-500 focus:ring-offset-2"
                    >
                        + Add Channel
                    </button>
                </div>
            }
        >
            <Head title="Channels" />

            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 transition-opacity">
                    <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                            Add New Channel
                        </h3>
                        <form onSubmit={submitCreate}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Channel Name
                                </label>
                                <input
                                    type="text"
                                    value={createData.name}
                                    onChange={(e) =>
                                        setCreateData("name", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cat-500 focus:ring-cat-500 sm:text-sm"
                                    placeholder="e.g. YouTube, Instagram, Official Website"
                                    autoFocus
                                />
                                {createErrors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {createErrors.name}
                                    </p>
                                )}
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeCreateModal}
                                    disabled={createProcessing}
                                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        createProcessing || !createData.name
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-cat-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cat-600 disabled:opacity-50"
                                >
                                    {createProcessing && (
                                        <Spinner className="h-4 w-4" />
                                    )}
                                    {createProcessing ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editChannel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 transition-opacity">
                    <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                            Edit Channel
                        </h3>
                        <form onSubmit={submitEdit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Channel Name
                                </label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) =>
                                        setEditData("name", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cat-500 focus:ring-cat-500 sm:text-sm"
                                    autoFocus
                                />
                                {editErrors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {editErrors.name}
                                    </p>
                                )}
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    disabled={editProcessing}
                                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editProcessing || !editData.name}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-cat-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cat-600 disabled:opacity-50"
                                >
                                    {editProcessing && (
                                        <Spinner className="h-4 w-4" />
                                    )}
                                    {editProcessing ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteChannel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 transition-opacity">
                    <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Delete Channel
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete{" "}
                                <span className="font-bold text-gray-700">
                                    {deleteChannel.name}
                                </span>
                                ? This action cannot be undone.
                            </p>
                            {deleteChannel.assets_count > 0 && (
                                <p className="mt-2 text-sm font-medium text-red-600 bg-red-50 p-2 rounded">
                                    Warning: This channel is currently linked to{" "}
                                    {deleteChannel.assets_count} asset(s).
                                </p>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                disabled={deleteProcessing}
                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={submitDelete}
                                disabled={deleteProcessing}
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleteProcessing && (
                                    <Spinner className="h-4 w-4" />
                                )}
                                {deleteProcessing ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                <div className="min-w-full divide-y divide-gray-200">
                    <div className="bg-gray-50 px-6 py-3 grid grid-cols-12 gap-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="col-span-5">Channel Name</div>
                        <div className="col-span-3 text-center">
                            Linked Assets
                        </div>
                        <div className="col-span-2 text-center">Created</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>
                    <div className="bg-white divide-y divide-gray-200">
                        {channels.length > 0 ? (
                            channels.map((channel) => (
                                <div
                                    key={channel.id}
                                    className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors"
                                >
                                    <div className="col-span-5 text-sm font-medium text-gray-900">
                                        {channel.name}
                                    </div>
                                    <div className="col-span-3 text-center">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${channel.assets_count > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                                        >
                                            {channel.assets_count} Assets
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-center text-sm text-gray-500">
                                        {new Date(
                                            channel.created_at,
                                        ).toLocaleDateString()}
                                    </div>
                                    <div className="col-span-2 text-right text-sm font-medium flex justify-end gap-3">
                                        <button
                                            onClick={() =>
                                                openEditModal(channel)
                                            }
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                openDeleteModal(channel)
                                            }
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-12 text-center text-sm text-gray-500">
                                No channels found. Click the button above to
                                create one.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
