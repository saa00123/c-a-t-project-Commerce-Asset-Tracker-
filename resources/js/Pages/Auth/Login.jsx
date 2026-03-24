import { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), { preserveScroll: true });
    };

    const isPendingApproval =
        errors.email && errors.email.includes("pending administrator approval");

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Head title="Log in - C.A.T. Project" />

            <div className="hidden lg:flex lg:w-1/2 bg-stone-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-stone-900 to-black opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>

                <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-24 h-24 bg-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-orange-500/50">
                        <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            ></path>
                        </svg>
                    </div>
                    <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4">
                        C.A.T. Project
                    </h1>
                    <p className="text-xl text-orange-200 font-medium tracking-wide">
                        Centralized Asset Tracker
                    </p>
                    <p className="mt-6 text-stone-400 max-w-md text-sm leading-relaxed">
                        Streamline your digital asset pipeline. Secure,
                        multi-tenant architecture designed for professional
                        teams.
                    </p>
                </div>
            </div>

            <div className="flex w-full lg:w-1/2 flex-col justify-center py-12 px-8 sm:px-12 lg:px-24 bg-white relative">
                <div className="mx-auto w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                    <div className="lg:hidden flex justify-center mb-8">
                        <h1 className="text-4xl font-extrabold text-orange-500 tracking-tight">
                            C.A.T. Project
                        </h1>
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                        Welcome back
                    </h2>
                    <p className="text-sm text-gray-500 mb-8">
                        Please enter your details to access your workspace.
                    </p>

                    {status && (
                        <div className="mb-6 rounded-lg bg-green-50 p-4 border border-green-200 shadow-sm">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-green-500"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-semibold text-green-800">
                                        Registration Successful
                                    </h3>
                                    <div className="mt-2 text-sm text-green-700">
                                        <p>{status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className={`block w-full appearance-none rounded-lg border px-4 py-3 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 sm:text-sm transition-all duration-200 ${errors.email && !isPendingApproval ? "border-red-300" : "border-gray-200"}`}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                    autoFocus
                                    placeholder="Enter your email"
                                />
                                {errors.email && !isPendingApproval && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="block w-full appearance-none rounded-lg border border-gray-200 px-4 py-3 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 sm:text-sm transition-all duration-200"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    required
                                    placeholder="••••••••"
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 transition-colors"
                                />
                                <label
                                    htmlFor="remember"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link
                                    href={route("password.request")}
                                    className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full justify-center rounded-lg border border-transparent bg-orange-500 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
                            >
                                {processing ? "Signing in..." : "Sign in"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">
                                    Or
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-center text-sm space-x-1">
                            <span className="text-gray-600">
                                Don't have an account?
                            </span>
                            <Link
                                href={route("register")}
                                className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                            >
                                Request Access.
                            </Link>
                        </div>
                    </div>

                    {isPendingApproval && (
                        <div className="mt-8 rounded-lg bg-red-50 p-4 border border-red-200 shadow-sm">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-red-500"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-semibold text-red-800">
                                        Pending Approval
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>
                                            Your registration request has been
                                            received. Please wait for
                                            administrator approval before
                                            logging in.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
