import React, { useState, useEffect } from 'react';
import { FileText, Save, ExternalLink, Check, AlertCircle, Loader } from 'lucide-react';
import { dbService, DEFAULT_TERMS_CONTENT, DEFAULT_REFUND_CONTENT } from '../../services/db';
import { LegalPageData } from '../../types';

export default function AdminLegalPages() {
  const [terms, setTerms] = useState<LegalPageData>(DEFAULT_TERMS_CONTENT);
  const [refund, setRefund] = useState<LegalPageData>(DEFAULT_REFUND_CONTENT);

  const [loading, setLoading] = useState(true);

  // Terms toast state
  const [savingTerms, setSavingTerms] = useState(false);
  const [termsToast, setTermsToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Refund toast state
  const [savingRefund, setSavingRefund] = useState(false);
  const [refundToast, setRefundToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [termsData, refundData] = await Promise.all([
          dbService.getLegalPage('terms'),
          dbService.getLegalPage('refund')
        ]);
        if (isMounted) {
          if (termsData) setTerms(termsData);
          if (refundData) setRefund(refundData);
        }
      } catch (err) {
        console.error('Failed to load legal pages:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveTerms = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTerms(true);
    setTermsToast(null);

    try {
      const updated = await dbService.updateLegalPage('terms', terms.title, terms.content);
      setTerms(updated);
      setTermsToast({ type: 'success', message: 'Terms & Conditions saved successfully!' });
      setTimeout(() => setTermsToast(null), 4000);
    } catch (err: any) {
      console.error('Error saving Terms:', err);
      setTermsToast({ type: 'error', message: err?.message || 'Failed to save Terms & Conditions' });
    } finally {
      setSavingTerms(false);
    }
  };

  const handleSaveRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingRefund(true);
    setRefundToast(null);

    try {
      const updated = await dbService.updateLegalPage('refund', refund.title, refund.content);
      setRefund(updated);
      setRefundToast({ type: 'success', message: 'Refund Policy saved successfully!' });
      setTimeout(() => setRefundToast(null), 4000);
    } catch (err: any) {
      console.error('Error saving Refund Policy:', err);
      setRefundToast({ type: 'error', message: err?.message || 'Failed to save Refund Policy' });
    } finally {
      setSavingRefund(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Not saved yet';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-brand-600">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-100 pb-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-brand-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-brand-600" /> Legal Pages Management
          </h2>
          <p className="text-xs text-zinc-600 mt-1">
            Update title and HTML content for Terms & Conditions and Refund & Cancellation policies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Card 1: Terms & Conditions */}
        <div className="rounded-[28px] border border-brand-100 bg-white/80 p-6 shadow-sm glass-card space-y-5 text-left">
          <div className="flex items-center justify-between border-b border-brand-100 pb-3">
            <h3 className="font-display font-bold text-lg text-brand-900">
              Terms & Conditions
            </h3>
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 transition"
            >
              <span>Preview</span> <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {termsToast && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2 ${
                termsToast.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {termsToast.type === 'success' ? (
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              )}
              <span>{termsToast.message}</span>
            </div>
          )}

          <form onSubmit={handleSaveTerms} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-brand-700 uppercase tracking-wider">
                Title
              </label>
              <input
                type="text"
                required
                value={terms.title}
                onChange={(e) => setTerms({ ...terms, title: e.target.value })}
                className="w-full bg-white border border-brand-200 rounded-full py-2.5 px-4 text-sm text-brand-950 focus:outline-none focus:border-brand-500 shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-brand-700 uppercase tracking-wider">
                HTML Content
              </label>
              <textarea
                required
                value={terms.content}
                onChange={(e) => setTerms({ ...terms, content: e.target.value })}
                className="w-full min-h-[300px] bg-white border border-brand-200 rounded-2xl p-4 text-xs font-mono text-brand-950 focus:outline-none focus:border-brand-500 shadow-sm leading-relaxed"
                placeholder="<p>HTML content here...</p>"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={savingTerms}
                className="w-full rounded-full bg-brand-600 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-700 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {savingTerms ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin text-white" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 text-white" /> Save Changes
                  </>
                )}
              </button>
              <p className="text-[11px] text-zinc-500 text-center font-mono">
                Last updated: {formatDate(terms.last_updated)}
              </p>
            </div>
          </form>
        </div>

        {/* Card 2: Refund & Cancellation Policy */}
        <div className="rounded-[28px] border border-brand-100 bg-white/80 p-6 shadow-sm glass-card space-y-5 text-left">
          <div className="flex items-center justify-between border-b border-brand-100 pb-3">
            <h3 className="font-display font-bold text-lg text-brand-900">
              Refund & Cancellation Policy
            </h3>
            <a
              href="/refund"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 transition"
            >
              <span>Preview</span> <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {refundToast && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2 ${
                refundToast.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {refundToast.type === 'success' ? (
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              )}
              <span>{refundToast.message}</span>
            </div>
          )}

          <form onSubmit={handleSaveRefund} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-brand-700 uppercase tracking-wider">
                Title
              </label>
              <input
                type="text"
                required
                value={refund.title}
                onChange={(e) => setRefund({ ...refund, title: e.target.value })}
                className="w-full bg-white border border-brand-200 rounded-full py-2.5 px-4 text-sm text-brand-950 focus:outline-none focus:border-brand-500 shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-brand-700 uppercase tracking-wider">
                HTML Content
              </label>
              <textarea
                required
                value={refund.content}
                onChange={(e) => setRefund({ ...refund, content: e.target.value })}
                className="w-full min-h-[300px] bg-white border border-brand-200 rounded-2xl p-4 text-xs font-mono text-brand-950 focus:outline-none focus:border-brand-500 shadow-sm leading-relaxed"
                placeholder="<p>HTML content here...</p>"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={savingRefund}
                className="w-full rounded-full bg-brand-600 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-700 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {savingRefund ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin text-white" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 text-white" /> Save Changes
                  </>
                )}
              </button>
              <p className="text-[11px] text-zinc-500 text-center font-mono">
                Last updated: {formatDate(refund.last_updated)}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
