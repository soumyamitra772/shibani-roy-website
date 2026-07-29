import React, { useState, useEffect } from 'react';
import { Shield, Lock, Trash2, Mail, Database, Cpu, MessageSquare, FileText } from 'lucide-react';
import { dbService, DEFAULT_PRIVACY_CONTENT } from '../services/db';
import { PrivacyPolicyData } from '../types';

export const privacyContent = DEFAULT_PRIVACY_CONTENT;

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  MessageSquare,
  Cpu,
  Database,
  Trash2,
  Lock,
  Mail,
  FileText
};

export default function PrivacyPolicy() {
  const [data, setData] = useState<PrivacyPolicyData>(DEFAULT_PRIVACY_CONTENT);

  useEffect(() => {
    let isMounted = true;
    dbService.getPrivacyPolicy().then((policy) => {
      if (isMounted && policy) {
        setData(policy);
      }
    }).catch((err) => {
      console.warn('Error fetching privacy policy:', err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 animate-fade-in space-y-10">
      {/* Header section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-mono tracking-widest text-brand-600 uppercase font-black">
          Legal & Compliance
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-brand-900 tracking-tight leading-tight">
          {data.title}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
          {data.subtitle}
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/60 px-4 py-1.5 text-xs font-medium text-brand-800">
          <span>Last Updated: {data.lastUpdated}</span>
        </div>
      </div>

      {/* Policy content sections */}
      <div className="space-y-6">
        {data.sections.map((section) => {
          const Icon = (section.iconName && iconMap[section.iconName]) || Shield;
          return (
            <div
              key={section.id}
              id={section.id}
              className="rounded-[28px] border border-brand-100 bg-white/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all glass-card space-y-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-brand-50 text-brand-600 border border-brand-100 shrink-0 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-display font-bold text-brand-900 text-xl">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-2 text-sm text-zinc-700 leading-relaxed sm:pl-12">
                {section.content.map((paragraph, idx) => (
                  <p key={idx} className={paragraph.startsWith('•') ? 'pl-2' : ''}>
                    {paragraph.includes('rshibani096@gmail.com') ? (
                      <>
                        {paragraph.split('rshibani096@gmail.com')[0]}
                        <a
                          href="mailto:rshibani096@gmail.com"
                          className="font-mono font-bold text-brand-600 hover:underline"
                        >
                          rshibani096@gmail.com
                        </a>
                        {paragraph.split('rshibani096@gmail.com')[1]}
                      </>
                    ) : (
                      paragraph
                    )}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

