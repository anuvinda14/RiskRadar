import { useState, useEffect } from 'react';
import { Phone, Mail, User, Trash2, CheckCircle2, Contact as ContactIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { Card } from '@/components/ui/Card';

export function ContactPage() {
  const { t, trustedContact, setContact, removeContact } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (trustedContact) {
      setName(trustedContact.name);
      setPhone(trustedContact.phone);
      setEmail(trustedContact.email);
    }
  }, [trustedContact]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setContact({ name: name.trim(), phone: phone.trim(), email: email.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50">
            <ContactIcon size={28} className="text-teal-700" />
          </div>
          <h1 className="font-bold text-slate-800" style={{ fontSize: 'var(--text-3xl)' }}>
            {t('contact.title')}
          </h1>
          <p className="mt-1 text-slate-600" style={{ fontSize: 'var(--text-lg)' }}>
            {t('contact.subtitle')}
          </p>
        </div>

        {trustedContact && !saved && (
          <Card className="mb-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-bold text-slate-800" style={{ fontSize: 'var(--text-xl)' }}>
                  {trustedContact.name}
                </p>
                {trustedContact.phone && (
                  <p className="flex items-center gap-2 text-slate-600" style={{ fontSize: 'var(--text-base)' }}>
                    <Phone size={16} /> {trustedContact.phone}
                  </p>
                )}
                {trustedContact.email && (
                  <p className="flex items-center gap-2 text-slate-600" style={{ fontSize: 'var(--text-base)' }}>
                    <Mail size={16} /> {trustedContact.email}
                  </p>
                )}
              </div>
              <Button variant="ghost" onClick={removeContact} className="!px-3 !py-2 text-red-600 hover:bg-red-50">
                <Trash2 size={20} />
              </Button>
            </div>
          </Card>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <InputField
            id="contact-name"
            label={t('contact.name')}
            placeholder={t('contact.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <InputField
            id="contact-phone"
            label={t('contact.phone')}
            placeholder={t('contact.phonePlaceholder')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
          />
          <InputField
            id="contact-email"
            label={t('contact.email')}
            placeholder={t('contact.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />

          <Button type="submit" disabled={!name.trim()}>
            <User size={20} />
            {t('contact.save')}
          </Button>

          {saved && (
            <p className="flex items-center gap-2 font-semibold text-green-600" style={{ fontSize: 'var(--text-base)' }}>
              <CheckCircle2 size={20} />
              {t('contact.saved')}
            </p>
          )}
        </form>
      </div>
    </Layout>
  );
}
