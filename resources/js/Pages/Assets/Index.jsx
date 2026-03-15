import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import ConfirmModal from "@/Components/ConfirmModal";
import { useState } from "react";

export default function Index({ assets }) {
    const { delete: destroy, processing } = useForm();
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [targetId, setTargetId] = useState(null);

    const confirmDelete = (id) => {
        setTargetId(id);
        setConfirmingDeletion(true);
    };

    const closeModal = () => {
        setConfirmingDeletion(false);
        setTargetId(null);
    };

    const handleDelete = () => {
        destroy(route("assets.destroy", targetId), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    All Assets
                </h2>
            }
        >
            <Head title="Assets" />

            <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-3">Asset Title</th>
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Created At</th>
                                <th className="px-6 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        No assets found. Go to a product to add
                                        assets.
                                    </td>
                                </tr>
                            ) : (
                                assets.map((asset) => (
                                    <tr
                                        key={asset.id}
                                        className="border-b bg-white"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <Link
                                                href={route(
                                                    "assets.show",
                                                    asset.id,
                                                )}
                                                className="hover:text-cat-600 hover:underline"
                                            >
                                                {asset.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            {asset.product ? (
                                                <Link
                                                    href={route(
                                                        "products.show",
                                                        asset.product.id,
                                                    )}
                                                    className="text-cat-600 hover:underline"
                                                >
                                                    {asset.product.name}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-400">
                                                    Unknown Product
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                    asset.type === "IMAGE"
                                                        ? "bg-blue-50 text-blue-700"
                                                        : "bg-purple-50 text-purple-700"
                                                }`}
                                            >
                                                {asset.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                                {asset.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(
                                                asset.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() =>
                                                    confirmDelete(asset.id)
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

            <ConfirmModal
                show={confirmingDeletion}
                onClose={closeModal}
                onConfirm={handleDelete}
                processing={processing}
                title="Delete Asset"
                message="Are you sure you want to delete this asset? This action cannot be undone."
            />
        </AuthenticatedLayout>
    );
}
