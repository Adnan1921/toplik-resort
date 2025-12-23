-- Create apartments table
CREATE TABLE IF NOT EXISTS public.apartments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- Vila, Apartman, Suite
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    breakfast TEXT NOT NULL,
    price TEXT,
    capacity TEXT,
    amenities JSONB DEFAULT '[]'::jsonb, -- Array of amenity strings
    is_published BOOLEAN DEFAULT true NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_apartments_slug ON public.apartments(slug);
CREATE INDEX IF NOT EXISTS idx_apartments_published ON public.apartments(is_published);
CREATE INDEX IF NOT EXISTS idx_apartments_order ON public.apartments(display_order);

-- Enable RLS
ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published apartments
CREATE POLICY "Allow public read access to published apartments"
    ON public.apartments
    FOR SELECT
    USING (is_published = true);

-- Allow authenticated users (admins) full access
CREATE POLICY "Allow authenticated users full access"
    ON public.apartments
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Insert initial data for existing apartments
INSERT INTO public.apartments (slug, type, name, description, check_in, check_out, breakfast, price, capacity, amenities, display_order) VALUES
('plavi-lotos', 'Vila', 'Plavi Lotos', 
 'Ova luksuzna, prostrana vila za odmor učiniće vaš boravak posebnim. Moderno osmišljen enterijer, sa velikim staklenim portalima, jacuzzijem, galerijom sa bračnim krevetom, ono je što će vas zasigurno osvojiti i olakšati vam izbor vaše savršene destinacije za odmor. Namijenjena je za boravak 2-4 osobe i sadrži galeriju sa velikim bračnim krevetom i krevet na razvlačenje u dnevnom boravku. Terasa ispred vile sa velikim dvorištem idealna je za uživanje u jutarnjoj kafi.',
 '14:00h - 21:30h', '11:00h', '08.00h - 10.00 h',
 '160,00 EUR sa uključenim doručkom', '2 - 4 osobe',
 '["54 m²", "Klima + centralno grijanje", "Internet", "Mini bar", "Room Services", "Smart TV", "Jacuzzi", "Kamin", "Smart Home", "Recepcija 24/7", "Parking", "Rent a car"]'::jsonb,
 1),
 
('bijeli-jasmin', 'Apartman', 'Bijeli Jasmin',
 'Apartman Bijeli Jasmin pruža savršen spoj udobnosti i elegancije. Prostrani interijer sa toplim drvenim detaljima, udobnim bračnim krevetom i pogledom na okolnu prirodu čini ga idealnim izborom za romantični bijeg ili mirno opuštanje. Apartman je opremljen svim potrebnim sadržajima za ugodan boravak.',
 '14:00h - 21:30h', '11:00h', '08.00h - 10.00 h',
 '120,00 EUR sa uključenim doručkom', '2 osobe',
 '["40 m²", "Klima", "Internet", "Mini bar", "Room Services", "Smart TV", "Parking"]'::jsonb,
 2),

('crvena-magnolija', 'Vila', 'Crvena Magnolija',
 'Vila Crvena Magnolija nudi jedinstveno iskustvo boravka u prirodi. Sa prostornom dnevnom sobom, luksuznim kupatilom i privatnom terasom, ova vila je idealna za porodice ili grupe prijatelja. Elegantni dizajn i pažnja posvećena detaljima čine svaki trenutak posebnim.',
 '14:00h - 21:30h', '11:00h', '08.00h - 10.00 h',
 NULL, NULL,
 '[]'::jsonb,
 3),

('crna-orhideja', 'Apartman', 'Crna Orhideja',
 'Apartman Crna Orhideja kombinuje moderan dizajn sa toplinom doma. Prostrani interijer, udoban namještaj i pogled na okolnu prirodu čine ga savršenim mjestom za odmor. Apartman je idealan za parove koji traže mir i intimnost.',
 '14:00h - 21:30h', '11:00h', '08.00h - 10.00 h',
 NULL, NULL,
 '[]'::jsonb,
 4),

('zeleni-tulipan', 'Vila', 'Zeleni Tulipan',
 'Vila Zeleni Tulipan je savršen izbor za one koji cijene prostor i luksuz. Sa velikim dnevnim boravkom, potpuno opremljenom kuhinjom i prostranom spavaćom sobom, ova vila pruža sve što vam je potrebno za nezaboravan boravak. Terasa sa pogledom na vrt idealna je za opuštanje.',
 '14:00h - 21:30h', '11:00h', '08.00h - 10.00 h',
 NULL, NULL,
 '[]'::jsonb,
 5),

('zlatna-breza', 'Apartman', 'Zlatna Breza',
 'Apartman Zlatna Breza odiše toplinom i elegancijom. Prostrani interijer sa drvenim gredama na stropu, udobnim bračnim krevetom i modernim kupatilom pruža savršen ambijent za opuštanje. Veliki prozori donose prirodno svjetlo i pogled na okolnu prirodu.',
 '14:00h - 21:30h', '11:00h', '08.00h - 10.00 h',
 NULL, NULL,
 '[]'::jsonb,
 6),

('divlja-tresnja', 'Apartman', 'Divlja Trešnja',
 'Apartman Divlja Trešnja kombinuje rustikalni šarm sa modernim udobnostima. Ukrašen jedinstvenom cvjetnom dekoracijom, ovaj apartman nudi ugodan boravak sa pogledom na vrt. Idealan izbor za parove koji traže romantičan bijeg.',
 '14:00h - 21:30h', '11:00h', '08.00h - 10.00 h',
 NULL, NULL,
 '[]'::jsonb,
 7),

('vranac-apartman-1', 'Apartman', 'Apartman 1',
 'Prostrani apartman u potkrovlju Vile Vranac nudi savršen spoj rustikalnog šarma i modernog komfora. Sa udobnim krevetom, prostranim dnevnim boravkom sa kaučem i tradicionalnim kilimom, ovaj apartman je idealan za porodice ili grupe prijatelja.',
 '14:00h - 21:30h', '11:00h', '08.00h - 10.00 h',
 NULL, NULL,
 '[]'::jsonb,
 8),

('vranac-apartman-2', 'Apartman', 'Apartman 2',
 'Drugi apartman u Vili Vranac odlikuje se autentičnim ciglenim zidom i drvenim gredama koje stvaraju toplu, rustikalnu atmosferu. Opremljen udobnim krevetom i radnim stolom, pruža savršen ambijent za odmor.',
 '14:00h - 21:30h', '11:00h', '08.00h - 10.00 h',
 NULL, NULL,
 '[]'::jsonb,
 9),

('copper-suite', 'Suite', 'Copper Suite',
 'Copper Suite je elegantna soba smještena neposredno pored VIP salona restorana Toplik. Sa velikim bračnim krevetom, toplim drvenim detaljima i rustikalnim dekorativnim elementima, ova soba pruža savršen ambijent za kratki odmor ili poslovni put.',
 '14:00h - 21:30h', '11:00h', '08.00h - 10.00 h',
 NULL, NULL,
 '[]'::jsonb,
 10),

('golden-suite', 'Suite', 'Golden Suite',
 'Golden Suite kombinuje luksuz i udobnost u jedinstven prostor. Sa prostranom sobom, kamenim zidom, staklenom tuš kabinom i elegantnim drvenim namještajem, ova soba nudi nezaboravan boravak za 1-2 osobe.',
 '14:00h - 21:30h', '11:00h', '08.00h - 10.00 h',
 NULL, NULL,
 '[]'::jsonb,
 11);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_apartments_updated_at BEFORE UPDATE ON public.apartments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

