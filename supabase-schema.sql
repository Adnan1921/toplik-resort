-- Supabase Database Schema for Toplik Village Resort Admin
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- TABLES
-- ============================================

-- Contact Form Submissions
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  submission_type VARCHAR(50) DEFAULT 'contact', -- 'contact', 'reservation', 'inquiry'
  is_read BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservation Instructions
CREATE TABLE reservation_instructions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Content (Key-Value store for editable content)
CREATE TABLE site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  content_type VARCHAR(50) DEFAULT 'text', -- 'text', 'html', 'json'
  description VARCHAR(255), -- Admin helper text
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_is_read ON contact_submissions(is_read);
CREATE INDEX idx_reservation_instructions_sort_order ON reservation_instructions(sort_order);
CREATE INDEX idx_site_content_key ON site_content(key);

-- ============================================
-- TRIGGERS for updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservation_instructions_updated_at
  BEFORE UPDATE ON reservation_instructions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Contact Submissions: Anyone can insert, only authenticated users can read/update
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete submissions"
  ON contact_submissions FOR DELETE
  TO authenticated
  USING (true);

-- Reservation Instructions: Anyone can read active, authenticated can manage
CREATE POLICY "Anyone can view active instructions"
  ON reservation_instructions FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert instructions"
  ON reservation_instructions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update instructions"
  ON reservation_instructions FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete instructions"
  ON reservation_instructions FOR DELETE
  TO authenticated
  USING (true);

-- Site Content: Anyone can read, authenticated can manage
CREATE POLICY "Anyone can view site content"
  ON site_content FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert content"
  ON site_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update content"
  ON site_content FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete content"
  ON site_content FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default reservation instructions
INSERT INTO reservation_instructions (title, content, sort_order) VALUES
('Rezervacija', 'Rezervaciju možete izvršiti putem naše web stranice, emailom ili telefonski. Preporučujemo rezervaciju najmanje 7 dana unaprijed.', 1),
('Check-in', 'Check-in je moguć od 14:00 sati. Molimo vas da nas obavijestite o vremenu vašeg dolaska.', 2),
('Check-out', 'Check-out je do 11:00 sati. Kasni check-out je moguć uz prethodnu najavu i dodatnu naknadu.', 3),
('Plaćanje', 'Prihvatamo gotovinu i sve glavne kreditne kartice. Depozit od 30% je potreban za potvrdu rezervacije.', 4),
('Otkazivanje', 'Besplatno otkazivanje do 48 sati prije dolaska. U slučaju kasnog otkazivanja, naplaćuje se prva noć.', 5);

-- Insert default site content
INSERT INTO site_content (key, value, content_type, description) VALUES
('hero_title', 'Toplik Village Resort', 'text', 'Naslov na hero sekciji'),
('hero_subtitle', 'U harmoniji sa prirodom', 'text', 'Podnaslov na hero sekciji'),
('hero_description', 'Smješten u netaknutoj prirodi, svega nekoliko minuta vožnje od centra Sarajeva, Toplik Village Resort nalazi se na porodičnom imanju porodice Jovančić.', 'text', 'Opis na hero sekciji'),
('contact_email', 'info@toplik.ba', 'text', 'Kontakt email'),
('contact_phone', '+387 33 123 456', 'text', 'Kontakt telefon'),
('contact_address', 'Toplik bb, Sarajevo, BiH', 'text', 'Adresa');












