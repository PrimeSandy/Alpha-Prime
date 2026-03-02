"use client";

import React, { useState } from 'react';
import {
    Lock, Unlock, Eye, EyeOff, Save, Key, Shield, AlertTriangle,
    Link as LinkIcon, LockKeyhole, MessageSquare, CornerUpRight,
    Image as ImageIcon, FileText, CheckCircle2, ListOrdered,
    Pencil, X, RefreshCcw, PauseCircle, PlayCircle, Trash2, Share2, Copy, CheckCheck
} from 'lucide-react';

type ActionType = 'message' | 'redirect' | 'image' | 'note';
type ModalMode = 'edit' | 'pause' | 'delete' | null;

interface VaultRecord {
    _id: string;
    actionType: ActionType;
    createdAt: string;
    status: 'active' | 'paused';
    shortId?: string;
}

const ACTION_LABELS: Record<ActionType, string> = {
    message: 'Secret Message',
    redirect: 'Hidden Redirect',
    image: 'Secret Image',
    note: 'Private Note',
};
const ACTION_COLORS: Record<ActionType, string> = {
    message: 'bg-blue-100 text-blue-800 border-blue-200',
    redirect: 'bg-orange-100 text-orange-800 border-orange-200',
    image: 'bg-purple-100 text-purple-800 border-purple-200',
    note: 'bg-green-100 text-green-800 border-green-200',
};
const ACTION_ICONS: Record<ActionType, React.ElementType> = {
    message: MessageSquare,
    redirect: CornerUpRight,
    image: ImageIcon,
    note: FileText,
};

function getActionInfo(type: ActionType) {
    return { icon: ACTION_ICONS[type], color: ACTION_COLORS[type], label: ACTION_LABELS[type] };
}

export default function LinkVault() {
    const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');

    /* ── ENCODE ── */
    const [encodeUrl, setEncodeUrl] = useState('');
    const [actionType, setActionType] = useState<ActionType>('message');
    const [actionData, setActionData] = useState('');
    const [encodePassword, setEncodePassword] = useState('');
    const [showEncodePassword, setShowEncodePassword] = useState(false);
    const [encodeLoading, setEncodeLoading] = useState(false);
    const [encodeSuccess, setEncodeSuccess] = useState(false);
    const [encodeError, setEncodeError] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    /* ── RECORDS ── */
    const [records, setRecords] = useState<VaultRecord[]>([]);
    const [recordsLoading, setRecordsLoading] = useState(false);
    const [recordsError, setRecordsError] = useState('');

    /* ── SHARED MODAL ── */
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [modalTarget, setModalTarget] = useState<VaultRecord | null>(null);
    const [modalPassword, setModalPassword] = useState('');
    const [showModalPassword, setShowModalPassword] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState('');
    const [modalSuccess, setModalSuccess] = useState('');
    /* edit-specific */
    const [editActionType, setEditActionType] = useState<ActionType>('message');
    const [editActionData, setEditActionData] = useState('');

    /* ── DECODE ── */
    const [decodeUrl, setDecodeUrl] = useState('');
    const [decodePassword, setDecodePassword] = useState('');
    const [showDecodePassword, setShowDecodePassword] = useState(false);
    const [decodeLoading, setDecodeLoading] = useState(false);
    const [decodedResult, setDecodedResult] = useState<{ type: ActionType; data: string } | null>(null);
    const [decodeError, setDecodeError] = useState('');

    const isHttps = (url: string) => url.toLowerCase().startsWith('https://');
    const isShortLink = (url: string) => /alphaprime\.co\.in\/v\//.test(url);
    const isValidDecodeUrl = (url: string) => isHttps(url) || isShortLink(url);

    const copyToClipboard = async (text: string, id: string) => {
        try { await navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); } catch { }
    };

    /* ── ENCODE ── */
    const handleEncode = async (e: React.FormEvent) => {
        e.preventDefault();
        setEncodeError('');
        setEncodeSuccess(false);
        if (!isHttps(encodeUrl)) { setEncodeError('URL must start with https://'); return; }
        setEncodeLoading(true);
        try {
            const res = await fetch('/api/link-vault/encode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: encodeUrl, actionType, actionData, password: encodePassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to encode');
            setEncodeSuccess(true);
            setTimeout(() => setEncodeSuccess(false), 4000);
            await fetchRecords(encodeUrl);
        } catch (err: unknown) {
            setEncodeError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setEncodeLoading(false);
        }
    };

    /* ── FETCH RECORDS ── */
    const fetchRecords = async (url?: string) => {
        const target = url ?? encodeUrl;
        if (!isHttps(target)) { setRecordsError('URL must start with https://'); return; }
        setRecordsError('');
        setRecordsLoading(true);
        try {
            const res = await fetch('/api/link-vault/records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: target }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to load records');
            setRecords(data.records ?? []);
        } catch (err: unknown) {
            setRecordsError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setRecordsLoading(false);
        }
    };

    /* ── OPEN MODAL ── */
    const openModal = (mode: ModalMode, rec: VaultRecord) => {
        setModalMode(mode);
        setModalTarget(rec);
        setModalPassword('');
        setShowModalPassword(false);
        setModalError('');
        setModalSuccess('');
        setEditActionType(rec.actionType);
        setEditActionData('');
    };

    const closeModal = () => { setModalMode(null); setModalTarget(null); };

    /* ── MODAL SUBMIT ── */
    const handleModalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!modalTarget || !modalMode) return;
        setModalError('');
        setModalSuccess('');
        setModalLoading(true);

        try {
            let res: Response;

            if (modalMode === 'edit') {
                res = await fetch('/api/link-vault/edit', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: modalTarget._id, newActionType: editActionType, newActionData: editActionData }),
                });
            } else if (modalMode === 'pause') {
                res = await fetch('/api/link-vault/status', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: modalTarget._id }),
                });
            } else { // delete
                res = await fetch('/api/link-vault/delete', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: modalTarget._id }),
                });
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Operation failed');

            setModalSuccess(data.message || 'Done!');
            setTimeout(async () => {
                closeModal();
                await fetchRecords();
            }, 1200);
        } catch (err: unknown) {
            setModalError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setModalLoading(false);
        }
    };

    /* ── DECODE ── */
    const handleDecode = async (e: React.FormEvent) => {
        e.preventDefault();
        setDecodeError('');
        setDecodedResult(null);
        if (!isValidDecodeUrl(decodeUrl)) { setDecodeError('Enter a valid https:// URL or an alphaprime.co.in/v/ link'); return; }
        setDecodeLoading(true);
        try {
            const res = await fetch('/api/link-vault/decode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: decodeUrl, password: decodePassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to decode');
            setDecodedResult({ type: data.actionType, data: data.actionData });
        } catch (err: unknown) {
            setDecodeError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setDecodeLoading(false);
        }
    };

    /* ═══════════════════════════════════ RENDER ═══════════════════════════════════ */
    return (
        <div className="min-h-0 sm:min-h-screen bg-gray-50 flex flex-col font-sans">
            <main className="flex-grow py-6 sm:py-12 px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
                <div className="max-w-3xl mx-auto">

                    {/* Header */}
                    <div className="text-center pb-8 border-b border-gray-200 mb-8">
                        <div className="inline-flex justify-center items-center p-4 bg-black rounded-2xl mb-6 shadow-lg">
                            <LockKeyhole className="h-10 w-10 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4 tracking-tight">Link Vault</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Hide secret messages, redirects, or notes inside any HTTPS link — protected by a password.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-100">
                            {(['encode', 'decode'] as const).map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-5 font-semibold text-lg transition-colors flex items-center justify-center gap-2 ${activeTab === tab ? 'text-black border-b-2 border-black bg-gray-50' : 'text-gray-500 hover:text-black hover:bg-gray-50'
                                        }`}>
                                    {tab === 'encode' ? <><Lock className="w-5 h-5" />Mask Link</> : <><Unlock className="w-5 h-5" />Unmask Link</>}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 md:p-8">

                            {/* ═══════════ ENCODE TAB ═══════════ */}
                            {activeTab === 'encode' && (
                                <div className="space-y-8">
                                    <form onSubmit={handleEncode} className="space-y-6">
                                        {encodeError && <Alert type="error" message={encodeError} />}
                                        {encodeSuccess && <Alert type="success" message="Action encoded and saved!" />}

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-800">Target HTTPS URL</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <LinkIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input type="url" value={encodeUrl} onChange={(e) => setEncodeUrl(e.target.value)}
                                                    placeholder="https://example.com/page" required
                                                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-black transition-colors ${encodeUrl && !isHttps(encodeUrl) ? 'border-red-300' : 'border-gray-200'}`} />
                                            </div>
                                            {encodeUrl && !isHttps(encodeUrl) && <p className="text-xs text-red-500 font-medium">URL must begin with https://</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-800">Action Type</label>
                                                <select value={actionType} onChange={(e) => setActionType(e.target.value as ActionType)}
                                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer">
                                                    <option value="message">Secret Message</option>
                                                    <option value="redirect">Hidden Redirect</option>
                                                    <option value="image">Secret Image URL</option>
                                                    <option value="note">Private Note</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-800">Password</label>
                                                <PasswordInput value={encodePassword} onChange={setEncodePassword}
                                                    show={showEncodePassword} onToggle={() => setShowEncodePassword(!showEncodePassword)}
                                                    placeholder="Secret key" minLength={4} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-800">
                                                {actionType === 'message' && 'Secret Message Content'}
                                                {actionType === 'redirect' && 'Hidden Destination URL'}
                                                {actionType === 'image' && 'Secret Image URL'}
                                                {actionType === 'note' && 'Detailed Private Note'}
                                            </label>
                                            {(actionType === 'message' || actionType === 'note') ? (
                                                <textarea value={actionData} onChange={(e) => setActionData(e.target.value)}
                                                    placeholder={`Enter your ${actionType}…`} required rows={4}
                                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors resize-none" />
                                            ) : (
                                                <input type="url" value={actionData} onChange={(e) => setActionData(e.target.value)}
                                                    placeholder="https://…" required
                                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors" />
                                            )}
                                        </div>

                                        <button type="submit" disabled={encodeLoading || (encodeUrl.length > 0 && !isHttps(encodeUrl))}
                                            className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                            {encodeLoading ? <Spinner /> : <><Save className="w-5 h-5" />Mask & Save</>}
                                        </button>
                                    </form>

                                    {/* ── RECORDS PANEL ── */}
                                    <div className="border-t border-gray-100 pt-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                <ListOrdered className="w-4 h-4" />Saved Actions for this URL
                                            </h2>
                                            <button type="button" onClick={() => fetchRecords()}
                                                disabled={!encodeUrl || !isHttps(encodeUrl) || recordsLoading}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-gray-100 text-black rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                                {recordsLoading ? <Spinner small /> : <RefreshCcw className="w-4 h-4" />}
                                                {records.length > 0 ? 'Refresh' : 'Load Records'}
                                            </button>
                                        </div>

                                        {recordsError && <Alert type="error" message={recordsError} />}

                                        {records.length === 0 && !recordsLoading && !recordsError && (
                                            <p className="text-sm text-gray-500 text-center py-4">Enter a URL above and click &ldquo;Load Records&rdquo;.</p>
                                        )}

                                        {records.length > 0 && (
                                            <ul className="space-y-3">
                                                {records.map((rec) => {
                                                    const info = getActionInfo(rec.actionType);
                                                    const Icon = info.icon;
                                                    const isPaused = rec.status === 'paused';
                                                    return (
                                                        <li key={rec._id} className={`flex flex-col gap-3 px-4 py-3 border rounded-xl transition-colors ${isPaused ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                                                            <div className="flex items-center justify-between w-full">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${info.color}`}>
                                                                        <Icon className="w-3 h-3" />{info.label}
                                                                    </span>
                                                                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                                                                        {`${new Date(rec.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${new Date(rec.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}`}
                                                                    </span>
                                                                    <span className={`text-xs font-semibold ${isPaused ? 'text-yellow-600' : 'text-green-600'}`}>
                                                                        ● {rec.status}
                                                                    </span>
                                                                </div>

                                                                {/* Action buttons */}
                                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                                    <button onClick={() => openModal('edit', rec)}
                                                                        title="Edit action"
                                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-black text-white rounded-lg hover:bg-gray-700 transition-colors">
                                                                        <Pencil className="w-3 h-3" />Edit
                                                                    </button>
                                                                    <button onClick={() => openModal('pause', rec)}
                                                                        title={isPaused ? 'Resume' : 'Pause'}
                                                                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${isPaused ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100' : 'bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100'}`}>
                                                                        {isPaused ? <><PlayCircle className="w-3 h-3" />Resume</> : <><PauseCircle className="w-3 h-3" />Pause</>}
                                                                    </button>
                                                                    <button onClick={() => openModal('delete', rec)}
                                                                        title="Delete"
                                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-red-50 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                                                                        <Trash2 className="w-3 h-3" />Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            {rec.shortId && (
                                                                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-full shadow-sm">
                                                                    <span className="flex-1 text-xs font-mono text-gray-700 truncate">https://www.alphaprime.co.in/v/{rec.shortId}</span>
                                                                    <button type="button" onClick={() => copyToClipboard(`https://www.alphaprime.co.in/v/${rec.shortId}`, rec._id)}
                                                                        className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md border transition-colors bg-black border-black text-white hover:bg-gray-800">
                                                                        {copiedId === rec._id ? <><CheckCheck className="w-3.5 h-3.5 text-green-400" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy Shareable Link</>}
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ═══════════ DECODE TAB ═══════════ */}
                            {activeTab === 'decode' && (
                                <div className="space-y-8">
                                    <form onSubmit={handleDecode} className="space-y-6">
                                        {decodeError && <Alert type="error" message={decodeError} />}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-800">Target HTTPS URL</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <LinkIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input type="url" value={decodeUrl} onChange={(e) => setDecodeUrl(e.target.value)}
                                                    placeholder="https://example.com/page  or  alphaprime.co.in/v/…" required
                                                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-black transition-colors ${decodeUrl && !isValidDecodeUrl(decodeUrl) ? 'border-red-300' : 'border-gray-200'}`} />
                                            </div>
                                            {decodeUrl && !isValidDecodeUrl(decodeUrl) && (
                                                <p className="text-xs text-red-500 font-medium">Enter a valid https:// URL or alphaprime.co.in/v/ short link</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-800">Password</label>
                                            <PasswordInput value={decodePassword} onChange={setDecodePassword}
                                                show={showDecodePassword} onToggle={() => setShowDecodePassword(!showDecodePassword)}
                                                placeholder="Enter secret key" minLength={1} />
                                        </div>
                                        <button type="submit" disabled={decodeLoading || (decodeUrl.length > 0 && !isValidDecodeUrl(decodeUrl))}
                                            className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                            {decodeLoading ? <Spinner /> : <><Unlock className="w-5 h-5" />Unmask Link</>}
                                        </button>
                                    </form>

                                    {decodedResult && (
                                        <div className="mt-4 p-6 bg-gray-50 border border-gray-200 rounded-2xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                    <Shield className="w-4 h-4 text-green-700" />
                                                </div>
                                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Decoded Vault Data</h3>
                                            </div>
                                            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm relative overflow-hidden">
                                                <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-xs font-bold flex items-center gap-1.5 border-l border-b ${getActionInfo(decodedResult.type).color}`}>
                                                    {React.createElement(getActionInfo(decodedResult.type).icon, { className: 'w-3 h-3' })}
                                                    {getActionInfo(decodedResult.type).label}
                                                </div>
                                                <div className="pt-4 overflow-hidden">
                                                    {(decodedResult.type === 'message' || decodedResult.type === 'note') && (
                                                        <div className="text-gray-800 whitespace-pre-wrap font-medium">{decodedResult.data}</div>
                                                    )}
                                                    {decodedResult.type === 'redirect' && (
                                                        <div className="flex flex-col items-start gap-4">
                                                            <p className="text-gray-800 font-medium break-all">{decodedResult.data}</p>
                                                            <a href={decodedResult.data} target="_blank" rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                                                                Go to Link <CornerUpRight className="w-4 h-4" />
                                                            </a>
                                                        </div>
                                                    )}
                                                    {decodedResult.type === 'image' && (
                                                        <div className="flex flex-col items-start gap-4">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={decodedResult.data} alt="Decoded" className="max-w-full rounded-lg border border-gray-200" />
                                                            <a href={decodedResult.data} target="_blank" rel="noopener noreferrer"
                                                                className="text-sm text-blue-600 hover:underline font-medium break-all">{decodedResult.data}</a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 p-5 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
                            <Shield className="w-4 h-4" /> Passwords are bcrypt-hashed. Action data is never exposed in listings.
                        </div>
                    </div>
                </div>
            </main>

            {/* ═══════════ SHARED MODAL ═══════════ */}
            {modalMode && modalTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">

                        {/* modal header */}
                        <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 ${modalMode === 'delete' ? 'bg-red-50' : ''}`}>
                            <h2 className={`text-lg font-bold flex items-center gap-2 ${modalMode === 'delete' ? 'text-red-700' : 'text-black'}`}>
                                {modalMode === 'edit' && <><Pencil className="w-5 h-5" />Edit Action</>}
                                {modalMode === 'pause' && (modalTarget.status === 'paused'
                                    ? <><PlayCircle className="w-5 h-5 text-green-600" />Resume Action</>
                                    : <><PauseCircle className="w-5 h-5 text-yellow-600" />Pause Action</>)}
                                {modalMode === 'delete' && <><Trash2 className="w-5 h-5" />Delete Action</>}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-black transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleModalSubmit} className="p-6 space-y-5">
                            {modalError && <Alert type="error" message={modalError} />}
                            {modalSuccess && <Alert type="success" message={modalSuccess} />}

                            {/* Edit-only fields */}
                            {modalMode === 'edit' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-800">New Action Type</label>
                                        <select value={editActionType} onChange={(e) => setEditActionType(e.target.value as ActionType)}
                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer">
                                            <option value="message">Secret Message</option>
                                            <option value="redirect">Hidden Redirect</option>
                                            <option value="image">Secret Image URL</option>
                                            <option value="note">Private Note</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-800">New Content</label>
                                        {(editActionType === 'message' || editActionType === 'note') ? (
                                            <textarea value={editActionData} onChange={(e) => setEditActionData(e.target.value)}
                                                placeholder={`Updated ${editActionType}…`} required rows={3}
                                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors resize-none" />
                                        ) : (
                                            <input type="url" value={editActionData} onChange={(e) => setEditActionData(e.target.value)}
                                                placeholder="https://…" required
                                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors" />
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Pause/Delete description */}
                            {modalMode === 'pause' && (
                                <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                    {modalTarget.status === 'active'
                                        ? 'Pausing this action will prevent the Decode tab from returning results for this record.'
                                        : 'Resuming this action will make it active and decodable again.'}
                                </p>
                            )}
                            {modalMode === 'delete' && (
                                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-4">
                                    ⚠️ This will permanently delete this action. It cannot be undone.
                                </p>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal}
                                    className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={modalLoading || !!modalSuccess}
                                    className={`flex-1 py-3 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors ${modalMode === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-gray-800'
                                        }`}>
                                    {modalLoading ? <Spinner /> : (
                                        <>
                                            {modalMode === 'edit' && <><Save className="w-4 h-4" />Save Changes</>}
                                            {modalMode === 'pause' && (modalTarget.status === 'paused' ? <><PlayCircle className="w-4 h-4" />Resume</> : <><PauseCircle className="w-4 h-4" />Pause</>)}
                                            {modalMode === 'delete' && <><Trash2 className="w-4 h-4" />Delete</>}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Reusable tiny components ── */

function Spinner({ small = false }: { small?: boolean }) {
    return (
        <span className={`animate-spin inline-block rounded-full border-[3px] border-white/30 border-t-white ${small ? 'w-3 h-3' : 'w-5 h-5'}`} />
    );
}

function PasswordInput({ value, onChange, show, onToggle, placeholder, minLength }: {
    value: string; onChange: (v: string) => void; show: boolean;
    onToggle: () => void; placeholder: string; minLength: number;
}) {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
            </div>
            <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder} required minLength={minLength}
                className="w-full pl-11 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors" />
            <button type="button" onClick={onToggle}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black transition-colors">
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
        </div>
    );
}

function Alert({ type, message }: { type: 'error' | 'success'; message: string }) {
    const styles = type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200';
    const Icon = type === 'error' ? AlertTriangle : CheckCircle2;
    return (
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${styles}`}>
            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" /><p>{message}</p>
        </div>
    );
}
