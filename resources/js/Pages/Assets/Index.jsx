import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useCallback } from "react";
import { debounce } from "lodash";

export default function Index({ assets, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [typeFilter, setTypeFilter] = useState(filters.type || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");

    const applyFilters = useCallback(
        debounce((search, type, status) => {
            router.get(
                route("assets.index"),
                { search, type, status },
                { preserveState: true, replace: true },
            );
        }, 300),
        [],
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        applyFilters(value, typeFilter, statusFilter);
    };

    const handleTypeChange = (e) => {
        const value = e.target.value;
        setTypeFilter(value);
        applyFilters(searchTerm, value, statusFilter);
    };

    const handleStatusChange = (e) => {
        const value = e.target.value;
        setStatusFilter(value);
        applyFilters(searchTerm, typeFilter, value);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Assets Library
                </h2>
            }
        >
            <Head title="Assets" />

            <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Search by title or product name..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-cat-500 focus:ring-cat-500"
                        />
                    </div>
                    <div className="flex w-full gap-4 md:w-auto">
                        <select
                            value={typeFilter}
                            onChange={handleTypeChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-cat-500 focus:ring-cat-500 md:w-40"
                        >
                            <option value="">All Types</option>
                            <option value="IMAGE">Image</option>
                            <option value="VIDEO">Video</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={handleStatusChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-cat-500 focus:ring-cat-500 md:w-48"
                        >
                            <option value="">All Statuses</option>
                            <option value="DRAFT">Draft</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="REVIEW">Review</option>
                            <option value="APPROVED">Approved</option>
                            <option value="DEPLOYED">Deployed</option>
                        </select>
                    </div>
                </div>
            </div>

            {assets.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg bg-white py-16 shadow-sm">
                    <svg
                        className="h-16 w-16 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <p className="mt-4 text-lg font-medium text-gray-900">
                        No assets found
                    </p>
                    <p className="mt-1 text-gray-500">
                        Try adjusting your search or filters.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {assets.data.map((asset) => (
                        <div
                            key={asset.id}
                            className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                                {asset.file_url ? (
                                    asset.type === "VIDEO" ? (
                                        <div className="flex h-full w-full items-center justify-center bg-gray-900">
                                            <svg
                                                className="h-12 w-12 text-white opacity-70"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <img
                                            src={asset.file_url}
                                            alt={asset.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    )
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                                        No File
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 rounded bg-black/50 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                    {asset.type}
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col p-4">
                                <h3 className="truncate text-base font-semibold text-gray-900">
                                    <Link
                                        href={route("assets.show", asset.id)}
                                        className="hover:text-cat-600 focus:outline-none"
                                    >
                                        <span
                                            className="absolute inset-0"
                                            aria-hidden="true"
                                        />
                                        {asset.title}
                                    </Link>
                                </h3>
                                <p className="mt-1 truncate text-sm text-gray-500">
                                    {asset.product.name}
                                </p>

                                <div className="mt-auto pt-4 flex items-center justify-between">
                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                        {asset.status.replace("_", " ")}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(
                                            asset.created_at,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {assets.links && assets.links.length > 3 && (
                <div className="mt-8 flex justify-center">
                    <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                    >
                        {assets.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold border ${
                                    link.active
                                        ? "z-10 bg-cat-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cat-600 border-cat-600"
                                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                } ${!link.url ? "opacity-50 cursor-not-allowed" : ""} ${
                                    index === 0 ? "rounded-l-md" : ""
                                } ${index === assets.links.length - 1 ? "rounded-r-md" : ""}`}
                            />
                        ))}
                    </nav>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
