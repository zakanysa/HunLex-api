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

#### Ügyvédek

- `GET /api/lawyers` - Összes ügyvéd lekérése
- `GET /api/lawyers/:kasz` - Ügyvéd lekérése KASZ szám alapján

#### Ügyvédi irodák

- `GET /api/firms` - Összes ügyvédi iroda lekérése
- `GET /api/firms/:id` - Ügyvédi iroda lekérése ID alapján

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

#### Lawyers

- `GET /api/lawyers` - Get all lawyers
- `GET /api/lawyers/:kasz` - Get lawyer by KASZ number

#### Law Firms

- `GET /api/firms` - Get all law firms  
- `GET /api/firms/:id` - Get law firm by ID

### Example Response

```json
{
  "kasz": "12345",
  "name": "Dr. Example Lawyer",
  "firm": "Example Law Firm",
  "address": "Budapest, Hungary"
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