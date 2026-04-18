'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminEmailLoginPage() {
    const router = useRouter();
    const [nextPath, setNextPath] = useState('/admin/email');

    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const next = params.get('next');
        if (next && next.startsWith('/')) {
            setNextPath(next);
        }
    }, []);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!password.trim()) {
            setError('Please enter password.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/admin/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: password.trim() }),
            });

            const payload = (await response.json()) as { error?: string };
            if (!response.ok) {
                throw new Error(payload.error || 'Unable to login.');
            }

            router.push(nextPath);
            router.refresh();
        } catch (loginError) {
            const message = loginError instanceof Error ? loginError.message : 'Unable to login.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="min-h-screen flex items-center justify-center px-6" style={{ background: '#F7F4EF' }}>
            <div className="w-full max-w-md bg-white border border-[#E2DDD6] rounded-2xl p-8">
                <p className="section-label mb-3">ADMIN ACCESS</p>
                <h1 className="text-3xl font-bold text-[#17458F]" style={{ fontFamily: "'Merriweather', serif" }}>
                    Email Admin Login
                </h1>
                <p className="mt-3 text-sm text-[#5C6475]">
                    Enter admin password to open the email sender panel.
                </p>

                <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-semibold mb-1.5 text-[#1A1A2E]">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border text-[15px] outline-none"
                            style={{ border: '1.5px solid #E2DDD6' }}
                            placeholder="Enter admin password"
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
                        {loading ? 'Checking...' : 'Open Admin Email'}
                    </button>

                    {error ? <p className="text-sm text-[#B42318]">{error}</p> : null}
                </form>
            </div>
        </section>
    );
}
