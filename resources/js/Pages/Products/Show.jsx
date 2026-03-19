import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import Spinner from "@/Components/Spinner";

export default function Show({ product }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        type: "IMAGE",
        product_id: product.id,
    });

    const { delete: destroy, processing: deleteProcessing } = useForm();

    const submit = (e) => {
        e.preventDefault();
        post(route("assets.store", product.id), {
            onSuccess: () => reset(),
        });
    };

    const openDeleteModal = (assetId) => {
        setAssetToDelete(assetId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setAssetToDelete(null);
    };

    const confirmDelete = () => {
        if (assetToDelete) {
            destroy(route("assets.destroy", assetToDelete), {
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
                        {product.name}
                    </h2>
                    <Link
                        href={route("products.index")}
                        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Back to List
                    </Link>
                </div>
            }
        >
            <Head title={product.name} />

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 transition-opacity">
                    <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Delete Asset
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete this asset info?
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                disabled={deleteProcessing}
                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cat-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={deleteProcessing}
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
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

            <div className="flex flex-col gap-6 md:flex-row">
                <div className="w-full md:w-1/3 space-y-6">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900">
                            Product Info
                        </h3>
                        <div className="mt-4 space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    SKU
                                </p>
                                <p className="mt-1 text-base text-gray-900">
                                    {product.sku}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Name
                                </p>
                                <p className="mt-1 text-base text-gray-900">
                                    {product.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Add Asset Info
                        </h3>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Asset Title
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cat-500 focus:ring-cat-500 sm:text-sm"
                                    placeholder="e.g. Main Thumbnail"
                                />
                                {errors.title && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.title}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Type
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cat-500 focus:ring-cat-500 sm:text-sm"
                                >
                                    <option value="IMAGE">Image</option>
                                    <option value="VIDEO">Video</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={processing || !data.title}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-cat-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cat-600 disabled:opacity-50"
                            >
                                {processing && <Spinner className="h-4 w-4" />}
                                {processing ? "Adding..." : "Add Asset Info"}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="w-full md:w-2/3">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Assets List
                        </h3>

                        {product.assets && product.assets.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {product.assets.map((asset) => (
                                    <div
                                        key={asset.id}
                                        className="relative flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                        asset.type === "IMAGE"
                                                            ? "bg-blue-50 text-blue-700"
                                                            : "bg-purple-50 text-purple-700"
                                                    }`}
                                                >
                                                    {asset.type}
                                                </span>
                                                <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                                    {asset.status}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    openDeleteModal(asset.id)
                                                }
                                                className="text-gray-400 hover:text-red-600 focus:outline-none"
                                            >
                                                <svg
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <h4 className="mt-3 font-medium text-gray-900 truncate">
                                            <Link
                                                href={route(
                                                    "assets.show",
                                                    asset.id,
                                                )}
                                                className="hover:text-cat-600 hover:underline"
                                            >
                                                {asset.title}
                                            </Link>
                                        </h4>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {new Date(
                                                asset.created_at,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-12">
                                <p className="text-sm text-gray-500">
                                    No asset info added yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
