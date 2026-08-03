import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader } from 'lucide-react';
import { dbService, DEFAULT_REFUND_CONTENT } from '../services/db';
import { LegalPageData } from '../types';
import { navigate } from '../utils/navigation';

function formatDate(dateStr?: string) {
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

export default function RefundPage() {
  const [data, setData] = useState<LegalPageData>(DEFAULT_REFUND_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    dbService.getLegalPage('refund').then((page) => {
      if (isMounted && page) {
        setData(page);
      }
    }).catch((err) => {
      console.warn('Error fetching refund page:', err);
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const formattedDate = formatDate(data.last_updated);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 animate-fade-in space-y-8">
      {/* Header section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-mono tracking-widest text-brand-600 uppercase font-black">
          Legal & Compliance
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-brand-900 tracking-tight leading-tight">
          {data.title}
        </h1>
        {formattedDate && (
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/60 px-4 py-1.5 text-xs font-medium text-brand-800">
            <span>Last updated: {formattedDate}</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="rounded-[28px] border border-brand-100 bg-white/80 p-6 sm:p-10 shadow-sm hover:shadow-md transition-all glass-card text-left">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="h-8 w-8 text-brand-600 animate-spin" />
          </div>
        ) : (
          <div
            className="prose prose-brand max-w-none text-zinc-700 text-sm sm:text-base leading-relaxed space-y-4 [&>h2]:font-display [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-brand-900 [&>h2]:mt-6 [&>h2]:mb-2 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>a]:text-brand-600 [&>a]:font-semibold [&>a]:underline"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        )}
      </div>

      {/* Bottom Back Link */}
      <div className="pt-4 text-center">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
}
