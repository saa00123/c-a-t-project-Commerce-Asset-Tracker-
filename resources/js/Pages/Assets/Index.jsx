import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import ConfirmModal from "@/Components/ConfirmModal";
import Pagination from "@/Components/Pagination";
import CustomSelect from "@/Components/CustomSelect";
import { useState } from "react";

export default function Index({ assets, filters }) {
    const { delete: destroy, processing } = useForm();
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [targetId, setTargetId] = useState(null);

    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [typeFilter, setTypeFilter] = useState(filters.type || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");

    const typeOptions = [
        { value: "", label: "All Types" },
        { value: "IMAGE", label: "Image" },
        { value: "VIDEO", label: "Video" },
    ];

    const statusOptions = [
        { value: "", label: "All Statuses" },
        { value: "DRAFT", label: "Draft" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "REVIEW", label: "Review" },
        { value: "APPROVED", label: "Approved" },
        { value: "DEPLOYED", label: "Deployed" },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("assets.index"),
            { search: searchTerm, type: typeFilter, status: statusFilter },
            { preserveState: true, replace: true },
        );
    };

    const handleFilterChange = (key, value) => {
        if (key === "type") setTypeFilter(value);
        if (key === "status") setStatusFilter(value);

        router.get(
            route("assets.index"),
            {
                search: searchTerm,
                type: key === "type" ? value : typeFilter,
                status: key === "status" ? value : statusFilter,
            },
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
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <form
                        onSubmit={handleSearch}
                        className="flex w-full max-w-md gap-2"
                    >
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search asset title or product..."
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-cat-500 focus:ring-cat-500 sm:text-sm"
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Search
                        </button>
                    </form>

                    <div className="flex gap-2 w-full sm:w-auto z-10">
                        <CustomSelect
                            options={typeOptions}
                            value={typeFilter}
                            onChange={(val) => handleFilterChange("type", val)}
                            placeholder="All Types"
                        />
                        <CustomSelect
                            options={statusOptions}
                            value={statusFilter}
                            onChange={(val) =>
                                handleFilterChange("status", val)
                            }
                            placeholder="All Statuses"
                        />
                    </div>
                </div>

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
                            {assets.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        No assets found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                assets.data.map((asset) => (
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

                <Pagination links={assets.links} />
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
