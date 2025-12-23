-- Brevo Integration Database Updates
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- 1. Add marketing_consent column to contact_submissions
-- ============================================

ALTER TABLE contact_submissions 
ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT FALSE;

-- ============================================
-- 2. Add email settings to site_content
-- ============================================

INSERT INTO site_content (key, value, content_type, description) VALUES
('notification_email', 'adnan.biber2@gmail.com', 'text', 'Email na koji se šalju notifikacije o novim porukama'),
('notification_sender', 'noreply@toplik.ba', 'text', 'Email sa kojeg se šalju notifikacije'),
('brevo_list_id', '', 'text', 'ID Brevo liste za marketing kontakte (ostaviti prazno ako ne koristite)')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- Done! 
-- ============================================
-- After running this, you can configure email settings in the admin panel.







