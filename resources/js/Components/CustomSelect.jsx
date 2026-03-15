import { useState, useRef, useEffect } from "react";

export default function CustomSelect({
    options,
    value,
    onChange,
    placeholder = "Select...",
    className = "",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full sm:w-40 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors hover:bg-gray-50 focus:border-cat-500 focus:outline-none focus:ring-1 focus:ring-cat-500"
            >
                <span
                    className={`block truncate ${selectedOption ? "text-gray-900" : "text-gray-500"}`}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg
                    className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`relative cursor-pointer select-none py-2 pl-3 pr-9 transition-colors hover:bg-cat-50 hover:text-cat-600 ${
                                value === option.value
                                    ? "bg-cat-50 text-cat-600 font-semibold"
                                    : "text-gray-900"
                            }`}
                        >
                            <span className="block truncate">
                                {option.label}
                            </span>
                            {value === option.value && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-cat-600">
                                    <svg
                                        className="h-4 w-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
