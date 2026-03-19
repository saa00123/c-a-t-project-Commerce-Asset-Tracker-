import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    const bgColor = type === "success" ? "bg-cat-500" : "bg-red-500";

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 flex transform items-center gap-3 rounded-md px-4 py-3 text-white shadow-lg transition-all duration-300 ease-in-out ${bgColor}`}
        >
            <span className="text-sm font-medium">{message}</span>
            <button
                onClick={onClose}
                className="text-white hover:text-gray-200 focus:outline-none"
            >
                <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    );
}
