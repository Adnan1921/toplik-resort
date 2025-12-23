# 🏠 Apartmani CMS - Uputstvo za Postavljanje

## 📋 Šta je novo?

Sada možeš **uređivati sve podatke o apartmanima** direktno iz admin panela - **SVE NA JEDNOM MJESTU**:
- ✅ Naziv apartmana
- ✅ Opis
- ✅ Tip (Vila / Apartman / Suite)
- ✅ Cijena
- ✅ Kapacitet
- ✅ Check-in / Check-out vrijeme
- ✅ Doručak vrijeme
- ✅ **Svi sadržaji (amenities)** - možeš dodavati/brisati/mijenjati
- ✅ Objavljivanje/sakrivanje apartmana
- ✅ **Galerija slika** - upload, brisanje i pregled slika direktno u istom dialogu!

## 🚀 Koraci za Postavljanje

### 1. Pokreni SQL Skriptu u Supabase

1. Otvori **Supabase Dashboard**: https://supabase.com/dashboard
2. Izaberi svoj projekat
3. Idi na **SQL Editor** (lijeva strana menija)
4. Kopiraj sadržaj fajla `supabase-apartments-schema.sql`
5. Zalijepi u SQL Editor
6. Klikni **Run** (ili pritisni `Ctrl + Enter`)

Ova skripta će:
- Kreirati `apartments` tabelu
- Dodati sve postojeće apartmane u bazu
- Postaviti RLS (Row Level Security) politike
- Omogućiti javni pristup objavljenim apartmanima

### 2. Provjeri da li je sve OK

Nakon što pokreneš skriptu, provjeri:

1. **Tabela kreirana?**
   - Idi na **Table Editor** u Supabase
   - Trebao bi vidjeti tabelu `apartments` sa 11 redova (apartmana)

2. **Podaci učitani?**
   - Otvori tabelu `apartments`
   - Trebao bi vidjeti sve apartmane (Plavi Lotos, Bijeli Jasmin, itd.)

### 3. Testiranje

1. **Pokreni aplikaciju** (ako već nije pokrenuta):
   ```bash
   npm run dev
   ```

2. **Logiraj se u admin panel**:
   - Idi na: http://localhost:5001/admin/login
   - Email: `adnan.biber2@gmail.com`
   - Password: tvoj password

3. **Otvori Apartmani stranicu**:
   - Klikni na **"Apartmani"** u lijevom meniju
   - Trebao bi vidjeti listu svih apartmana

4. **Testiraj uređivanje**:
   - Klikni **Edit** dugme na bilo kojem apartmanu
   - Promijeni neki podatak (npr. dodaj novi sadržaj)
   - Klikni **Sačuvaj**
   - Otvori frontend stranicu apartmana da vidiš promjene

## 🎨 Kako Koristiti Admin Panel

### Dodavanje Novog Apartmana

1. Klikni **"Dodaj apartman"** dugme
2. Popuni sva polja:
   - **Slug**: URL-friendly naziv (npr. `novi-apartman`)
   - **Tip**: Izaberi Vila / Apartman / Suite
   - **Naziv**: Puni naziv (npr. "Novi Apartman")
   - **Opis**: Detaljan opis apartmana
   - **Cijena**: Opciono (npr. "150,00 EUR sa uključenim doručkom")
   - **Kapacitet**: Opciono (npr. "2 - 4 osobe")
   - **Check-in**: Vrijeme dolaska
   - **Check-out**: Vrijeme odlaska
   - **Doručak**: Vrijeme doručka
   - **Sadržaji**: Jedan sadržaj po liniji (npr. "54 m²", "Klima", "Internet")
   - **Objavljen**: Uključi/isključi
3. Klikni **Sačuvaj**

### Uređivanje Postojećeg Apartmana

1. Pronađi apartman u listi
2. Klikni **Edit** (ikonica olovke)
3. Promijeni šta god želiš
4. Klikni **Sačuvaj**

### Dodavanje/Mijenjanje Sadržaja (Amenities)

U polju **"Sadržaji"**, unesi svaki sadržaj u **novi red**:

```
54 m²
Klima + centralno grijanje
Internet
Mini bar
Room Services
Smart TV
Jacuzzi
Kamin
Smart Home
Recepcija 24/7
Parking
Rent a car
```

**Napomena**: Možeš dodati bilo koji tekst - ikone će se automatski mapirati prema ključnim riječima.

### Sakrivanje Apartmana

Ako želiš privremeno sakriti apartman sa sajta:
1. Isključi **"Objavljen"** switch
2. Apartman će biti sakriven sa frontenda, ali će ostati u bazi

### Brisanje Apartmana

1. Klikni **Trash** ikonu (crvena)
2. Potvrdi brisanje
3. **Pažnja**: Ovo je trajno brisanje!

## 📸 Dodavanje Slika

Slike se dodaju **direktno u istom dialogu** gdje uređuješ apartman:

1. Klikni **Edit** na apartmanu koji želiš urediti
2. Skroluj do sekcije **"Galerija Slika"** (na dnu forme)
3. Klikni **"Upload Slike"** dugme
4. Izaberi jednu ili više slika (možeš izabrati više odjednom!)
5. Slike će se automatski uploadovati sa progress barom
6. Slike možeš:
   - **Kopirat URL** - klikni Copy dugme (pojavi se na hover)
   - **Obrisat** - klikni Trash dugme (pojavi se na hover)
7. Sve promjene su odmah vidljive na frontendu!

## 🔧 Tehnički Detalji

### Baza Podataka

**Tabela**: `apartments`

**Polja**:
- `id` - UUID (automatski)
- `slug` - Jedinstveni URL identifier
- `type` - Tip (Vila/Apartman/Suite)
- `name` - Naziv
- `description` - Opis
- `check_in` - Check-in vrijeme
- `check_out` - Check-out vrijeme
- `breakfast` - Doručak vrijeme
- `price` - Cijena (opciono)
- `capacity` - Kapacitet (opciono)
- `amenities` - JSON array sadržaja
- `is_published` - Da li je objavljen
- `display_order` - Redoslijed prikaza
- `created_at` - Datum kreiranja
- `updated_at` - Datum zadnje izmjene

### Frontend Integracija

`ApartmanDetails.tsx` sada:
1. Učitava podatke iz Supabase baze
2. Fallback na hardcoded podatke ako baza nije dostupna
3. Kombinuje podatke iz baze sa slikama iz R2

## 🐛 Troubleshooting

### Problem: "Nema apartmana" u admin panelu

**Rješenje**:
1. Provjeri da li si pokrenuo SQL skriptu
2. Provjeri Supabase Table Editor da li postoji tabela `apartments`
3. Provjeri browser console za greške

### Problem: Promjene se ne prikazuju na frontendu

**Rješenje**:
1. Hard refresh browser (Ctrl + Shift + R ili Cmd + Shift + R)
2. Provjeri da li je apartman **objavljen** (is_published = true)
3. Provjeri da li slug u bazi odgovara slug-u u URL-u

### Problem: Slike se ne prikazuju

**Rješenje**:
1. Provjeri da li su slike uploadovane u R2 (Admin → Galerija Slika)
2. Provjeri da li je naziv foldera u R2 isti kao slug apartmana
3. Provjeri browser console za CORS greške

## 📞 Podrška

Ako imaš bilo kakvih problema ili pitanja, kontaktiraj developera! 🚀

