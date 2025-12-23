import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  Send, 
  Users,
  Loader2,
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { isBrevoConfigured, sendEmail } from '@/lib/brevo';

interface EmailSettings {
  notification_email: string;
  notification_sender: string;
  brevo_list_id: string;
}

const EmailSettings = () => {
  const [settings, setSettings] = useState<EmailSettings>({
    notification_email: '',
    notification_sender: '',
    brevo_list_id: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('key, value')
          .in('key', ['notification_email', 'notification_sender', 'brevo_list_id']);

        if (error) throw error;

        const newSettings: EmailSettings = {
          notification_email: '',
          notification_sender: '',
          brevo_list_id: '',
        };

        data?.forEach(item => {
          if (item.key in newSettings) {
            newSettings[item.key as keyof EmailSettings] = item.value;
          }
        });

        setSettings(newSettings);
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Greška pri učitavanju postavki');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from('site_content')
          .upsert({
            key,
            value,
            content_type: 'text',
            description: getDescription(key),
          }, {
            onConflict: 'key',
          });

        if (error) throw error;
      }

      toast.success('Postavke spremljene');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Greška pri spremanju postavki');
    } finally {
      setSaving(false);
    }
  };

  const getDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      notification_email: 'Email na koji se šalju notifikacije o novim porukama',
      notification_sender: 'Email sa kojeg se šalju notifikacije',
      brevo_list_id: 'ID Brevo liste za marketing kontakte',
    };
    return descriptions[key] || '';
  };

  const sendTestEmail = async () => {
    if (!settings.notification_email) {
      toast.error('Molimo unesite email za notifikacije');
      return;
    }

    if (!isBrevoConfigured()) {
      toast.error('Brevo API nije konfigurisan. Dodajte VITE_BREVO_API_KEY u .env fajl.');
      return;
    }

    setTesting(true);
    try {
      const result = await sendEmail({
        to: settings.notification_email,
        subject: '[Toplik] Test Email - Notifikacije rade!',
        htmlContent: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #1E4528;">Test Email</h2>
            <p>Ovo je test email da potvrdimo da notifikacije rade ispravno.</p>
            <p style="color: #666;">Ako primate ovaj email, konfiguracija je uspješna!</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #999; font-size: 12px;">Toplik Village Resort</p>
          </div>
        `,
        senderEmail: settings.notification_sender || 'noreply@toplik.ba',
        senderName: 'Toplik Village Resort',
      });

      if (result.success) {
        toast.success('Test email poslan! Provjerite inbox.');
      } else {
        toast.error(`Greška: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Greška pri slanju test emaila');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-clash font-semibold text-gray-900">
            Email Postavke
          </h1>
          <p className="text-gray-500 mt-1">
            Konfigurirajte email notifikacije i Brevo integraciju
          </p>
        </div>

        {/* Brevo Status */}
        <Alert variant={isBrevoConfigured() ? 'default' : 'destructive'}>
          {isBrevoConfigured() ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            {isBrevoConfigured() ? (
              <span>Brevo API je konfigurisan i spreman za korištenje.</span>
            ) : (
              <span>
                Brevo API nije konfigurisan. Dodajte <code className="bg-gray-100 px-1 rounded">VITE_BREVO_API_KEY</code> u 
                <code className="bg-gray-100 px-1 rounded ml-1">client/.env</code> fajl i restartujte server.
              </span>
            )}
          </AlertDescription>
        </Alert>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Notifikacije
            </CardTitle>
            <CardDescription>
              Postavke za email notifikacije kada neko pošalje kontakt formu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="notification_email">Email za notifikacije</Label>
                <Input
                  id="notification_email"
                  type="email"
                  placeholder="admin@toplik.ba"
                  value={settings.notification_email}
                  onChange={(e) => setSettings(prev => ({ ...prev, notification_email: e.target.value }))}
                />
                <p className="text-xs text-gray-500">
                  Na ovaj email stižu obavijesti o novim porukama
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification_sender">Sender Email</Label>
                <Input
                  id="notification_sender"
                  type="email"
                  placeholder="noreply@toplik.ba"
                  value={settings.notification_sender}
                  onChange={(e) => setSettings(prev => ({ ...prev, notification_sender: e.target.value }))}
                />
                <p className="text-xs text-gray-500">
                  Email sa kojeg se šalju notifikacije (mora biti verifikovan u Brevo)
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={sendTestEmail}
                disabled={testing || !isBrevoConfigured()}
              >
                {testing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Pošalji Test Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Brevo Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Brevo Kontakti
            </CardTitle>
            <CardDescription>
              Postavke za sinhronizaciju kontakata sa Brevo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brevo_list_id">Brevo Lista ID</Label>
              <Input
                id="brevo_list_id"
                type="text"
                placeholder="npr. 3"
                value={settings.brevo_list_id}
                onChange={(e) => setSettings(prev => ({ ...prev, brevo_list_id: e.target.value }))}
              />
              <p className="text-xs text-gray-500">
                ID liste u Brevo-u u koju se dodaju kontakti koji pristanu na marketing. 
                Ostavite prazno ako ne želite koristiti liste.
              </p>
            </div>

            <a
              href="https://app.brevo.com/contact/list"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-[#1E4528] hover:underline"
            >
              Otvori Brevo Contacts
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="bg-[#1E4528] hover:bg-[#2a5c38]"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Spremi Postavke
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EmailSettings;







