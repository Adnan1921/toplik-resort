# Featured Image Feature - Uputstvo

## 🎯 Šta je Featured Image?

Featured Image je glavna slika apartmana koja se prikazuje na:
- Listing stranici (`/apartmani`) - u karticama apartmana
- Hero banner sekciji na detaljnoj stranici apartmana
- Carousel-ima i preview-ima širom sajta
- Admin panelu kao thumbnail pored naziva apartmana

## ⚠️ VAŽNO: Prvo Pokrenite SQL Skriptu!

**Pre nego što pokušate postaviti featured image, MORATE pokrenuti SQL skriptu u Supabase!**

Ako dobijete grešku "Greška pri postavljanju featured slike", to znači da kolona `featured_image_url` još ne postoji u bazi.

## 🚀 Korak 1: Dodavanje Kolone u Supabase (OBAVEZNO!)

1. **Pristupite Supabase Dashboardu**:
   - Idite na [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Odaberite svoj projekat

2. **Otvorite SQL Editor**:
   - U lijevom navigacionom meniju, kliknite na "SQL Editor"

3. **Pokrenite SQL skriptu**:
   - Otvorite fajl `supabase-add-featured-image.sql` u root folderu projekta
   - Kopirajte cijeli sadržaj
   - Zalijepite u Supabase SQL Editor
   - Kliknite "Run" (ili Ctrl + Enter)

Ova skripta će dodati novu kolonu `featured_image_url` u `apartments` tabelu.

## 🎨 Korak 2: Postavljanje Featured Image u Admin Panelu

1. **Prijavite se u Admin Panel**:
   - Idite na `http://localhost:5001/admin/login`
   - Prijavite se sa admin kredencijalima

2. **Navigirajte do "Apartmani"**:
   - U lijevom sidebar-u, kliknite na "Apartmani"

3. **Uredite Apartman**:
   - Kliknite na ikonicu olovke (<Edit />) pored apartmana

4. **Upload Slike** (ako još niste):
   - U sekciji "Galerija Slika", uploadujte slike apartmana
   - Slike će biti automatski optimizovane

5. **Postavite Featured Image**:
   - Pređite mišem preko slike koju želite postaviti kao featured
   - Kliknite na ikonicu zvijezde (⭐)
   - Slika će dobiti žutu ivicu i "Featured" badge
   - Sačuvajte promjene

## 📋 Kako Radi Featured Image?

### U Admin Panelu:
- Featured slika ima **žutu ivicu** (border-yellow-400)
- Prikazuje se **"Featured" badge** sa zvijezdicom
- Prikazuje se kao **thumbnail** pored naziva apartmana u listi

### Na Frontendu:
- Koristi se kao **hero background** na detaljnoj stranici apartmana
- Prikazuje se u **karticama** na listing stranici
- Prikazuje se u **carousel-ima** za apartmane

### Fallback Logika:
Ako apartman nema featured image, sistem će koristiti:
1. Prvu sliku iz R2 galerije (ako postoji)
2. Hardcoded sliku iz assets foldera (legacy fallback)

## 🔄 Promjena Featured Image

Da promijenite featured image:
1. Otvorite apartman za uređivanje
2. Kliknite na zvijezdicu na novoj slici
3. Stara featured slika će automatski biti zamjenjena
4. Sačuvajte promjene

## 🗑️ Brisanje Featured Image

Ako obrišete featured sliku:
- Sistem će automatski koristiti fallback logiku
- Preporučuje se da uvijek postavite novu featured sliku prije brisanja stare

## ⚠️ Najbolje Prakse

1. **Kvalitet Slike**:
   - Koristite high-quality slike (minimum 1920x1080px)
   - Sistem će automatski optimizovati sliku

2. **Izbor Slike**:
   - Odaberite sliku koja najbolje predstavlja apartman
   - Idealno: vanjski pogled ili glavna prostorija

3. **Konzistentnost**:
   - Postavite featured image za SVE apartmane
   - Ovo osigurava konzistentan izgled na sajtu

## 🐛 Troubleshooting

**Problem**: "Greška pri postavljanju featured slike"
- **Uzrok**: SQL skripta nije pokrenuta - kolona `featured_image_url` ne postoji u bazi
- **Rješenje**: 
  1. Idite na Supabase Dashboard → SQL Editor
  2. Kopirajte sadržaj iz `supabase-add-featured-image.sql`
  3. Zalijepite i kliknite "Run"
  4. Osvježite stranicu i pokušajte ponovo

**Problem**: Featured image se ne prikazuje na frontendu
- **Rješenje**: Provjerite da li je `featured_image_url` ispravno postavljen u bazi
- Hard refresh (Ctrl+Shift+R) ili Incognito mode

**Problem**: Ne mogu postaviti featured image
- **Rješenje**: Prvo sačuvajte apartman, pa tek onda uploadujte slike

**Problem**: Featured image je loš kvalitet
- **Rješenje**: Uploadujte veću sliku (minimum 1920x1080px)

**Problem**: "column featured_image_url does not exist"
- **Uzrok**: Ista kao prva greška - SQL skripta nije pokrenuta
- **Rješenje**: Pokrenite SQL skriptu kao što je opisano gore

---

Sada imate potpunu kontrolu nad glavnim slikama apartmana! 🎉

