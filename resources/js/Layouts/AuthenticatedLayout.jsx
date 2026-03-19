import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Toast from "@/Components/Toast";

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash, errors } = usePage().props;
    const user = auth?.user;

    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: "success", message: flash.success });
        } else if (flash?.error) {
            setToast({ type: "error", message: flash.error });
        } else if (errors && Object.keys(errors).length > 0) {
            setToast({
                type: "error",
                message: "Please check your input and try again.",
            });
        }

        if (
            flash?.success ||
            flash?.error ||
            (errors && Object.keys(errors).length > 0)
        ) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash, errors]);

    return (
        <div className="flex h-screen bg-gray-100 relative">
            <aside className="flex w-64 flex-col bg-cat-500">
                <div className="flex h-16 items-center justify-center border-b border-cat-600">
                    <Link href="/">
                        <span className="text-2xl font-bold tracking-wider text-white">
                            C.A.T.
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 space-y-2 px-4 py-6">
                    <Link
                        href={route("dashboard")}
                        className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            route().current("dashboard")
                                ? "bg-cat-600 text-white"
                                : "text-cat-100 hover:bg-cat-600 hover:text-white"
                        }`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href={route("products.index")}
                        className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            route().current("products.*")
                                ? "bg-cat-600 text-white"
                                : "text-cat-100 hover:bg-cat-600 hover:text-white"
                        }`}
                    >
                        Products
                    </Link>
                    <Link
                        href={route("assets.index")}
                        className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            route().current("assets.*")
                                ? "bg-cat-600 text-white"
                                : "text-cat-100 hover:bg-cat-600 hover:text-white"
                        }`}
                    >
                        Assets
                    </Link>
                    <Link
                        href={route("channels.index")}
                        className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            route().current("channels.*")
                                ? "bg-cat-600 text-white"
                                : "text-cat-100 hover:bg-cat-600 hover:text-white"
                        }`}
                    >
                        Channels
                    </Link>
                </nav>

                <div className="border-t border-cat-600 p-4">
                    <Link
                        href={route("profile.edit")}
                        className="block hover:opacity-80"
                    >
                        <div className="text-sm font-medium text-white">
                            {user?.name}
                        </div>
                        <div className="text-xs text-cat-200">
                            {user?.email}
                        </div>
                    </Link>
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="mt-3 text-xs text-white underline transition-colors hover:text-cat-100"
                    >
                        Log Out
                    </Link>
                </div>
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
                {header && (
                    <header className="bg-white shadow">
                        <div className="px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>

                <Toast
                    message={toast?.message}
                    type={toast?.type}
                    onClose={() => setToast(null)}
                />
            </div>
        </div>
    );
}
