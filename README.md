# HunLex API

*Magyar verzió lent | English version below*

---

## 🇭🇺 Magyar verzió

### Áttekintés

A HunLex API magyar ügyvédek és ügyvédi irodák átfogó adatbázisához biztosít hozzáférést. Az API automatikusan frissíti az adatokat a Magyar Ügyvédi Kamara hivatalos nyilvántartásából.

### Funkciók

- **Ügyvédi adatok**: Ügyvédek információinak lekérése KASZ szám alapján
- **Ügyvédi irodák**: Ügyvédi irodák adatainak elérése
- **Automatikus frissítés**: A scraper folyamatosan frissíti az adatbázist
- **RESTful API**: Egyszerű HTTP végpontok JSON válaszokkal

### API végpontok

**Nyilvános API URL**: `https://hunlex-api.onrender.com`

#### Ügyvédek

- `GET https://hunlex-api.onrender.com/api/lawyers` - Összes ügyvéd lekérése
- `GET https://hunlex-api.onrender.com/api/lawyers/:kasz` - Ügyvéd lekérése KASZ szám alapján

#### Ügyvédi irodák

- `GET https://hunlex-api.onrender.com/api/firms` - Összes ügyvédi iroda lekérése
- `GET https://hunlex-api.onrender.com/api/firms/:id` - Ügyvédi iroda lekérése ID alapján

### Gyors kezdés

#### Előfeltételek

- Node.js 16+
- PostgreSQL adatbázis
- npm vagy yarn

#### Telepítés

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

### Adatforrás

Az adatok a Magyar Ügyvédi Kamara hivatalos nyilvántartásából származnak (`ouny.magyarugyvedikamara.hu`).

---

## 🇬🇧 English Version

### Overview

HunLex API provides comprehensive access to Hungarian lawyers and law firms data. The API automatically scrapes and maintains up-to-date information from the official Hungarian Bar Association registry.

### Features

- **Lawyer Data**: Access lawyer information by KASZ (bar registration) number
- **Law Firm Data**: Retrieve law firm details by ID
- **Automated Updates**: Continuous scraping ensures data freshness
- **RESTful API**: Simple HTTP endpoints with JSON responses

### API Endpoints

**Public API URL**: `https://hunlex-api.onrender.com`

#### Lawyers

- `GET https://hunlex-api.onrender.com/api/lawyers` - Get all lawyers
- `GET https://hunlex-api.onrender.com/api/lawyers/:kasz` - Get lawyer by KASZ number

#### Law Firms

- `GET https://hunlex-api.onrender.com/api/firms` - Get all law firms  
- `GET https://hunlex-api.onrender.com/api/firms/:id` - Get law firm by ID

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

### Quick Start

#### Prerequisites

- Node.js 16+
- PostgreSQL database
- npm or yarn

#### Installation

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

The application is deployed on Render.

## License

ISC