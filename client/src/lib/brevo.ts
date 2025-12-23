// Brevo (formerly Sendinblue) API Integration
// API Documentation: https://developers.brevo.com/reference

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3';

export const isBrevoConfigured = () => {
  return BREVO_API_KEY && BREVO_API_KEY !== 'your-brevo-api-key-here';
};

interface EmailParams {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  senderEmail: string;
  senderName?: string;
}

interface ContactParams {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  listIds?: number[];
  attributes?: Record<string, string | number | boolean>;
  updateEnabled?: boolean;
}

interface SubmissionEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  submissionType: string;
  marketingConsent: boolean;
  adminPanelUrl?: string;
}

/**
 * Send transactional email via Brevo API
 */
export const sendEmail = async (params: EmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  if (!isBrevoConfigured()) {
    console.warn('Brevo is not configured. Email not sent.');
    return { success: false, error: 'Brevo not configured' };
  }

  try {
    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: params.senderName || 'Toplik Village Resort',
          email: params.senderEmail,
        },
        to: [
          {
            email: params.to,
            name: params.toName || params.to,
          },
        ],
        subject: params.subject,
        htmlContent: params.htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo email error:', errorData);
      return { success: false, error: errorData.message || 'Failed to send email' };
    }

    const data = await response.json();
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('Brevo email error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Add or update contact in Brevo
 */
export const addContact = async (params: ContactParams): Promise<{ success: boolean; id?: number; error?: string }> => {
  if (!isBrevoConfigured()) {
    console.warn('Brevo is not configured. Contact not added.');
    return { success: false, error: 'Brevo not configured' };
  }

  try {
    const requestBody = {
      email: params.email,
      listIds: params.listIds || [],
      updateEnabled: params.updateEnabled ?? true,
      attributes: {
        FIRSTNAME: params.firstName || '',
        LASTNAME: params.lastName || '',
        SMS: params.phone || '',
        ...params.attributes,
      },
    };
    
    console.log('Brevo addContact request:', requestBody);
    
    const response = await fetch(`${BREVO_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Brevo addContact response status:', response.status);

    // 201 = created, 204 = updated (if updateEnabled)
    if (response.status === 201 || response.status === 204) {
      const data = response.status === 201 ? await response.json() : {};
      console.log('Brevo contact created/updated successfully:', data);
      return { success: true, id: data.id };
    }

    // Handle duplicate contact or SMS conflict
    if (response.status === 400) {
      const errorData = await response.json();
      console.log('Brevo 400 response:', errorData);
      
      // Handle various "already exists" scenarios
      if (errorData.code === 'duplicate_parameter' || 
          errorData.message?.includes('already associated') ||
          errorData.message?.includes('Contact already exist')) {
        console.log('Contact already exists in Brevo, treating as success');
        return { success: true };
      }
      return { success: false, error: errorData.message };
    }

    const errorData = await response.json();
    console.error('Brevo contact error:', errorData);
    return { success: false, error: errorData.message || 'Failed to add contact' };
  } catch (error) {
    console.error('Brevo contact error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Generate HTML email template for form submission notification
 */
export const generateSubmissionEmailHTML = (data: SubmissionEmailData): string => {
  const submissionTypeLabels: Record<string, string> = {
    contact: 'Kontakt poruka',
    reservation: 'Zahtjev za rezervaciju',
    inquiry: 'Upit',
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nova poruka - Toplik Village Resort</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #1E4528; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                Toplik Village Resort
              </h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">
                ${submissionTypeLabels[data.submissionType] || 'Nova poruka'}
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 20px; color: #1E4528; font-size: 20px;">
                Nova poruka od: ${data.name}
              </h2>
              
              <!-- Contact Info -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 10px; background-color: #f8f9fa; border-radius: 4px;">
                    <p style="margin: 0 0 8px; color: #666; font-size: 12px; text-transform: uppercase;">Email</p>
                    <p style="margin: 0; color: #333; font-size: 16px;">
                      <a href="mailto:${data.email}" style="color: #1E4528; text-decoration: none;">${data.email}</a>
                    </p>
                  </td>
                </tr>
                ${data.phone ? `
                <tr>
                  <td style="padding: 10px; background-color: #f8f9fa; border-radius: 4px; margin-top: 10px;">
                    <p style="margin: 0 0 8px; color: #666; font-size: 12px; text-transform: uppercase;">Telefon</p>
                    <p style="margin: 0; color: #333; font-size: 16px;">
                      <a href="tel:${data.phone}" style="color: #1E4528; text-decoration: none;">${data.phone}</a>
                    </p>
                  </td>
                </tr>
                ` : ''}
              </table>
              
              <!-- Message -->
              <div style="padding: 20px; background-color: #f8f9fa; border-radius: 4px; border-left: 4px solid #1E4528;">
                <p style="margin: 0 0 8px; color: #666; font-size: 12px; text-transform: uppercase;">Poruka</p>
                <p style="margin: 0; color: #333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
              </div>
              
              <!-- Marketing Consent -->
              <p style="margin: 20px 0 0; padding: 10px; background-color: ${data.marketingConsent ? '#e8f5e9' : '#fff3e0'}; border-radius: 4px; font-size: 13px; color: #666;">
                Marketing obavijesti: <strong style="color: ${data.marketingConsent ? '#2e7d32' : '#f57c00'};">${data.marketingConsent ? 'DA - Pristao/la' : 'NE - Nije pristao/la'}</strong>
              </p>
              
              <!-- CTA Button -->
              ${data.adminPanelUrl ? `
              <div style="text-align: center; margin-top: 30px;">
                <a href="${data.adminPanelUrl}" style="display: inline-block; padding: 14px 30px; background-color: #1E4528; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                  Pogledaj u Admin Panelu
                </a>
              </div>
              ` : ''}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                Ova poruka je automatski poslana sa web stranice Toplik Village Resort.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Send notification email for a new form submission
 */
export const sendSubmissionNotification = async (
  data: SubmissionEmailData,
  notificationEmail: string,
  senderEmail: string = 'noreply@toplik.ba'
): Promise<{ success: boolean; error?: string }> => {
  const submissionTypeLabels: Record<string, string> = {
    contact: 'Kontakt poruka',
    reservation: 'Zahtjev za rezervaciju',
    inquiry: 'Upit',
  };

  return sendEmail({
    to: notificationEmail,
    subject: `[Toplik] ${submissionTypeLabels[data.submissionType] || 'Nova poruka'} od ${data.name}`,
    htmlContent: generateSubmissionEmailHTML(data),
    senderEmail,
    senderName: 'Toplik Village Resort',
  });
};

/**
 * Add a form submission contact to Brevo with marketing consent
 */
export const addSubmissionContact = async (
  email: string,
  name: string,
  phone?: string,
  listId?: number,
  marketingConsent: boolean = false
): Promise<{ success: boolean; error?: string }> => {
  // Only add to list if they gave marketing consent
  const listIds = marketingConsent && listId ? [listId] : [];

  // Split name into first and last name
  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return addContact({
    email,
    firstName,
    lastName,
    phone,
    listIds,
    attributes: {
      MARKETING_CONSENT: marketingConsent,
      SOURCE: 'website_form',
    },
  });
};

