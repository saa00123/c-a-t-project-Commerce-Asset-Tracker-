import { Head, Link } from "@inertiajs/react";

export default function Error({ status }) {
    const title =
        {
            503: "Service Unavailable",
            500: "Server Error",
            404: "Page Not Found",
            403: "Forbidden",
        }[status] || "Error";

    const description =
        {
            503: "Sorry, we are doing some maintenance. Please check back soon.",
            500: "Whoops, something went wrong on our servers.",
            404: "Sorry, the page you are looking for could not be found.",
            403: "Sorry, you are forbidden from accessing this page.",
        }[status] || "An unexpected error occurred.";

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 text-center sm:px-6 lg:px-8">
            <Head title={title} />
            <div className="space-y-4 relative">
                <h1 className="text-9xl font-extrabold tracking-widest text-cat-500">
                    {status}
                </h1>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 transform rounded bg-gray-800 px-2 text-sm text-white shadow-lg whitespace-nowrap">
                    {title}
                </div>
                <p className="mt-8 text-lg text-gray-500">{description}</p>
                <div className="mt-10">
                    <Link
                        href={route("dashboard")}
                        className="inline-flex items-center justify-center rounded-md bg-cat-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-cat-600 focus:outline-none focus:ring-2 focus:ring-cat-500 focus:ring-offset-2 transition-colors"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
