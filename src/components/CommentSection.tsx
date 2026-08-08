import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  User, 
  Clock, 
  Loader2, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { BlogComment } from '../types';
import { getApprovedComments, submitComment } from '../services/db';

interface CommentSectionProps {
  postId: string;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form states
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getApprovedComments(postId)
      .then((data) => {
        if (isMounted) {
          setComments(data);
        }
      })
      .catch((err) => {
        console.warn('Failed to load comments:', err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await submitComment(postId, name, message);
      setSuccessMsg('Thank you! Your comment has been submitted and will appear after a quick review.');
      setName('');
      setMessage('');
    } catch (err: any) {
      console.error('Error posting comment:', err);
      setErrorMsg(err?.message || 'Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-brand-100 text-left space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-full bg-brand-50 border border-brand-200 text-brand-600">
          <MessageCircle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-2xl text-brand-950">
            Comments {comments.length > 0 && <span className="text-brand-600 text-lg">({comments.length})</span>}
          </h3>
          <p className="text-xs text-zinc-500 font-medium">
            Join the conversation and leave your thoughts below
          </p>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-brand-600">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-[24px] border border-brand-100 bg-white/60 p-8 text-center space-y-2 glass-card">
            <MessageCircle className="h-8 w-8 text-brand-300 mx-auto" />
            <p className="text-sm font-semibold text-brand-900">No comments yet</p>
            <p className="text-xs text-zinc-500">Be the first to share your thoughts on this article!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const initial = comment.name ? comment.name.trim().charAt(0).toUpperCase() : '?';
              return (
                <div
                  key={comment.id}
                  className="rounded-[24px] border border-brand-100 bg-white/80 p-5 shadow-sm hover:shadow-md transition-all glass-card space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                        {initial}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-brand-950 leading-tight">
                          {comment.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono mt-0.5">
                          <Clock className="h-3 w-3 text-brand-400" />
                          <span>{formatDate(comment.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed pl-12 whitespace-pre-line">
                    {comment.message}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Leave a Comment Form */}
      <div className="rounded-[28px] border border-brand-100 bg-white/90 p-6 sm:p-8 shadow-sm glass-card space-y-5">
        <div className="border-b border-brand-100 pb-3">
          <h4 className="font-display font-bold text-lg text-brand-950 flex items-center gap-2">
            <User className="h-4 w-4 text-brand-600" /> Leave a Comment
          </h4>
          <p className="text-xs text-zinc-500">Your email is not required. Comments are reviewed prior to publication.</p>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-brand-700 uppercase tracking-wider block">
              Your Name *
            </label>
            <input
              type="text"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full bg-white border border-brand-200 rounded-full py-3 px-5 text-sm text-brand-950 placeholder-brand-300 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold text-brand-700 uppercase tracking-wider block">
                Your Comment *
              </label>
              <span className={`text-xs font-mono font-bold ${message.length > 1200 ? 'text-red-600' : 'text-zinc-400'}`}>
                {message.length} / 1200
              </span>
            </div>
            <textarea
              required
              rows={4}
              maxLength={1200}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts or questions about this article..."
              className="w-full bg-white border border-brand-200 rounded-[20px] py-3.5 px-5 text-sm text-brand-950 placeholder-brand-300 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm leading-relaxed resize-none font-medium"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !name.trim() || !message.trim()}
              className="rounded-full bg-brand-600 px-7 py-3.5 text-xs font-bold text-white shadow-md hover:bg-brand-700 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 text-white" />
                  <span>Post Comment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
