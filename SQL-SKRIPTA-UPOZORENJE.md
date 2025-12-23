# ⚠️ VAŽNO: SQL Skripta za Featured Image

## Dobili ste grešku "Greška pri postavljanju featured slike"?

To znači da **niste pokrenuli SQL skriptu** za dodavanje `featured_image_url` kolone u bazu podataka.

## 🔧 Kako Riješiti (5 minuta):

### 1. Otvorite Supabase Dashboard
- Idite na: https://supabase.com/dashboard
- Prijavite se
- Odaberite svoj projekat (`nviqalgzfatxtyqfzlhx`)

### 2. Otvorite SQL Editor
- U lijevom meniju kliknite na **"SQL Editor"**
- Kliknite na **"New query"**

### 3. Kopirajte i Pokrenite Skriptu

Kopirajte ovaj kod i zalijepite u SQL Editor:

```sql
-- Add featured_image_url column to apartments table
ALTER TABLE public.apartments 
ADD COLUMN IF NOT EXISTS featured_image_url TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN public.apartments.featured_image_url IS 'URL of the main/featured image for the apartment - used in listings, carousels, and previews';
```

### 4. Kliknite "Run" (ili Ctrl + Enter)

Trebali biste vidjeti poruku: **"Success. No rows returned"**

### 5. Osvježite Admin Panel

- Vratite se u admin panel
- Osvježite stranicu (F5)
- Pokušajte ponovo postaviti featured image

## ✅ Kako Znati da je Uspjelo?

Kada kliknete na zvijezdicu, trebali biste vidjeti:
- ✅ Toast poruku: "Featured slika postavljena!"
- 🟡 Žutu ivicu oko slike
- ⭐ "Featured" badge na slici

## 🆘 I Dalje Ne Radi?

Provjerite browser console (F12 → Console tab) i pošaljite screenshot greške.

---

**Napomena**: Ova skripta je **sigurna** - koristi `IF NOT EXISTS` što znači da neće napraviti problem ako kolona već postoji.

