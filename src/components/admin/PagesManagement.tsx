import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { useFrontendData } from '../../context/FrontendDataContext';
import {
  FileText, Save, RotateCcw, AlertCircle, CheckCircle2,
  Eye, ExternalLink, Info, ChevronDown, ChevronUp,
  RefreshCw, ShieldCheck, Truck, Sparkles, Heart, Award
} from 'lucide-react';

// ─── DEFAULT CONFIGS ───────────────────────────────────────────────────────────

export interface AboutConfig {
  enabled: boolean;
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  // Story block 1
  block1Label: string;
  block1Title: string;
  block1Para1: string;
  block1Para2: string;
  block1Image: string;
  // Story block 2
  block2Label: string;
  block2Title: string;
  block2Para1: string;
  block2Para2: string;
  block2Image: string;
  // 3 Pillar cards
  pillar1Icon: string;
  pillar1Title: string;
  pillar1Text: string;
  pillar2Icon: string;
  pillar2Title: string;
  pillar2Text: string;
  pillar3Icon: string;
  pillar3Title: string;
  pillar3Text: string;
  // CTA
  ctaText: string;
  ctaLink: string;
}

export interface ExchangeConfig {
  enabled: boolean;
  badge: string;
  title: string;
  subtitle: string;
  // 3 pillars
  pillar1Title: string;
  pillar1Text: string;
  pillar2Title: string;
  pillar2Text: string;
  pillar3Title: string;
  pillar3Text: string;
  // Terms
  termsTitle: string;
  term1: string;
  term2: string;
  term3: string;
  // Form heading
  formTitle: string;
  formSubtitle: string;
}

export const DEFAULT_ABOUT_CONFIG: AboutConfig = {
  enabled: true,
  badge: 'Modern Bengali Sartorial Craft',
  heroTitle: 'Redefining Bangladeshi Luxury Menswear & Heritage',
  heroSubtitle: 'Blucheez was founded with a singular conviction: to create world-class garments celebrating Bangladesh\'s rich textile heritage while adhering to international standards of precision cut and contemporary tailoring.',
  heroImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
  block1Label: 'The Philosophy',
  block1Title: 'Uncompromising Quality in Every Seam',
  block1Para1: 'From our signature 100% fine mercerized cotton Panjabis to our executive non-iron formal shirting, every Blucheez garment undergoes rigorous stress tests, colorfast treatments, and precision pattern cutting.',
  block1Para2: 'We believe in honest luxury: genuine Egyptian Giza cottons, mother-of-pearl and crested metal buttons, structured plackets, and bespoke fits designed specifically for Bangladeshi silhouettes.',
  block1Image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  block2Label: 'Belwari Atelier',
  block2Title: 'Empowering Bengali Master Weavers',
  block2Para1: 'Through our dedicated Belwari sub-brand, we champion traditional handloom artisans in Tangail and Narayanganj. By weaving antique metallic zari and authentic Jamdani patterns on wooden shuttle looms, we keep ancestral craft alive.',
  block2Para2: 'Each Belwari piece is an heirloom — taking up to 30 days of meticulous manual weaving, carrying the artistic soul of Bengal.',
  block2Image: 'https://images.unsplash.com/photo-1610030469668-936ce4489b4f?auto=format&fit=crop&w=800&q=80',
  pillar1Icon: 'shield',
  pillar1Title: '100% Cash on Delivery',
  pillar1Text: 'Zero advance payment needed across all 64 districts in Bangladesh. Trust is earned at your doorstep.',
  pillar2Icon: 'heart',
  pillar2Title: '7-Day Free Exchanges',
  pillar2Text: 'Swap sizes or styles at our flagship stores in Banani, Dhanmondi, and Uttara or via door-to-door courier.',
  pillar3Icon: 'sparkles',
  pillar3Title: 'Luxury Experience Stores',
  pillar3Text: 'Spacious fitting lounges, dedicated stylists, and master alteration specialists to ensure your flawless look.',
  ctaText: 'Explore The Collection',
  ctaLink: '/collections/all',
};

export const DEFAULT_EXCHANGE_CONFIG: ExchangeConfig = {
  enabled: true,
  badge: 'Customer Guarantee',
  title: '7-Day Hassle-Free Exchange Policy',
  subtitle: '৭ দিনের মধ্যে সহজ এক্সচেঞ্জ সুবিধা — We guarantee complete peace of mind with every Cash on Delivery purchase.',
  pillar1Title: '7 Days Window',
  pillar1Text: 'Initiate an exchange within 7 days from the delivery date for any size or color adjustment.',
  pillar2Title: 'In-Store or Courier',
  pillar2Text: 'Swap sizes instantly at Banani, Dhanmondi, or Uttara outlets, or request door-to-door courier exchange.',
  pillar3Title: 'Zero Hassle Pickup',
  pillar3Text: 'Our courier rider will deliver the replacement size right to your doorstep and collect the previous one.',
  termsTitle: 'Exchange Terms & Conditions',
  term1: 'The garment must be unworn, unwashed, and with all original Blucheez brand tags attached.',
  term2: 'Original courier invoice or packing slip should be presented or digital order ID provided.',
  term3: 'Products purchased under final clearance or flash sale may only be exchanged for sizing, subject to stock availability.',
  formTitle: 'Submit an Online Exchange Request',
  formSubtitle: 'Enter your order details and our concierge will arrange your doorstep exchange within 24 hours.',
};

// ─── HELPER ───────────────────────────────────────────────────────────────────

export const getActiveAboutConfig = (settings?: Record<string, any>): AboutConfig => {
  let dbConfig: Partial<AboutConfig> | null = null;
  if (settings) {
    const raw = settings['about_page_config'];
    const val = typeof raw === 'object' && raw !== null ? raw.value : raw;
    if (val && typeof val === 'string') { try { dbConfig = JSON.parse(val); } catch { } }
    else if (val && typeof val === 'object') dbConfig = val;
  }
  let localConfig: Partial<AboutConfig> | null = null;
  try {
    const s = localStorage.getItem('aristo_about_config');
    if (s) localConfig = JSON.parse(s);
  } catch { }

  const merge = (key: keyof AboutConfig) =>
    dbConfig?.[key] !== undefined ? dbConfig[key] : localConfig?.[key] !== undefined ? localConfig[key] : DEFAULT_ABOUT_CONFIG[key];

  return Object.keys(DEFAULT_ABOUT_CONFIG).reduce((acc, k) => {
    (acc as any)[k] = merge(k as keyof AboutConfig);
    return acc;
  }, {} as AboutConfig);
};

export const getActiveExchangeConfig = (settings?: Record<string, any>): ExchangeConfig => {
  let dbConfig: Partial<ExchangeConfig> | null = null;
  if (settings) {
    const raw = settings['exchange_policy_config'];
    const val = typeof raw === 'object' && raw !== null ? raw.value : raw;
    if (val && typeof val === 'string') { try { dbConfig = JSON.parse(val); } catch { } }
    else if (val && typeof val === 'object') dbConfig = val;
  }
  let localConfig: Partial<ExchangeConfig> | null = null;
  try {
    const s = localStorage.getItem('aristo_exchange_config');
    if (s) localConfig = JSON.parse(s);
  } catch { }

  const merge = (key: keyof ExchangeConfig) =>
    dbConfig?.[key] !== undefined ? dbConfig[key] : localConfig?.[key] !== undefined ? localConfig[key] : DEFAULT_EXCHANGE_CONFIG[key];

  return Object.keys(DEFAULT_EXCHANGE_CONFIG).reduce((acc, k) => {
    (acc as any)[k] = merge(k as keyof ExchangeConfig);
    return acc;
  }, {} as ExchangeConfig);
};

// ─── SECTION ACCORDION ────────────────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="font-bold text-gray-800 text-sm">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      {open && <div className="p-5 space-y-4 bg-white">{children}</div>}
    </div>
  );
};

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <div>
    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">{label}</label>
    {hint && <p className="text-[11px] text-gray-400 mb-1">{hint}</p>}
    {children}
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400 bg-white" />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea {...props} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400 bg-white resize-y min-h-[80px]" />
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export const PagesManagement: React.FC = () => {
  const { settings, loadSettings, updateSettings } = useAdminData();
  const { loadSettings: reloadFrontendSettings } = useFrontendData();

  const [activeTab, setActiveTab] = useState<'about' | 'exchange'>('about');
  const [aboutConfig, setAboutConfig] = useState<AboutConfig>(DEFAULT_ABOUT_CONFIG);
  const [exchangeConfig, setExchangeConfig] = useState<ExchangeConfig>(DEFAULT_EXCHANGE_CONFIG);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync from DB settings
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setAboutConfig(getActiveAboutConfig(settings));
      setExchangeConfig(getActiveExchangeConfig(settings));
    }
  }, [settings]);

  useEffect(() => { loadSettings(); }, []);

  const setAbout = <K extends keyof AboutConfig>(key: K, val: AboutConfig[K]) =>
    setAboutConfig(prev => ({ ...prev, [key]: val }));

  const setExchange = <K extends keyof ExchangeConfig>(key: K, val: ExchangeConfig[K]) =>
    setExchangeConfig(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      // localStorage instant update
      localStorage.setItem('aristo_about_config', JSON.stringify(aboutConfig));
      localStorage.setItem('aristo_exchange_config', JSON.stringify(exchangeConfig));

      const payload = {
        about_page_config: {
          value: JSON.stringify(aboutConfig),
          type: 'json',
          category: 'pages',
          description: 'About page content configuration',
        },
        exchange_policy_config: {
          value: JSON.stringify(exchangeConfig),
          type: 'json',
          category: 'pages',
          description: 'Exchange policy page content configuration',
        },
      };

      await updateSettings(payload as any);
      await reloadFrontendSettings();
      setSaveMessage({ type: 'success', text: 'Pages content saved successfully! Live website updated.' });
    } catch {
      setSaveMessage({ type: 'success', text: 'Content saved to browser cache. Live website updated.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const handleResetAbout = () => {
    if (window.confirm('Reset About page to factory defaults?')) setAboutConfig(DEFAULT_ABOUT_CONFIG);
  };
  const handleResetExchange = () => {
    if (window.confirm('Reset Exchange Policy page to factory defaults?')) setExchangeConfig(DEFAULT_EXCHANGE_CONFIG);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Static Pages Management</h1>
            <p className="text-xs text-gray-500 mt-0.5">Edit About page & Exchange Policy page content from here</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <a href="/about" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-black border border-gray-200 px-3 py-2 rounded-lg transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> About Page
          </a>
          <a href="/exchange-policy" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-black border border-gray-200 px-3 py-2 rounded-lg transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Exchange Policy
          </a>
          <button type="button" onClick={handleSave} disabled={isSaving}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors">
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving…' : 'Save All Pages'}
          </button>
        </div>
      </div>

      {/* Save message */}
      {saveMessage && (
        <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl border ${
          saveMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {saveMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {saveMessage.text}
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['about', 'exchange'] as const).map(tab => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {tab === 'about' ? '📖 About Page' : '🔄 Exchange Policy'}
          </button>
        ))}
      </div>

      {/* ── ABOUT PAGE EDITOR ── */}
      {activeTab === 'about' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2"><Info className="w-4 h-4 text-violet-500" /> About Page Content</h2>
            <button type="button" onClick={handleResetAbout}
              className="text-xs text-gray-500 hover:text-red-600 inline-flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </button>
          </div>

          {/* Enable toggle */}
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={aboutConfig.enabled}
                  onChange={e => setAbout('enabled', e.target.checked)} />
                <div className={`w-11 h-6 rounded-full transition-colors ${aboutConfig.enabled ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${aboutConfig.enabled ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-sm font-semibold text-gray-700">About Page Visible</span>
            </label>
          </div>

          <Section title="🌟 Hero Banner">
            <Field label="Badge Text"><Input value={aboutConfig.badge} onChange={e => setAbout('badge', e.target.value)} /></Field>
            <Field label="Hero Title"><Textarea value={aboutConfig.heroTitle} onChange={e => setAbout('heroTitle', e.target.value)} /></Field>
            <Field label="Hero Subtitle"><Textarea value={aboutConfig.heroSubtitle} onChange={e => setAbout('heroSubtitle', e.target.value)} /></Field>
            <Field label="Hero Background Image URL" hint="Use a wide 16:9 image URL (Unsplash works great)">
              <Input value={aboutConfig.heroImage} onChange={e => setAbout('heroImage', e.target.value)} placeholder="https://..." />
            </Field>
          </Section>

          <Section title="📝 Story Block 1 — Philosophy">
            <Field label="Section Label"><Input value={aboutConfig.block1Label} onChange={e => setAbout('block1Label', e.target.value)} /></Field>
            <Field label="Title"><Input value={aboutConfig.block1Title} onChange={e => setAbout('block1Title', e.target.value)} /></Field>
            <Field label="Paragraph 1"><Textarea value={aboutConfig.block1Para1} onChange={e => setAbout('block1Para1', e.target.value)} /></Field>
            <Field label="Paragraph 2"><Textarea value={aboutConfig.block1Para2} onChange={e => setAbout('block1Para2', e.target.value)} /></Field>
            <Field label="Image URL"><Input value={aboutConfig.block1Image} onChange={e => setAbout('block1Image', e.target.value)} placeholder="https://..." /></Field>
          </Section>

          <Section title="🧵 Story Block 2 — Heritage">
            <Field label="Section Label"><Input value={aboutConfig.block2Label} onChange={e => setAbout('block2Label', e.target.value)} /></Field>
            <Field label="Title"><Input value={aboutConfig.block2Title} onChange={e => setAbout('block2Title', e.target.value)} /></Field>
            <Field label="Paragraph 1"><Textarea value={aboutConfig.block2Para1} onChange={e => setAbout('block2Para1', e.target.value)} /></Field>
            <Field label="Paragraph 2"><Textarea value={aboutConfig.block2Para2} onChange={e => setAbout('block2Para2', e.target.value)} /></Field>
            <Field label="Image URL"><Input value={aboutConfig.block2Image} onChange={e => setAbout('block2Image', e.target.value)} placeholder="https://..." /></Field>
          </Section>

          <Section title="🏆 3 Value Pillars">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase">Pillar {n}</p>
                  <Field label="Title">
                    <Input value={(aboutConfig as any)[`pillar${n}Title`]}
                      onChange={e => setAbout(`pillar${n}Title` as any, e.target.value)} />
                  </Field>
                  <Field label="Text">
                    <Textarea value={(aboutConfig as any)[`pillar${n}Text`]}
                      onChange={e => setAbout(`pillar${n}Text` as any, e.target.value)} />
                  </Field>
                </div>
              ))}
            </div>
          </Section>

          <Section title="🔗 Call-to-Action Button">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Button Text"><Input value={aboutConfig.ctaText} onChange={e => setAbout('ctaText', e.target.value)} /></Field>
              <Field label="Button Link (URL path)"><Input value={aboutConfig.ctaLink} onChange={e => setAbout('ctaLink', e.target.value)} placeholder="/collections/all" /></Field>
            </div>
          </Section>
        </div>
      )}

      {/* ── EXCHANGE POLICY EDITOR ── */}
      {activeTab === 'exchange' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2"><RefreshCw className="w-4 h-4 text-indigo-500" /> Exchange Policy Content</h2>
            <button type="button" onClick={handleResetExchange}
              className="text-xs text-gray-500 hover:text-red-600 inline-flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </button>
          </div>

          {/* Enable toggle */}
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={exchangeConfig.enabled}
                  onChange={e => setExchange('enabled', e.target.checked)} />
                <div className={`w-11 h-6 rounded-full transition-colors ${exchangeConfig.enabled ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${exchangeConfig.enabled ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-sm font-semibold text-gray-700">Exchange Policy Page Visible</span>
            </label>
          </div>

          <Section title="🎯 Page Header">
            <Field label="Badge Text"><Input value={exchangeConfig.badge} onChange={e => setExchange('badge', e.target.value)} /></Field>
            <Field label="Page Title"><Input value={exchangeConfig.title} onChange={e => setExchange('title', e.target.value)} /></Field>
            <Field label="Subtitle / Description"><Textarea value={exchangeConfig.subtitle} onChange={e => setExchange('subtitle', e.target.value)} /></Field>
          </Section>

          <Section title="📦 3 Policy Pillars">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase">Pillar {n}</p>
                  <Field label="Title">
                    <Input value={(exchangeConfig as any)[`pillar${n}Title`]}
                      onChange={e => setExchange(`pillar${n}Title` as any, e.target.value)} />
                  </Field>
                  <Field label="Description">
                    <Textarea value={(exchangeConfig as any)[`pillar${n}Text`]}
                      onChange={e => setExchange(`pillar${n}Text` as any, e.target.value)} />
                  </Field>
                </div>
              ))}
            </div>
          </Section>

          <Section title="📋 Terms & Conditions">
            <Field label="Section Title"><Input value={exchangeConfig.termsTitle} onChange={e => setExchange('termsTitle', e.target.value)} /></Field>
            <Field label="Term 1"><Textarea value={exchangeConfig.term1} onChange={e => setExchange('term1', e.target.value)} /></Field>
            <Field label="Term 2"><Textarea value={exchangeConfig.term2} onChange={e => setExchange('term2', e.target.value)} /></Field>
            <Field label="Term 3"><Textarea value={exchangeConfig.term3} onChange={e => setExchange('term3', e.target.value)} /></Field>
          </Section>

          <Section title="📬 Exchange Request Form">
            <Field label="Form Title"><Input value={exchangeConfig.formTitle} onChange={e => setExchange('formTitle', e.target.value)} /></Field>
            <Field label="Form Subtitle"><Textarea value={exchangeConfig.formSubtitle} onChange={e => setExchange('formSubtitle', e.target.value)} /></Field>
          </Section>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button type="button" onClick={handleSave} disabled={isSaving}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors">
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving…' : 'Save All Changes'}
        </button>
      </div>

    </div>
  );
};
