import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        sku: "",
        name: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("products.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Add New Product
                </h2>
            }
        >
            <Head title="Create Product" />

            <div className="mx-auto max-w-2xl bg-white p-6 shadow-sm sm:rounded-lg mt-6">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            SKU (Product Code)
                        </label>
                        <input
                            type="text"
                            value={data.sku}
                            onChange={(e) =>
                                setData("sku", e.target.value.toUpperCase())
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cat-500 focus:ring-cat-500"
                            placeholder="e.g. TSHIRT-001"
                        />
                        {errors.sku && (
                            <div className="mt-1 text-sm text-red-600">
                                {errors.sku}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cat-500 focus:ring-cat-500"
                            placeholder="e.g. Basic Cotton T-Shirt"
                        />
                        {errors.name && (
                            <div className="mt-1 text-sm text-red-600">
                                {errors.name}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end space-x-3 border-t pt-4">
                        <Link
                            href={route("products.index")}
                            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex justify-center rounded-md bg-cat-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cat-600 focus:outline-none focus:ring-2 focus:ring-cat-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save Product"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
