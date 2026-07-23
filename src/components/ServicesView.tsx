import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { ServiceItem, ServicesPageSettings } from '../types';
import { navigate } from '../utils/navigation';
import { Check, Sparkles, ArrowRight, MessageSquare, Mail, Briefcase } from 'lucide-react';

interface ServicesViewProps {
  settings?: ServicesPageSettings;
  services?: ServiceItem[];
}

export default function ServicesView({ settings: initialSettings, services: initialServices }: ServicesViewProps) {
  const [settings, setSettings] = useState<ServicesPageSettings>(initialSettings || {
    id: 1,
    hero_heading: "Work With Shibani",
    hero_subtext: "India's AI virtual influencer — available for brand partnerships, digital campaigns, and virtual modeling projects.",
    hero_image_url: ""
  });
  const [services, setServices] = useState<ServiceItem[]>(initialServices || []);
  const [loading, setLoading] = useState(!initialServices);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedSettings, loadedServices] = await Promise.all([
          dbService.getServicesPageSettings(),
          dbService.getServices(false) // active only
        ]);
        if (loadedSettings) setSettings(loadedSettings);
        if (loadedServices) setServices(loadedServices);
      } catch (err) {
        console.error('Failed to load services data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div id="services-page-container" className="min-h-screen pb-20 pt-6 animate-fade-in">
      {/* Hero Section */}
      <section id="services-hero" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-b from-brand-50/60 via-white to-white p-8 sm:p-12 md:p-16 shadow-xl shadow-brand-900/5">
          {/* Decorative Background Accents */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-rose-100/40 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className={`space-y-6 ${settings.hero_image_url ? 'lg:col-span-7' : 'lg:col-span-12 text-center max-w-3xl mx-auto'}`}>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-white px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-brand-500 fill-brand-400" />
                <span>OFFICIAL COLLABORATION & SERVICES</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
                {settings.hero_heading || "Work With Shibani"}
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl">
                {settings.hero_subtext || "India's AI virtual influencer — available for brand partnerships, digital campaigns, and virtual modeling projects."}
              </p>

              <div className={`flex flex-wrap items-center gap-4 pt-2 ${settings.hero_image_url ? '' : 'justify-center'}`}>
                <button
                  id="hero-inquire-btn"
                  onClick={() => navigate('/contact')}
                  className="inline-flex items-center space-x-2.5 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-700 hover:shadow-brand-600/35 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Mail className="h-4 w-4" />
                  <span>Start a Collaboration</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href="https://t.me/shibani_companion_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 rounded-full border border-brand-200/80 bg-white px-6 py-3.5 text-sm font-semibold text-brand-900 shadow-sm transition hover:bg-brand-50/80"
                >
                  <MessageSquare className="h-4 w-4 text-brand-600" />
                  <span>Chat on Telegram</span>
                </a>
              </div>
            </div>

            {settings.hero_image_url && (
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group w-full max-w-md overflow-hidden rounded-2xl border border-brand-200/80 shadow-2xl bg-white p-2">
                  <img
                    src={settings.hero_image_url}
                    alt={settings.hero_heading}
                    className="w-full h-80 sm:h-96 object-cover rounded-xl transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[10px] font-mono tracking-widest uppercase bg-brand-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full font-bold">
                      SHIBANI ROY
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services-grid-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-600">
            OFFERINGS & CAPABILITIES
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-zinc-900">
            Tailored Partnerships for Forward-Thinking Brands
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Combining fashion, culture, and synthetic intelligence to deliver high-impact digital narratives.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-zinc-100 animate-pulse border border-zinc-200/60" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200/80 p-8 shadow-sm">
            <Briefcase className="h-10 w-10 text-brand-400 mx-auto mb-3" />
            <h3 className="text-lg font-display font-bold text-zinc-900 mb-1">No services currently listed</h3>
            <p className="text-sm text-zinc-500 mb-6">Please check back soon or send us a direct message.</p>
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center space-x-2 rounded-full bg-brand-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 transition"
            >
              <span>Get in Touch</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="group relative flex flex-col justify-between rounded-3xl border border-brand-100 bg-white p-7 shadow-lg shadow-brand-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-900/10"
              >
                <div>
                  {/* Emoji & Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl border border-brand-200/60 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {service.icon || '✨'}
                    </div>
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
                      SERVICE #{service.sort_order}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-2xl font-bold text-zinc-900 group-hover:text-brand-700 transition-colors mb-3">
                    {service.title}
                  </h3>

                  <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Included Bullet Points */}
                  {service.includes && service.includes.length > 0 && (
                    <div className="border-t border-brand-100/80 pt-5 mb-8">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-3 font-mono">
                        WHAT'S INCLUDED:
                      </span>
                      <ul className="space-y-2.5">
                        {service.includes.map((item, idx) => (
                          <li key={idx} className="flex items-start text-xs font-medium text-zinc-700">
                            <span className="mr-2.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 mt-0.5">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </span>
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Card Action CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full inline-flex items-center justify-center space-x-2 rounded-xl border border-brand-200 bg-brand-50/50 py-3 text-xs font-bold text-brand-900 transition-all hover:bg-brand-600 hover:text-white hover:border-brand-600 shadow-sm"
                  >
                    <span>Inquire About This Service</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA Banner */}
      <section id="services-bottom-cta" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-brand-200 bg-zinc-900 p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -top-16 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="inline-block text-[11px] font-mono tracking-widest text-brand-300 uppercase font-bold bg-white/10 px-3 py-1 rounded-full border border-white/10">
              READY TO COLLABORATE?
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Have a Custom Campaign in Mind?
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              We create bespoke virtual experiences, specialized 3D renders, and custom brand storytelling tailored to your exact creative requirements.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center space-x-2.5 rounded-full bg-brand-500 px-7 py-3 text-sm font-semibold text-white shadow-lg hover:bg-brand-600 transition"
              >
                <Mail className="h-4 w-4" />
                <span>Contact Shibani's Team</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
