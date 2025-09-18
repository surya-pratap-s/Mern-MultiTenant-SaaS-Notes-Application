import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { EyeOff } from "lucide-react";

export default function LandingPage() {
    const { getAllTenants } = useAuth();
    const [tenants, setTenants] = useState([]);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const res = await getAllTenants();
                // if backend sends { tenants: [...] }
                setTenants(res?.tenants || res || []);
            } catch (err) {
                console.error("Failed to load tenants", err);
                setTenants([]);
            }
        };
        fetchTenants();
    }, []);

    return (
        <div className="">
            <header className="absolute inset-x-0 top-0 z-50">
                <nav aria-label="Global" className="mx-auto flex items-center justify-between p-6 lg:px-8">
                    <div className="flex lg:flex-1">
                        <Link to="/" className="-m-1.5 p-1.5 inline-flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-notebook-text-icon lucide-notebook-text">
                                <path d="M2 6h4" /><path d="M2 10h4" /><path d="M2 14h4" /><path d="M2 18h4" /><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M9.5 8h5" /><path d="M9.5 12H16" /><path d="M9.5 16H14" />
                            </svg>
                            <span className="ml-3 font-semibold tracking-tight">Notesly</span>
                        </Link>
                    </div>


                    <div className="flex lg:flex-1 lg:justify-end">
                        <Link to="/login" className="text-sm font-semibold leading-6 text-white hover:text-indigo-300">
                            Log in <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="relative isolate pt-24">
                <div className="mx-auto px-6 lg:px-8">
                    <div className="mx-auto py-20 text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Collaborative notes for teams — multi-tenant SaaS</h1>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            Secure, role-based note management for companies. Start free — upgrade to Pro anytime for unlimited notes.
                        </p>

                        <div className="mt-10 flex items-center justify-center gap-x-4">
                            <Link to={'/signup'} className="inline-flex items-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-400 focus:outline-none" >
                                Get started
                            </Link>
                        </div>

                        <div className="mt-8 text-sm text-gray-300 bg-gray-800/60 border border-gray-700 rounded-xl p-5 shadow-lg">
                            <h3 className="text-base font-semibold text-indigo-400 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 01-8 0m8 0a4 4 0 01-8 0m8 0V6m-8 6v6m0 0h8" />
                                </svg>
                                Demo Accounts
                            </h3>

                            <ul className="mt-3 space-y-2">
                                <li className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                                    admin@acme.test
                                </li>
                                <li className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                                    user@acme.test
                                </li>
                                <li className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                                    <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
                                    admin@globex.test
                                </li>
                                <li className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                                    <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
                                    user@globex.test
                                </li>
                            </ul>

                            <p className="mt-4 text-gray-400 flex gap-2 items-center">
                                <EyeOff className='h-4 w-4' /> Password: <span className="font-mono text-indigo-300">password</span>
                            </p>
                        </div>

                    </div>
                    {Array.isArray(tenants) && tenants.length > 0 && (
                        <section className="mx-auto">
                            <h2 className="text-2xl font-semibold">Teants</h2>
                            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                {tenants.map((t) => (
                                    <div key={t._id} className="rounded-2xl border border-white/6 p-4">
                                        <div className='flex'>
                                            <h3 className="text-xl font-semibold flex-1">{t.name}</h3>
                                            <p className="text-sm text-gray-100 capitalize py-1 px-3 rounded bg-green-500">{t.subscription.plan}</p>
                                        </div>
                                        <div className="mt-6 flex items-center gap-x-3">
                                            <Link className="rounded-md bg-white/5 px-3 py-2 text-sm font-semibold">Contact Now</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section aria-labelledby="features-heading" className="mx-auto mt-12">
                        <h2 id="features-heading" className="sr-only">Features</h2>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-2xl bg-white/5 p-6">
                                <h3 className="text-lg font-semibold">Multi-tenant isolation</h3>
                                <p className="mt-2 text-sm text-gray-300">Each company has isolated notes and users — secure by design.</p>
                            </div>

                            <div className="rounded-2xl bg-white/5 p-6">
                                <h3 className="text-lg font-semibold">Role-based access</h3>
                                <p className="mt-2 text-sm text-gray-300">Admins invite users and manage subscriptions. Members create and edit notes.</p>
                            </div>

                            <div className="rounded-2xl bg-white/5 p-6">
                                <h3 className="text-lg font-semibold">Subscription gating</h3>
                                <p className="mt-2 text-sm text-gray-300">Free tenants limited to 3 notes. Upgrade to Pro removes the limit instantly.</p>
                            </div>
                        </div>
                    </section>

                    <section id="pricing" className="mx-auto mt-12">
                        <h2 className="text-2xl font-semibold">Pricing</h2>
                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/6 p-6">
                                <h3 className="text-xl font-semibold">Free</h3>
                                <p className="mt-2 text-sm text-gray-300">Up to 3 notes per tenant — ideal for trying out Notesly.</p>
                                <div className="mt-6 flex items-center gap-x-3">
                                    <Link className="rounded-md bg-white/5 px-3 py-2 text-sm font-semibold">Start free</Link>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/6 p-6 bg-gradient-to-br from-indigo-600/20 to-indigo-700/10">
                                <h3 className="text-xl font-semibold">Pro</h3>
                                <p className="mt-2 text-sm text-gray-300">Unlimited notes, priority support, team management.</p>
                                <div className="mt-6 flex items-center gap-x-3">
                                    <Link className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white">Upgrade to Pro</Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="mt-20 border-t border-white/6 pt-8 pb-12 text-center text-sm text-gray-400">
                    <div className="mx-auto">© {new Date().getFullYear()} Notesly — Built for multi-tenant teams.</div>
                </footer>
            </main>
        </div>
    )
}
