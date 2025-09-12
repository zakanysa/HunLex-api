# HunLex API

*Magyar verzió lent | English version below*

---

## 🇭🇺 Magyar verzió

### Áttekintés

A HunLex API magyar ügyvédek és ügyvédi irodák átfogó adatbázisához biztosít hozzáférést. Az API automatikusan frissíti az adatokat a Magyar Ügyvédi Kamara hivatalos nyilvántartásából.

### Funkciók

- **Ügyvédi adatok**: Ügyvédek információinak lekérése KASZ szám alapján
- **Fejlett szűrési lehetőségek**: Ügyvédek szűrése gyakorlati terület, nyelv, név vagy kamara alapján
- **Ügyvédi irodák**: Ügyvédi irodák adatainak elérése
- **Automatikus frissítés**: A scraper naponta frissíti az adatbázist
- **RESTful API**: Egyszerű HTTP végpontok JSON válaszokkal

### API végpontok

**Nyilvános API URL**: `https://hunlex-api.onrender.com`

#### Ügyvédek

- `GET /api/lawyers` - Összes ügyvéd lekérése
- `GET /api/lawyers?practice_area=büntetőjog` - Ügyvédek szűrése gyakorlati terület alapján
- `GET /api/lawyers?language=angol` - Ügyvédek szűrése nyelv alapján
- `GET /api/lawyers?name=kovács` - Ügyvédek szűrése név alapján
- `GET /api/lawyers?chamber=budapesti` - Ügyvédek szűrése kamara alapján
- `GET /api/lawyers/:kasz` - Ügyvéd lekérése KASZ szám alapján

**Példa szűrési URL-ek:**
- `https://hunlex-api.onrender.com/api/lawyers?practice_area=adójog&language=német`
- `https://hunlex-api.onrender.com/api/lawyers?name=szabó&chamber=szegedi`

#### Ügyvédi irodák

- `GET /api/firms` - Összes ügyvédi iroda lekérése
- `GET /api/firms/:id` - Ügyvédi iroda lekérése ID alapján

### Használati lehetőségek

#### 1. opció: Nyilvános API használata (telepítés nem szükséges)

Az API már elérhető a `https://hunlex-api.onrender.com` címen. Azonnal használhatja:

```bash
# Összes ügyvéd lekérése
curl https://hunlex-api.onrender.com/api/lawyers

# Ügyvédek szűrése gyakorlati terület alapján
curl "https://hunlex-api.onrender.com/api/lawyers?practice_area=adójog"

# Konkrét ügyvéd lekérése KASZ szám alapján
curl https://hunlex-api.onrender.com/api/lawyers/12345678
```

#### 2. opció: Helyi futtatás

##### Előfeltételek

- Node.js 16+
- PostgreSQL adatbázis
- npm vagy yarn

##### Telepítés

1. Repository klónozása:
```bash
git clone <repository-url>
cd HunLex-API
```

2. Függőségek telepítése:
```bash
npm install
```

3. Környezeti változók beállítása:
```bash
cp .env.example .env
# Szerkessze a .env fájlt az adatbázis URL-lel és titkos kulccsal
```

4. Fejlesztői szerver indítása:
```bash
npm run dev
```

Az API elérhető lesz a `http://localhost:3000` címen.

**Helyi API használati példák:**
```bash
# Összes ügyvéd lekérése helyileg
curl http://localhost:3000/api/lawyers

# Ügyvédek szűrése nyelv alapján helyileg
curl "http://localhost:3000/api/lawyers?language=angol"
```

### Környezeti változók

Hozzon létre egy `.env` fájlt a következő változókkal:

```env
DATABASE_URL=postgresql://felhasznalonev:jelszo@localhost:5432/hunlex
SCRAPE_SECRET=titkos-kulcs
PORT=3000
```

### Fejlesztés

- `npm start` - Produkciós szerver indítása
- `npm run dev` - Fejlesztői szerver indítása hot reload-dal
- `npm run scrape` - Scraper manuális futtatása

### Automatikus adatfrissítés

Az API naponta automatikusan frissíti adatait éjfélkor (UTC) egy GitHub Actions workflow segítségével. A scraper a Magyar Ügyvédi Kamara nyilvántartásából gyűjti a legfrissebb információkat.

### Adatforrás

Az adatok a Magyar Ügyvédi Kamara hivatalos nyilvántartásából származnak (`ouny.magyarugyvedikamara.hu`).

---

## 🇬🇧 English Version

### Overview

HunLex API provides comprehensive access to Hungarian lawyers and law firms data. The API automatically scrapes and maintains up-to-date information from the official Hungarian Bar Association registry.

### Features

- **Lawyer Data**: Access lawyer information by KASZ (bar registration) number
- **Advanced Filtering**: Filter lawyers by practice area, language, name, or chamber
- **Law Firm Data**: Retrieve law firm details by ID
- **Automated Updates**: Daily scraping ensures data freshness
- **RESTful API**: Simple HTTP endpoints with JSON responses

### API Endpoints

**Public API URL**: `https://hunlex-api.onrender.com`

#### Lawyers

- `GET /api/lawyers` - Get all lawyers
- `GET /api/lawyers?practice_area=criminal` - Filter lawyers by practice area
- `GET /api/lawyers?language=english` - Filter lawyers by language
- `GET /api/lawyers?name=kovacs` - Filter lawyers by name
- `GET /api/lawyers?chamber=budapest` - Filter lawyers by chamber
- `GET /api/lawyers/:kasz` - Get lawyer by KASZ number

**Example filtering URLs:**
- `https://hunlex-api.onrender.com/api/lawyers?practice_area=tax&language=german`
- `https://hunlex-api.onrender.com/api/lawyers?name=szabo&chamber=szeged`

#### Law Firms

- `GET /api/firms` - Get all law firms  
- `GET /api/firms/:id` - Get law firm by ID

### Example Responses

#### Lawyer Response
```json
{
  "kasz": "36056385",
  "name": "ÁDÁM SÁNDOR",
  "status": "AKTÍV",
  "chamber": "SZEGEDI ÜGYVÉDI KAMARA",
  "email": "IRODA@ADAMSANDOR.HU",
  "practice_areas": ["BÜNTETŐJOG", "ADÓJOG"],
  "languages": ["ANGOL", "NÉMET"],
  "licenses": [
    {
      "number": "Ü-102560",
      "status": "ÉRVÉNYES"
    }
  ],
  "chamber_position": null,
  "substitute_name": null,
  "substitute_kasz": null,
  "lawyer_type": "firm",
  "office_name": "Ádám Sándor Ügyvédi Iroda",
  "created_at": "2025-09-10T19:40:01.375Z",
  "updated_at": "2025-09-11T11:34:59.028Z"
}
```

#### Law Firm Response
```json
{
  "id": 1,
  "name": "Example Ügyvédi Iroda",
  "type": "Ügyvédi Iroda",
  "status": "AKTÍV",
  "registering_chamber": "BUDAPESTI ÜGYVÉDI KAMARA",
  "members": ["DR. KOVÁCS PÉTER", "DR. NAGY ANNA"],
  "contact": {
    "phone": "+36 1 234 5678",
    "email": "info@example.hu",
    "tax_number": "12345678-2-41",
    "egovernment_id": "12345678"
  },
  "address": {
    "postal_code": "1052",
    "city": "Budapest",
    "street": "Váci utca 1.",
    "full_address": "1052 Budapest, Váci utca 1."
  },
  "correspondence_address": null,
  "office_manager": "Dr. Kovács Péter",
  "office_leader": {
    "name": "DR. KOVÁCS PÉTER",
    "kasz": "12345"
  },
  "created_at": "2025-09-11T10:15:30.123Z",
  "updated_at": "2025-09-11T10:15:30.123Z"
}
```

### Usage Options

#### Option 1: Use the Public API (No Setup Required)

The API is already deployed and available at `https://hunlex-api.onrender.com`. You can start using it immediately:

```bash
# Get all lawyers
curl https://hunlex-api.onrender.com/api/lawyers

# Filter lawyers by practice area
curl "https://hunlex-api.onrender.com/api/lawyers?practice_area=tax"

# Get a specific lawyer by KASZ number
curl https://hunlex-api.onrender.com/api/lawyers/12345678
```

#### Option 2: Run Locally

##### Prerequisites

- Node.js 16+
- PostgreSQL database
- npm or yarn

##### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd HunLex-API
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and scrape secret
```

4. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

**Local API Usage Examples:**
```bash
# Get all lawyers locally
curl http://localhost:3000/api/lawyers

# Filter lawyers by language locally
curl "http://localhost:3000/api/lawyers?language=english"
```

### Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/hunlex
SCRAPE_SECRET=your-secret-key-here
PORT=3000
```

### Development

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run scrape` - Manually run the scraper

### Database Schema

The API uses PostgreSQL with two main tables:

- `all_lawyers` - Lawyer information with KASZ numbers
- `law_firms` - Law firm data with numeric IDs

### Data Source

Data is scraped from the official Hungarian Bar Association registry at `ouny.magyarugyvedikamara.hu`.

### Deployment

The application is deployed on Render at `https://hunlex-api.onrender.com`.

### Automated Scraping

The API automatically updates its data daily at midnight UTC through a GitHub Actions workflow. The scraper collects the latest information from the Hungarian Bar Association registry to ensure data freshness.

## License

ISC