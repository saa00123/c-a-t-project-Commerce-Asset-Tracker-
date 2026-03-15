import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-1 mt-6">
            {links.map((link, index) => {
                if (link.url === null) {
                    return (
                        <div
                            key={index}
                            className="px-4 py-2 text-sm text-gray-400 border border-gray-200 rounded-md bg-gray-50 cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                            link.active
                                ? "bg-cat-500 text-white border-cat-500"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        preserveScroll
                    />
                );
            })}
        </div>
    );
}
