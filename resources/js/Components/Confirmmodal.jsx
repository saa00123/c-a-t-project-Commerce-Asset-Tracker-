import Modal from "@/Components/Modal";

export default function ConfirmModal({
    show,
    onClose,
    onConfirm,
    title,
    message,
    processing,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                <p className="mt-1 text-sm text-gray-600">{message}</p>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                        disabled={processing}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {processing ? "Processing..." : "Confirm"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
