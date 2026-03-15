import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ConfirmModal from "@/Components/ConfirmModal";
import Pagination from "@/Components/Pagination";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ products, filters }) {
    const { delete: destroy, processing } = useForm();
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [targetId, setTargetId] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("products.index"),
            { search: searchTerm },
            { preserveState: true, replace: true },
        );
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
        destroy(route("products.destroy", targetId), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => closeModal(),
        });
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
                        className="rounded-md bg-cat-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-cat-600"
                    >
                        Add New Product
                    </Link>
                </div>
            }
        >
            <Head title="Products" />

            <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                <div className="mb-6 flex justify-between items-center">
                    <form
                        onSubmit={handleSearch}
                        className="flex w-full max-w-md gap-2"
                    >
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by SKU or Name..."
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-cat-500 focus:ring-cat-500 sm:text-sm"
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Search
                        </button>
                    </form>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-3">SKU</th>
                                <th className="px-6 py-3">Product Name</th>
                                <th className="px-6 py-3">Created At</th>
                                <th className="px-6 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                products.data.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b bg-white"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <Link
                                                href={route(
                                                    "products.show",
                                                    product.id,
                                                )}
                                                className="hover:text-cat-600 hover:underline"
                                            >
                                                {product.sku}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={route(
                                                    "products.show",
                                                    product.id,
                                                )}
                                                className="hover:text-cat-600 hover:underline"
                                            >
                                                {product.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(
                                                product.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() =>
                                                    confirmDelete(product.id)
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

                <Pagination links={products.links} />
            </div>

            <ConfirmModal
                show={confirmingDeletion}
                onClose={closeModal}
                onConfirm={handleDelete}
                processing={processing}
                title="Delete Product"
                message="Are you sure you want to delete this product? All of its data will be permanently removed. This action cannot be undone."
            />
        </AuthenticatedLayout>
    );
}
