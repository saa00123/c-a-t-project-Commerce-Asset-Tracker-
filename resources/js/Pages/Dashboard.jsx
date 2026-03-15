import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard({ stats, recentActivities }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 rounded-md bg-cat-100 p-3">
                            <svg
                                className="h-6 w-6 text-cat-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="truncate text-sm font-medium text-gray-500">
                                    Total Products
                                </dt>
                                <dd className="text-3xl font-semibold text-gray-900">
                                    {stats.products}
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div className="mt-4 border-t border-gray-100 pt-4 text-sm">
                        <Link
                            href={route("products.index")}
                            className="font-medium text-cat-600 hover:text-cat-500"
                        >
                            View all products &rarr;
                        </Link>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                            <svg
                                className="h-6 w-6 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                            </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="truncate text-sm font-medium text-gray-500">
                                    Connected Channels
                                </dt>
                                <dd className="text-3xl font-semibold text-gray-900">
                                    {stats.channels}
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div className="mt-4 border-t border-gray-100 pt-4 text-sm">
                        <Link
                            href={route("channels.index")}
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Manage channels &rarr;
                        </Link>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 rounded-md bg-purple-100 p-3">
                            <svg
                                className="h-6 w-6 text-purple-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="truncate text-sm font-medium text-gray-500">
                                    Total Assets
                                </dt>
                                <dd className="text-3xl font-semibold text-gray-900">
                                    {stats.assets}
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div className="mt-4 border-t border-gray-100 pt-4 text-sm">
                        <Link
                            href={route("assets.index")}
                            className="font-medium text-purple-600 hover:text-purple-500"
                        >
                            Review assets &rarr;
                        </Link>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    Recent Activity
                </h3>
                <div className="flow-root">
                    {recentActivities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-12">
                            <p className="text-sm text-gray-500">
                                No recent activity found.
                            </p>
                        </div>
                    ) : (
                        <ul role="list" className="-mb-8">
                            {recentActivities.map((activity, activityIdx) => (
                                <li key={activity.id}>
                                    <div className="relative pb-8">
                                        {activityIdx !==
                                        recentActivities.length - 1 ? (
                                            <span
                                                className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                                                aria-hidden="true"
                                            />
                                        ) : null}
                                        <div className="relative flex space-x-3">
                                            <div>
                                                <span className="h-8 w-8 rounded-full bg-cat-100 flex items-center justify-center ring-8 ring-white">
                                                    <span className="text-xs font-medium leading-none text-cat-700">
                                                        {activity.user_name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        <span className="font-medium text-gray-900 mr-1">
                                                            {activity.user_name}
                                                        </span>
                                                        {activity.description}
                                                    </p>
                                                </div>
                                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                    {activity.created_at}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
