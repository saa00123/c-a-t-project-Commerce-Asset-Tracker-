import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ConfirmModal from "@/Components/ConfirmModal";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ channels }) {
    const {
        data,
        setData,
        post,
        processing: isSaving,
        errors,
        reset,
    } = useForm({
        name: "",
    });

    const { delete: destroy, processing: isDeleting } = useForm();
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [targetId, setTargetId] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route("channels.store"), {
            onSuccess: () => reset("name"),
        });
    };

    const confirmDelete = (id) => {
        setTargetId(id);
        setConfirmingDeletion(true);
    };

    const closeModal = () => {
        setConfirmingDeletion(false);
        setTargetId(null);
    };

    const handleDelete = () => {
        destroy(route("channels.destroy", targetId), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Channels
                </h2>
            }
        >
            <Head title="Channels" />

            <div className="flex flex-col gap-6 md:flex-row">
                <div className="w-full md:w-1/3">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Add New Channel
                        </h3>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cat-500 focus:ring-cat-500 sm:text-sm"
                                    placeholder="e.g. Naver Smart Store"
                                />
                                {errors.name && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.name}
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={isSaving || !data.name}
                                className="w-full justify-center rounded-md bg-cat-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cat-600 focus:outline-none focus:ring-2 focus:ring-cat-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {isSaving ? "Adding..." : "Add Channel"}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="w-full md:w-2/3">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-500">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                    <tr>
                                        <th className="px-6 py-3">
                                            Channel Name
                                        </th>
                                        <th className="px-6 py-3">
                                            Created At
                                        </th>
                                        <th className="px-6 py-3 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {channels.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="px-6 py-8 text-center text-gray-500"
                                            >
                                                No channels added yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        channels.map((channel) => (
                                            <tr
                                                key={channel.id}
                                                className="border-b bg-white"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {channel.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(
                                                        channel.created_at,
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() =>
                                                            confirmDelete(
                                                                channel.id,
                                                            )
                                                        }
                                                        className="font-medium text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                show={confirmingDeletion}
                onClose={closeModal}
                onConfirm={handleDelete}
                processing={isDeleting}
                title="Delete Channel"
                message="Are you sure you want to delete this channel? It will be removed from all associated assets."
            />
        </AuthenticatedLayout>
    );
}
