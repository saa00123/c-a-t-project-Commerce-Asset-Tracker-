import { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), { preserveScroll: true });
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Head title="Request Access - C.A.T. Project" />

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
                        Request Access
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Set up your account to join the workspace.
                    </p>

                    <div className="mb-6 rounded-lg bg-orange-50 p-4 border border-orange-100 shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-orange-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3 flex-1 md:flex md:justify-between">
                                <p className="text-sm text-orange-800">
                                    For security reasons, your account must be{" "}
                                    <strong>
                                        approved by an administrator
                                    </strong>{" "}
                                    before you can access the system.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="block w-full appearance-none rounded-lg border border-gray-200 px-4 py-3 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 sm:text-sm transition-all duration-200"
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                    autoFocus
                                    placeholder="John Doe"
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Work Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block w-full appearance-none rounded-lg border border-gray-200 px-4 py-3 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 sm:text-sm transition-all duration-200"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                    placeholder="john@example.com"
                                />
                                {errors.email && (
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

                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="block w-full appearance-none rounded-lg border border-gray-200 px-4 py-3 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 sm:text-sm transition-all duration-200"
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value,
                                        )
                                    }
                                    required
                                    placeholder="••••••••"
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full justify-center rounded-lg border border-transparent bg-orange-500 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
                            >
                                {processing
                                    ? "Submitting..."
                                    : "Submit Request"}
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
                                Already have an account?
                            </span>
                            <Link
                                href={route("login")}
                                className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                            >
                                Sign in here.
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
