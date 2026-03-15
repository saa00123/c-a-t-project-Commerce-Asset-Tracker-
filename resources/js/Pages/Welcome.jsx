import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome to C.A.T." />
            <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-900 selection:bg-cat-500 selection:text-white">
                <div className="absolute right-0 top-0 z-10 w-full max-w-7xl p-6 text-right px-6">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="font-semibold text-gray-400 hover:text-white focus:rounded-sm focus:outline focus:outline-2 focus:outline-cat-500"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="font-semibold text-gray-400 hover:text-white focus:rounded-sm focus:outline focus:outline-2 focus:outline-cat-500"
                            >
                                Log in
                            </Link>

                            <Link
                                href={route('register')}
                                className="ml-4 font-semibold text-gray-400 hover:text-white focus:rounded-sm focus:outline focus:outline-2 focus:outline-cat-500"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                <div className="mx-auto max-w-3xl p-6 text-center">
                    <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-white">
                        C.A.T.
                    </h1>
                    <p className="mb-10 text-2xl font-medium text-cat-500">
                        Commerce Asset Tracker
                    </p>
                    <p className="mb-12 text-lg text-gray-400">
                        Manage your product assets, versions, and channels seamlessly.
                    </p>

                    {!auth.user && (
                        <Link
                            href={route('login')}
                            className="inline-block rounded-lg bg-cat-500 px-8 py-4 font-bold text-white transition-colors hover:bg-cat-600"
                        >
                            Get Started
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
