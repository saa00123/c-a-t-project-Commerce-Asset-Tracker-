import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Spinner from "@/Components/Spinner";

export default function Index({ products, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const { delete: destroy, processing: deleteProcessing } = useForm();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(
                route("products.index"),
                { search: searchTerm },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const openDeleteModal = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            destroy(route("products.destroy", productToDelete.id), {
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
                        Products
                    </h2>
                    <Link
                        href={route("products.create")}
                        className="inline-flex items-center justify-center rounded-md bg-cat-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cat-600 focus:outline-none focus:ring-2 focus:ring-cat-500 focus:ring-offset-2"
                    >
                        + Add Product
                    </Link>
                </div>
            }
        >
            <Head title="Products" />

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 transition-opacity">
                    <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                            Delete Product
                        </h3>
                        <p className="text-sm text-gray-500">
                            Are you sure you want to delete{" "}
                            <span className="font-bold text-gray-700">
                                {productToDelete?.name}
                            </span>
                            ? This action cannot be undone and will affect
                            related assets.
                        </p>
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
                                onClick={confirmDelete}
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

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="w-full sm:w-1/3">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or SKU..."
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cat-500 focus:ring-cat-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                <div className="min-w-full divide-y divide-gray-200">
                    <div className="bg-gray-50 px-6 py-3 grid grid-cols-12 gap-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="col-span-3">SKU</div>
                        <div className="col-span-5">Name</div>
                        <div className="col-span-2 text-center">Created</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>
                    <div className="bg-white divide-y divide-gray-200">
                        {products.data && products.data.length > 0 ? (
                            products.data.map((product) => (
                                <div
                                    key={product.id}
                                    className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors"
                                >
                                    <div className="col-span-3 text-sm font-medium text-gray-900">
                                        {product.sku}
                                    </div>
                                    <div className="col-span-5 text-sm text-gray-900">
                                        <Link
                                            href={route(
                                                "products.show",
                                                product.id,
                                            )}
                                            className="hover:text-cat-600 hover:underline"
                                        >
                                            {product.name}
                                        </Link>
                                    </div>
                                    <div className="col-span-2 text-center text-sm text-gray-500">
                                        {new Date(
                                            product.created_at,
                                        ).toLocaleDateString()}
                                    </div>
                                    <div className="col-span-2 text-right text-sm font-medium flex justify-end gap-3">
                                        <Link
                                            href={route(
                                                "products.show",
                                                product.id,
                                            )}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Manage
                                        </Link>
                                        <button
                                            onClick={() =>
                                                openDeleteModal(product)
                                            }
                                            className="text-red-600 hover:text-red-900 focus:outline-none"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-12 text-center text-sm text-gray-500">
                                No products found.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {products.links && products.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <div className="flex gap-1">
                        {products.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 text-sm border rounded-md ${
                                    link.active
                                        ? "bg-cat-500 text-white border-cat-500"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                } ${!link.url && "opacity-50 cursor-not-allowed"}`}
                                preserveScroll
                                preserveState
                            />
                        ))}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
