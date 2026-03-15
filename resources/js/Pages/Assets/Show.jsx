import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Show({ asset, availableChannels }) {
    const { data, setData, post, processing } = useForm({
        channel_ids: asset.channels.map((c) => c.id) || [],
    });

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let newIds = [...data.channel_ids];

        if (checked) {
            newIds.push(value);
        } else {
            newIds = newIds.filter((id) => id !== value);
        }

        setData("channel_ids", newIds);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("assets.channels.sync"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Asset: {asset.title}
                    </h2>
                    <Link
                        href={route("assets.index")}
                        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Back to List
                    </Link>
                </div>
            }
        >
            <Head title={asset.title} />

            <div className="flex flex-col gap-6 md:flex-row">
                <div className="w-full md:w-1/2 space-y-6">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900">
                            Asset Information
                        </h3>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Product
                                </p>
                                <p className="mt-1 text-base font-medium text-cat-600">
                                    <Link
                                        href={route(
                                            "products.show",
                                            asset.product.id,
                                        )}
                                        className="hover:underline"
                                    >
                                        {asset.product.name}
                                    </Link>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Type
                                </p>
                                <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                    {asset.type}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Status
                                </p>
                                <span className="mt-1 inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                    {asset.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Created At
                                </p>
                                <p className="mt-1 text-sm text-gray-900">
                                    {new Date(
                                        asset.created_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                File Preview
                            </h3>
                            <span className="text-xs text-gray-500">
                                Ready for AWS S3
                            </span>
                        </div>
                        <div className="mt-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-16 bg-gray-50">
                            <p className="text-sm text-gray-500">
                                File upload module will be integrated later.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Target Channels
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Select the channels where this asset will be
                            published.
                        </p>

                        <form onSubmit={submit}>
                            <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4">
                                {availableChannels.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        No channels available. Add channels
                                        first.
                                    </p>
                                ) : (
                                    availableChannels.map((channel) => (
                                        <div
                                            key={channel.id}
                                            className="flex items-start"
                                        >
                                            <div className="flex h-5 items-center">
                                                <input
                                                    id={`channel-${channel.id}`}
                                                    type="checkbox"
                                                    value={channel.id}
                                                    checked={data.channel_ids.includes(
                                                        channel.id,
                                                    )}
                                                    onChange={
                                                        handleCheckboxChange
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300 text-cat-500 focus:ring-cat-500"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label
                                                    htmlFor={`channel-${channel.id}`}
                                                    className="font-medium text-gray-700"
                                                >
                                                    {channel.name}
                                                </label>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex justify-center rounded-md bg-cat-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cat-600 focus:outline-none focus:ring-2 focus:ring-cat-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {processing ? "Saving..." : "Save Channels"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
