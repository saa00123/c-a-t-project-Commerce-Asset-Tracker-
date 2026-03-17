import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Show({ asset, availableChannels }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const {
        data: channelData,
        setData: setChannelData,
        post: postChannels,
        processing: channelProcessing,
    } = useForm({
        channel_ids: asset.channels ? asset.channels.map((c) => c.id) : [],
    });

    const initialCustomFields = asset.custom_fields
        ? Object.entries(asset.custom_fields).map(([k, v]) => ({
              key: k,
              value: v,
          }))
        : [];

    const {
        data: cfData,
        setData: setCfData,
        patch: patchCf,
        processing: cfProcessing,
    } = useForm({
        custom_fields: initialCustomFields,
    });

    const {
        data: fileData,
        setData: setFileData,
        post: postFile,
        processing: fileProcessing,
        errors: fileErrors,
    } = useForm({
        file: null,
    });

    const statuses = ["DRAFT", "IN_PROGRESS", "REVIEW", "APPROVED", "DEPLOYED"];

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let newIds = [...channelData.channel_ids];

        if (checked) {
            newIds.push(value);
        } else {
            newIds = newIds.filter((id) => id !== value);
        }

        setChannelData("channel_ids", newIds);
    };

    const submitChannels = (e) => {
        e.preventDefault();
        postChannels(route("assets.channels.sync", asset.id), {
            preserveScroll: true,
        });
    };

    const handleStatusChange = (e) => {
        router.patch(
            route("assets.status.update", asset.id),
            {
                status: e.target.value,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const addCustomField = () => {
        setCfData("custom_fields", [
            ...cfData.custom_fields,
            { key: "", value: "" },
        ]);
    };

    const removeCustomField = (index) => {
        const newFields = [...cfData.custom_fields];
        newFields.splice(index, 1);
        setCfData("custom_fields", newFields);
    };

    const handleCfChange = (index, field, value) => {
        const newFields = [...cfData.custom_fields];
        newFields[index][field] = value;
        setCfData("custom_fields", newFields);
    };

    const submitCustomFields = (e) => {
        e.preventDefault();
        patchCf(route("assets.custom_fields.update", asset.id), {
            preserveScroll: true,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileData("file", file);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            const newPreviewUrl = URL.createObjectURL(file);
            setPreviewUrl(newPreviewUrl);
        }
    };

    const resetFile = () => {
        setFileData("file", null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const submitFile = (e) => {
        e.preventDefault();
        postFile(route("assets.upload", asset.id), {
            preserveScroll: true,
            onSuccess: () => {
                setFileData("file", null);
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                }
            },
        });
    };

    const confirmRemoveFile = () => {
        router.delete(route("assets.remove_file", asset.id), {
            preserveScroll: true,
            onSuccess: () => setShowDeleteModal(false),
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

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 transition-opacity">
                    <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Remove S3 File
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Are you sure you want to completely remove this
                                file from AWS S3? This action cannot be undone.
                            </p>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cat-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmRemoveFile}
                                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Remove File
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between border-b pb-4 mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Asset Information
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                                <select
                                    value={asset.status}
                                    onChange={handleStatusChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 py-1 pl-3 pr-8 text-sm focus:border-cat-500 focus:outline-none focus:ring-cat-500"
                                >
                                    {statuses.map((s) => (
                                        <option key={s} value={s}>
                                            {s.replace("_", " ")}
                                        </option>
                                    ))}
                                </select>
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
                        <div className="flex items-center justify-between border-b pb-4 mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Target Channels
                            </h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">
                            Select the channels where this asset will be
                            published.
                        </p>
                        <form onSubmit={submitChannels}>
                            <div className="space-y-4 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-4">
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
                                                    checked={channelData.channel_ids.includes(
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
                                    disabled={channelProcessing}
                                    className="inline-flex justify-center rounded-md bg-cat-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cat-600 focus:outline-none focus:ring-2 focus:ring-cat-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {channelProcessing
                                        ? "Saving..."
                                        : "Save Channels"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between border-b pb-4 mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Custom Fields
                            </h3>
                            <button
                                type="button"
                                onClick={addCustomField}
                                className="text-sm font-medium text-cat-600 hover:text-cat-500"
                            >
                                + Add Field
                            </button>
                        </div>
                        <form
                            onSubmit={submitCustomFields}
                            className="space-y-4"
                        >
                            {cfData.custom_fields.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    No custom fields added yet.
                                </p>
                            ) : (
                                cfData.custom_fields.map((field, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="text"
                                            value={field.key}
                                            onChange={(e) =>
                                                handleCfChange(
                                                    index,
                                                    "key",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Key"
                                            className="w-1/3 rounded-md border-gray-300 shadow-sm focus:border-cat-500 focus:ring-cat-500 sm:text-sm"
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={field.value}
                                            onChange={(e) =>
                                                handleCfChange(
                                                    index,
                                                    "value",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Value"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-cat-500 focus:ring-cat-500 sm:text-sm"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeCustomField(index)
                                            }
                                            className="text-red-500 hover:text-red-700 px-2"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))
                            )}
                            {cfData.custom_fields.length > 0 && (
                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={cfProcessing}
                                        className="inline-flex justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 disabled:opacity-50"
                                    >
                                        {cfProcessing
                                            ? "Saving..."
                                            : "Save Fields"}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                <div className="w-full lg:w-1/2">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg sticky top-6">
                        <div className="flex items-center justify-between border-b pb-4 mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                File Preview
                            </h3>
                            <span className="text-xs text-gray-500">
                                AWS S3 Storage
                            </span>
                        </div>

                        {asset.file_url ? (
                            <div className="flex flex-col items-center">
                                {asset.type === "VIDEO" ? (
                                    <video
                                        src={asset.file_url}
                                        controls
                                        className="w-full max-h-[600px] rounded-md bg-black"
                                    />
                                ) : (
                                    <img
                                        src={asset.file_url}
                                        alt={asset.title}
                                        className="w-full max-h-[600px] rounded-md object-contain bg-gray-50 border border-gray-200"
                                    />
                                )}
                                <p className="mt-4 text-xs text-gray-500 break-all bg-gray-100 p-2 rounded w-full text-center">
                                    {asset.file_url}
                                </p>
                                <div className="mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteModal(true)}
                                        className="inline-flex justify-center rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700 shadow-sm ring-1 ring-inset ring-red-600/20 hover:bg-red-100"
                                    >
                                        Remove File
                                    </button>
                                </div>
                            </div>
                        ) : previewUrl ? (
                            <form
                                onSubmit={submitFile}
                                className="flex flex-col items-center"
                            >
                                {fileData.file &&
                                fileData.file.type.startsWith("video/") ? (
                                    <video
                                        src={previewUrl}
                                        controls
                                        className="w-full max-h-[600px] rounded-md bg-black"
                                    />
                                ) : (
                                    <img
                                        src={previewUrl}
                                        alt="Local Preview"
                                        className="w-full max-h-[600px] rounded-md object-contain bg-gray-50 border border-gray-200"
                                    />
                                )}
                                <div className="mt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={resetFile}
                                        className="inline-flex justify-center rounded-md bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={fileProcessing}
                                        className="inline-flex justify-center rounded-md bg-cat-500 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-cat-600 disabled:opacity-50"
                                    >
                                        {fileProcessing
                                            ? "Uploading to S3..."
                                            : "Upload File"}
                                    </button>
                                </div>
                                {fileErrors.file && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {fileErrors.file}
                                    </p>
                                )}
                            </form>
                        ) : (
                            <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-32 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept="image/*,video/*"
                                />
                                <div className="text-center pointer-events-none">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <p className="mt-2 text-sm text-gray-600">
                                        <span>
                                            Click or drag file to this area to
                                            preview
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
