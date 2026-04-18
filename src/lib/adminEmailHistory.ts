export type AdminEmailHistoryItem = {
    id: string;
    sentAt: string;
    from: string;
    to: string[];
    subject: string;
    replyTo: string[];
    status: string;
};

const MAX_HISTORY = 500;

/**
 * Use globalThis to persist history across Next.js hot-reloads in dev mode.
 * Without this, every code change wipes the module-level array and empties history.
 */
const g = globalThis as unknown as { __rdcEmailHistory?: AdminEmailHistoryItem[] };
if (!g.__rdcEmailHistory) {
    g.__rdcEmailHistory = [];
}
const inMemoryHistory: AdminEmailHistoryItem[] = g.__rdcEmailHistory;

export function addAdminEmailHistory(item: AdminEmailHistoryItem): void {
    const existingIndex = inMemoryHistory.findIndex((entry) => entry.id === item.id);
    if (existingIndex >= 0) {
        inMemoryHistory[existingIndex] = item;
    } else {
        inMemoryHistory.unshift(item);
    }

    inMemoryHistory.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    if (inMemoryHistory.length > MAX_HISTORY) {
        inMemoryHistory.length = MAX_HISTORY;
    }
}

export function listAdminEmailHistory(limit = 200): AdminEmailHistoryItem[] {
    const normalized = Number.isFinite(limit) ? Math.max(1, Math.floor(limit)) : 200;
    return inMemoryHistory.slice(0, Math.min(normalized, MAX_HISTORY));
}
