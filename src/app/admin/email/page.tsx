'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type SendResponse = {
    success?: boolean;
    id?: string;
    error?: string;
};

type AttachmentPayload = {
    filename: string;
    content: string;
    contentType?: string;
};

type AttachmentUI = AttachmentPayload & {
    sizeBytes: number;
};

type EmailHistoryItem = {
    id: string;
    sentAt: string;
    from: string;
    to: string[];
    subject: string;
    replyTo: string[];
    status: string;
};

type HistoryResponse = {
    items?: EmailHistoryItem[];
    hasMore?: boolean;
    error?: string;
    warning?: string;
    source?: 'resend' | 'fallback';
};

type SyncStatus =
    | { kind: 'idle' }
    | { kind: 'ok'; count: number }
    | { kind: 'fallback'; warning: string }
    | { kind: 'error'; message: string };

const DEFAULT_FROM_EMAIL = 'noreply@rotarydivyangcenter.org';
const DEFAULT_REPLY_TO_EMAIL = 'contact@rotarydivyangcenter.org';
const HISTORY_CACHE_KEY = 'rdc_admin_history_cache';

function bytesToMb(bytes: number): string {
    return (bytes / (1024 * 1024)).toFixed(2);
}

function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const value = reader.result;
            if (typeof value !== 'string') {
                reject(new Error(`Unable to read file ${file.name}.`));
                return;
            }

            const base64 = value.includes(',') ? value.split(',')[1] : value;
            resolve(base64);
        };
        reader.onerror = () => reject(new Error(`Unable to read file ${file.name}.`));
        reader.readAsDataURL(file);
    });
}

function normalizeRecipients(raw: string): string[] {
    return raw
        .split(/[\n,;]/)
        .map((value) => value.trim())
        .filter(Boolean);
}

function mergeHistoryLists(serverItems: EmailHistoryItem[], localItems: EmailHistoryItem[]): EmailHistoryItem[] {
    const merged = [...serverItems];
    const seen = new Set(serverItems.map((item) => item.id));

    for (const localItem of localItems) {
        if (!seen.has(localItem.id)) {
            merged.push(localItem);
            seen.add(localItem.id);
        }
    }

    merged.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    return merged.slice(0, 200);
}

function persistHistoryCache(items: EmailHistoryItem[]): void {
    try {
        localStorage.setItem(HISTORY_CACHE_KEY, JSON.stringify(items));
    } catch {
        // Ignore cache write failures.
    }
}

export default function AdminEmailPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [from, setFrom] = useState(DEFAULT_FROM_EMAIL);
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [replyTo, setReplyTo] = useState(DEFAULT_REPLY_TO_EMAIL);
    const [textBody, setTextBody] = useState('');
    const [htmlBody, setHtmlBody] = useState('');
    const [attachments, setAttachments] = useState<AttachmentUI[]>([]);

    const [isSending, setIsSending] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [sendResult, setSendResult] = useState<string | null>(null);
    const [sendError, setSendError] = useState<string | null>(null);
    const [history, setHistory] = useState<EmailHistoryItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);
    const [historySyncStatus, setHistorySyncStatus] = useState<SyncStatus>({ kind: 'idle' });
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historySearch, setHistorySearch] = useState('');
    const [historyFromFilter, setHistoryFromFilter] = useState('');
    const [historyToFilter, setHistoryToFilter] = useState('');
    const [historyStatusFilter, setHistoryStatusFilter] = useState('all');

    const recipientCount = useMemo(() => normalizeRecipients(to).length, [to]);
    const filteredHistory = useMemo(() => {
        const query = historySearch.trim().toLowerCase();
        const fromFilter = historyFromFilter.trim().toLowerCase();
        const toFilter = historyToFilter.trim().toLowerCase();

        return history.filter((item) => {
            const inStatus = historyStatusFilter === 'all' || item.status === historyStatusFilter;
            if (!inStatus) {
                return false;
            }

            const subject = item.subject.toLowerCase();
            const from = item.from.toLowerCase();
            const to = item.to.join(', ').toLowerCase();
            const id = item.id.toLowerCase();

            const inQuery = !query ||
                subject.includes(query) ||
                from.includes(query) ||
                to.includes(query) ||
                id.includes(query);

            const inFrom = !fromFilter || from.includes(fromFilter);
            const inTo = !toFilter || to.includes(toFilter);

            return inQuery && inFrom && inTo;
        });
    }, [history, historySearch, historyFromFilter, historyToFilter, historyStatusFilter]);

    const loadHistory = useCallback(async () => {
        setHistoryLoading(true);
        setHistoryError(null);

        try {
            const response = await fetch('/api/admin/email/history?limit=200', {
                method: 'GET',
                cache: 'no-store',
            });
            const payload = (await response.json()) as HistoryResponse;

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/admin/email/login');
                    router.refresh();
                }
                throw new Error(payload.error || 'Unable to load email history.');
            }

            const serverItems = payload.items || [];
            setHistory((prev) => {
                const merged = mergeHistoryLists(serverItems, prev);
                persistHistoryCache(merged);
                return merged;
            });

            // Update sync status badge
            if (payload.source === 'resend') {
                setHistorySyncStatus({ kind: 'ok', count: serverItems.length });
            } else if (payload.warning) {
                setHistorySyncStatus({ kind: 'fallback', warning: payload.warning });
            } else {
                setHistorySyncStatus({ kind: 'ok', count: serverItems.length });
            }

            setHistoryError(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to load email history.';
            setHistoryError(message);
            setHistorySyncStatus({ kind: 'error', message });
        } finally {
            setHistoryLoading(false);
        }
    }, [router]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(HISTORY_CACHE_KEY);
            if (!raw) {
                return;
            }

            const parsed = JSON.parse(raw) as EmailHistoryItem[];
            if (Array.isArray(parsed) && parsed.length > 0) {
                setHistory(parsed);
            }
        } catch {
            // Ignore invalid cache values.
        }

        void loadHistory();
    }, [loadHistory]);

    useEffect(() => {
        persistHistoryCache(history);
    }, [history]);

    async function handleLogout() {
        await fetch('/api/admin/auth/logout', { method: 'POST' });
        router.push('/admin/email/login');
        router.refresh();
    }

    async function handleAttachmentChange(e: React.ChangeEvent<HTMLInputElement>) {
        const fileList = e.target.files;
        if (!fileList || fileList.length === 0) {
            return;
        }

        setSendError(null);
        setIsUploading(true);
        try {
            const files = Array.from(fileList);
            const nextAttachments: AttachmentUI[] = [];

            for (const file of files) {
                if (file.size > 10 * 1024 * 1024) {
                    throw new Error(`File ${file.name} exceeds 10MB limit.`);
                }

                const content = await readFileAsBase64(file);
                nextAttachments.push({
                    filename: file.name,
                    content,
                    contentType: file.type || undefined,
                    sizeBytes: file.size,
                });
            }

            setAttachments((prev) => [...prev, ...nextAttachments].slice(0, 10));
            e.target.value = '';
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to attach file.';
            setSendError(message);
        } finally {
            setIsUploading(false);
        }
    }

    function removeAttachment(index: number) {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    }

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        setSendError(null);
        setSendResult(null);

        const recipients = normalizeRecipients(to);
        if (recipients.length === 0) {
            setSendError('Please add at least one recipient.');
            return;
        }

        if (!from.trim()) {
            setSendError('Please enter a From email address.');
            return;
        }

        if (!subject.trim()) {
            setSendError('Please enter a subject.');
            return;
        }

        if (!textBody.trim() && !htmlBody.trim()) {
            setSendError('Please enter text or HTML message body.');
            return;
        }

        setIsSending(true);

        try {
            const response = await fetch('/api/admin/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: from.trim(),
                    to: recipients,
                    subject: subject.trim(),
                    replyTo: replyTo.trim() || undefined,
                    text: textBody.trim() || undefined,
                    html: htmlBody.trim() || undefined,
                    attachments: attachments.map((item) => ({
                        filename: item.filename,
                        content: item.content,
                        contentType: item.contentType,
                    })),
                }),
            });

            const payload = (await response.json()) as SendResponse;

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/admin/email/login');
                    router.refresh();
                }
                throw new Error(payload.error || 'Unable to send email.');
            }

            const optimisticItem: EmailHistoryItem = {
                id: payload.id || `local-${Date.now()}`,
                sentAt: new Date().toISOString(),
                from: `Rotary Divyang Center <${from.trim()}>`,
                to: recipients,
                subject: subject.trim(),
                replyTo: replyTo.trim() ? [replyTo.trim()] : [],
                status: 'sent',
            };

            setHistory((prev) => {
                const merged = mergeHistoryLists(prev, [optimisticItem]);
                persistHistoryCache(merged);
                return merged;
            });

            setSendResult(`Email sent successfully. Message ID: ${payload.id || 'N/A'}`);
            setTo('');
            setSubject('');
            setTextBody('');
            setHtmlBody('');
            setAttachments([]);
            void loadHistory();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to send email.';
            setSendError(message);
        } finally {
            setIsSending(false);
        }
    }

    return (
        <section className="min-h-screen py-16" style={{ background: '#F7F4EF' }}>
            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-8">
                    <p className="section-label mb-3">ADMIN TOOL</p>
                    <h1 className="text-4xl font-bold text-[#17458F]" style={{ fontFamily: "'Merriweather', serif" }}>
                        Send Email From Rotary Domain
                    </h1>
                    <p className="mt-3 text-[#5C6475]">
                        Use this page to send direct emails from your verified Rotary Divyang Center&apos;s domain.
                    </p>
                </div>

                <div className="mb-6 flex justify-end">
                    <a href="/api/admin/email" target="_blank" rel="noreferrer" className="btn-secondary mr-3">
                        Preview Email Footer
                    </a>
                    <button type="button" className="btn-secondary" onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                <form onSubmit={handleSend} className="bg-white border border-[#E2DDD6] rounded-2xl p-6 space-y-5">
                    <h2 className="text-xl font-bold text-[#1A1A2E]">Compose Email</h2>

                    <div>
                        <label className="block text-sm font-semibold mb-1.5 text-[#1A1A2E]">From</label>
                        <input
                            type="email"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            placeholder="noreply@rotarydivyangcenter.org"
                            className="w-full px-4 py-3 rounded-xl border text-[15px] outline-none"
                            style={{ border: '1.5px solid #E2DDD6' }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1.5 text-[#1A1A2E]">Recipients (comma or new line)</label>
                        <textarea
                            rows={3}
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            placeholder="user1@example.com, user2@example.com"
                            className="w-full px-4 py-3 rounded-xl border text-[15px] outline-none resize-none"
                            style={{ border: '1.5px solid #E2DDD6' }}
                        />
                        <p className="mt-1 text-xs text-[#7C8A97]">Detected recipients: {recipientCount}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-[#1A1A2E]">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Email subject"
                                className="w-full px-4 py-3 rounded-xl border text-[15px] outline-none"
                                style={{ border: '1.5px solid #E2DDD6' }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-[#1A1A2E]">Reply-To (optional)</label>
                            <input
                                type="email"
                                value={replyTo}
                                onChange={(e) => setReplyTo(e.target.value)}
                                placeholder="contact@rotarydivyangcenter.org"
                                className="w-full px-4 py-3 rounded-xl border text-[15px] outline-none"
                                style={{ border: '1.5px solid #E2DDD6' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1.5 text-[#1A1A2E]">Plain Text Body</label>
                        <textarea
                            rows={7}
                            value={textBody}
                            onChange={(e) => setTextBody(e.target.value)}
                            placeholder="Write plain text email body"
                            className="w-full px-4 py-3 rounded-xl border text-[15px] outline-none resize-y"
                            style={{ border: '1.5px solid #E2DDD6' }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1.5 text-[#1A1A2E]">HTML Body (optional)</label>
                        <textarea
                            rows={7}
                            value={htmlBody}
                            onChange={(e) => setHtmlBody(e.target.value)}
                            placeholder="<p>Write HTML email body</p>"
                            className="w-full px-4 py-3 rounded-xl border text-[15px] outline-none resize-y font-mono"
                            style={{ border: '1.5px solid #E2DDD6' }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1.5 text-[#1A1A2E]">Attachments (optional)</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleAttachmentChange}
                            className="hidden"
                        />
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Choose Files
                        </button>
                        <input
                            readOnly
                            value={attachments.length > 0 ? `${attachments.length} file(s) selected` : 'No files selected'}
                            className="mt-3 w-full px-4 py-3 rounded-xl border text-[15px] outline-none bg-[#fafafa]"
                            style={{ border: '1.5px solid #E2DDD6' }}
                        />
                        <p className="mt-1 text-xs text-[#7C8A97]">Up to 10 files, each max 10MB.</p>

                        {attachments.length > 0 ? (
                            <ul className="mt-3 space-y-2">
                                {attachments.map((file, index) => (
                                    <li key={`${file.filename}-${index}`} className="flex items-center justify-between gap-3 text-sm bg-[#F7F4EF] border border-[#E2DDD6] rounded-xl px-3 py-2">
                                        <span className="text-[#1A1A2E]">
                                            {file.filename} ({bytesToMb(file.sizeBytes)} MB)
                                        </span>
                                        <button type="button" className="text-[#B42318]" onClick={() => removeAttachment(index)}>
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            disabled={isSending || isUploading}
                            className="btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSending ? 'Sending...' : 'Send Email'}
                        </button>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                                setFrom(DEFAULT_FROM_EMAIL);
                                setTo('');
                                setSubject('');
                                setReplyTo(DEFAULT_REPLY_TO_EMAIL);
                                setTextBody('');
                                setHtmlBody('');
                                setAttachments([]);
                                setSendResult(null);
                                setSendError(null);
                            }}
                        >
                            Clear Form
                        </button>
                    </div>

                    {sendResult ? <p className="text-sm text-[#2E7D32]">{sendResult}</p> : null}
                    {sendError ? <p className="text-sm text-[#B42318]">{sendError}</p> : null}
                </form>

                <details
                    className="mt-8 bg-white border border-[#E2DDD6] rounded-2xl p-6"
                    onToggle={(e) => {
                        const isOpen = (e.currentTarget as HTMLDetailsElement).open;
                        setHistoryOpen(isOpen);
                        // Always refresh from server when the panel is opened.
                        if (isOpen && !historyLoading) {
                            void loadHistory();
                        }
                    }}
                >
                        <summary className="cursor-pointer text-xl font-bold text-[#1A1A2E] list-none flex items-center gap-2">
                            <span aria-hidden="true" className="text-base leading-none">
                                {historyOpen ? '▾' : '▸'}
                            </span>
                            <span>
                                Send History ({filteredHistory.length === history.length
                                    ? history.length
                                    : `${filteredHistory.length} shown, ${history.length} total`})
                            </span>
                    </summary>

                    <div className="mt-5">
                        <div className="mb-4 space-y-3">
                            <div className="flex items-center justify-between gap-3">
                                {/* Sync status badge */}
                                {historySyncStatus.kind === 'ok' && (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E7D32] bg-[#E8F5E9] px-3 py-1.5 rounded-full">
                                        <span className="w-2 h-2 rounded-full bg-[#2E7D32] inline-block" />
                                        Resend synced ({historySyncStatus.count} emails)
                                    </span>
                                )}
                                {historySyncStatus.kind === 'fallback' && (
                                    <span
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7B5E00] bg-[#FFF8E1] px-3 py-1.5 rounded-full"
                                        title={historySyncStatus.warning}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-[#F9A825] inline-block" />
                                        Fallback mode — {historySyncStatus.warning}
                                    </span>
                                )}
                                {historySyncStatus.kind === 'error' && (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B42318] bg-[#FEF2F2] px-3 py-1.5 rounded-full">
                                        <span className="w-2 h-2 rounded-full bg-[#B42318] inline-block" />
                                        Sync error — using local cache
                                    </span>
                                )}
                                {historySyncStatus.kind === 'idle' && <span />}
                                <button type="button" className="btn-secondary" onClick={() => void loadHistory()}>
                                    {historyLoading ? 'Refreshing...' : 'Refresh'}
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={historySearch}
                                    onChange={(e) => setHistorySearch(e.target.value)}
                                    placeholder="Search subject, from, to, message id"
                                    className="w-full px-4 py-3 rounded-xl border text-[15px] outline-none"
                                    style={{ border: '1.5px solid #E2DDD6' }}
                                />
                                <select
                                    value={historyStatusFilter}
                                    onChange={(e) => setHistoryStatusFilter(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border text-[15px] outline-none"
                                    style={{ border: '1.5px solid #E2DDD6' }}
                                >
                                    <option value="all">All Status</option>
                                    <option value="sent">sent</option>
                                    <option value="queued">queued</option>
                                    <option value="failed">failed</option>
                                </select>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={historyFromFilter}
                                    onChange={(e) => setHistoryFromFilter(e.target.value)}
                                    placeholder="Filter by from"
                                    className="w-full px-4 py-3 rounded-xl border text-[15px] outline-none"
                                    style={{ border: '1.5px solid #E2DDD6' }}
                                />
                                <input
                                    type="text"
                                    value={historyToFilter}
                                    onChange={(e) => setHistoryToFilter(e.target.value)}
                                    placeholder="Filter by recipient"
                                    className="w-full px-4 py-3 rounded-xl border text-[15px] outline-none"
                                    style={{ border: '1.5px solid #E2DDD6' }}
                                />
                            </div>
                        </div>

                        {historyError && historySyncStatus.kind !== 'fallback' ? (
                            <p className="text-sm text-[#B42318] mb-3">{historyError} Showing locally cached history.</p>
                        ) : null}

                        {historyLoading ? (
                            <p className="text-sm text-[#5C6475]">Loading history...</p>
                        ) : filteredHistory.length === 0 ? (
                            <p className="text-sm text-[#5C6475]">
                                {history.length === 0
                                    ? 'No email history found yet. Send one test email and click Refresh.'
                                    : 'No emails matched your filters.'}
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {filteredHistory.map((item) => (
                                    <article key={`${item.id}-${item.sentAt}`} className="border border-[#E2DDD6] rounded-xl p-4 bg-[#F7F4EF]">
                                        <p className="text-sm font-semibold text-[#1A1A2E]">{item.subject}</p>
                                        <p className="text-xs text-[#5C6475] mt-1">Sent: {new Date(item.sentAt).toLocaleString()}</p>
                                        <p className="text-xs text-[#5C6475] mt-1">From: {item.from}</p>
                                        <p className="text-xs text-[#5C6475] mt-1">To: {item.to.join(', ')}</p>
                                        <p className="text-xs text-[#5C6475] mt-1">Reply-To: {item.replyTo.length > 0 ? item.replyTo.join(', ') : 'None'}</p>
                                        <p className="text-xs text-[#5C6475] mt-1">Status: {item.status}</p>
                                        <p className="text-xs text-[#7C8A97] mt-1">Message ID: {item.id}</p>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </details>
            </div>
        </section>
    );
}
