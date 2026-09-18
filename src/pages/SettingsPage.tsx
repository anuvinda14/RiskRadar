import { Settings as SettingsIcon, Type, Contrast, Globe, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/Card';
import { LANGUAGES } from '@/types';

export function SettingsPage() {
  const { t, settings, setLanguage, toggleLargerText, toggleHighContrast } = useApp();

  return (
    <Layout>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50">
            <SettingsIcon size={28} className="text-teal-700" />
          </div>
          <h1 className="font-bold text-slate-800" style={{ fontSize: 'var(--text-3xl)' }}>
            {t('settings.title')}
          </h1>
          <p className="mt-1 text-slate-600" style={{ fontSize: 'var(--text-lg)' }}>
            {t('settings.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          <Card>
            <div className="mb-3 flex items-center gap-3">
              <Globe size={24} className="text-teal-700" />
              <h2 className="font-bold text-slate-800" style={{ fontSize: 'var(--text-xl)' }}>
                {t('settings.language')}
              </h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 transition-colors ${
                    settings.language === lang.code
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={{ fontSize: 'var(--text-base)' }}
                >
                  <div className="text-left">
                    <p className="font-semibold text-slate-800">{lang.nativeLabel}</p>
                    <p className="text-slate-500">{lang.label}</p>
                  </div>
                  {settings.language === lang.code && <Check size={20} className="text-teal-600" />}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <button
              onClick={toggleLargerText}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Type size={24} className="text-teal-700" />
                <div className="text-left">
                  <p className="font-bold text-slate-800" style={{ fontSize: 'var(--text-xl)' }}>
                    {t('settings.largerText')}
                  </p>
                  <p className="text-slate-600" style={{ fontSize: 'var(--text-base)' }}>
                    {t('settings.largerTextDesc')}
                  </p>
                </div>
              </div>
              <div
                className={`relative h-8 w-14 flex-shrink-0 rounded-full transition-colors ${
                  settings.largerText ? 'bg-teal-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-transform ${
                    settings.largerText ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </div>
            </button>
          </Card>

          <Card>
            <button
              onClick={toggleHighContrast}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Contrast size={24} className="text-teal-700" />
                <div className="text-left">
                  <p className="font-bold text-slate-800" style={{ fontSize: 'var(--text-xl)' }}>
                    {t('settings.highContrast')}
                  </p>
                  <p className="text-slate-600" style={{ fontSize: 'var(--text-base)' }}>
                    {t('settings.highContrastDesc')}
                  </p>
                </div>
              </div>
              <div
                className={`relative h-8 w-14 flex-shrink-0 rounded-full transition-colors ${
                  settings.highContrast ? 'bg-teal-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-transform ${
                    settings.highContrast ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </div>
            </button>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
