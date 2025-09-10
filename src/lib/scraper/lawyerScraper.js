
const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../../config');

class HungarianLawyerScraper {
    constructor(db) {
        this.db = db;
        this.baseUrl = config.scraper.baseUrl;
        this.totalPages = config.scraper.lawyerTotalPages;
        this.delay = config.scraper.delay;
        this.lawyers = [];
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    buildUrl(pageNumber) {
        return `${this.baseUrl}?name=pubsearcher&action=search&type=ugyved&status=aktiv&p=${pageNumber}`;
    }

    extractLawyerData($) {
        const lawyers = [];
        
        // Find all lawyer entries in div.media containers
        $('div.media').each((index, element) => {
            const $el = $(element);
            const lawyer = {};
            
            // Extract name from h4.media-heading
            const $heading = $el.find('h4.media-heading');
            if ($heading.length > 0) {
                const headingText = $heading.text().trim();
                // Format: "NAME (KASZ) - ROLE"
                const nameMatch = headingText.match(/^([^(]+)/);
                if (nameMatch) {
                    lawyer.name = nameMatch[1].trim();
                }
                
                // Extract KASZ from heading
                const kaszMatch = headingText.match(/\((\d+)\)/);
                if (kaszMatch) {
                    lawyer.kasz = kaszMatch[1];
                }
                
                // Extract role
                const roleMatch = headingText.match(/-\s*(.+)$/);
                if (roleMatch) {
                    lawyer.role = roleMatch[1].trim();
                }
            }
            
            // Extract structured data from form groups
            $el.find('div.form-group').each((i, formGroup) => {
                const $group = $(formGroup);
                const $label = $group.find('label.control-label');
                const $value = $group.find('p.form-control-static');
                
                if ($label.length > 0 && $value.length > 0) {
                    const labelText = $label.text().trim().replace(/\s*\*\s*$/, ''); // Remove asterisk
                    const valueText = $value.text().trim();
                    
                    if (valueText && valueText !== 'NINCS ADAT') {
                        switch (labelText.toUpperCase()) {
                            case 'KAMARAI AZONOSÍTÓ SZÁM (KASZ)':
                                if (!lawyer.kasz) lawyer.kasz = valueText;
                                break;
                            case 'KAMARAI NÉV':
                                if (!lawyer.name) lawyer.name = valueText;
                                break;
                            case 'STÁTUSZ':
                                lawyer.status = valueText;
                                break;
                            case 'KAMARA':
                                lawyer.chamber = valueText;
                                break;
                            case 'E-MAIL':
                                lawyer.email = valueText;
                                break;
                            case 'NYELVTUDÁS':
                                lawyer.languages = valueText;
                                break;
                            case 'ÜGYVÉDI IGAZOLVÁNY':
                                lawyer.license = valueText;
                                break;
                            case 'JOGTERÜLET':
                                lawyer.practiceAreas = valueText;
                                break;
                            case 'KAMARAI TISZTSÉG':
                                lawyer.chamberPosition = valueText;
                                break;
                        }
                    }
                }
            });
            
            // Extract office information from fieldsets
            $el.find('fieldset').each((i, fieldset) => {
                const $fieldset = $(fieldset);
                const legend = $fieldset.find('legend').text().trim();
                
                if (legend === 'Iroda') {
                    const office = {};
                    $fieldset.find('div.form-group').each((j, formGroup) => {
                        const $group = $(formGroup);
                        const $label = $group.find('label.control-label');
                        const $value = $group.find('p.form-control-static');
                        
                        if ($label.length > 0 && $value.length > 0) {
                            const labelText = $label.text().trim().replace(/\s*\*\s*$/, '');
                            const valueText = $value.text().trim();
                            
                            if (valueText && valueText !== 'NINCS ADAT') {
                                switch (labelText.toUpperCase()) {
                                    case 'NEVE':
                                        office.name = valueText;
                                        break;
                                    case 'CÍME':
                                        office.address = valueText;
                                        break;
                                    case 'TELEFONSZÁMA':
                                        office.phone = valueText;
                                        break;
                                    case 'EÜSZTV. (CÉGKAPU) ELÉRHETŐSÉGE':
                                        office.egovernmentContact = valueText;
                                        break;
                                }
                            }
                        }
                    });
                    if (Object.keys(office).length > 0) {
                        lawyer.office = office;
                    }
                }
                
                if (legend === 'Helyettes ügyvéd') {
                    const substitute = {};
                    $fieldset.find('div.form-group').each((j, formGroup) => {
                        const $group = $(formGroup);
                        const $label = $group.find('label.control-label');
                        const $value = $group.find('p.form-control-static');
                        
                        if ($label.length > 0 && $value.length > 0) {
                            const labelText = $label.text().trim();
                            const valueText = $value.text().trim();
                            
                            if (valueText && valueText !== 'NINCS ADAT') {
                                switch (labelText.toUpperCase()) {
                                    case 'NÉV':
                                        substitute.name = valueText;
                                        break;
                                    case 'KAMARAI AZONOSÍTÓ SZÁM (KASZ)':
                                        substitute.kasz = valueText;
                                        break;
                                }
                            }
                        }
                    });
                    if (Object.keys(substitute).length > 0) {
                        lawyer.substitute = substitute;
                    }
                }
            });
            
            // Only add if we have at least a name or KASZ
            if (lawyer.name || lawyer.kasz) {
                lawyers.push(lawyer);
            }
        });

        return lawyers;
    }

    async scrapePage(pageNumber) {
        try {
            console.log(`Scraping page ${pageNumber}/${this.totalPages}...`);
            const url = this.buildUrl(pageNumber);
            
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 30000
            });

            const $ = cheerio.load(response.data);
            const lawyers = this.extractLawyerData($);
            
            console.log(`Found ${lawyers.length} lawyers on page ${pageNumber}`);
            return lawyers;

        } catch (error) {
            console.error(`Error scraping page ${pageNumber}:`, error.message);
            return [];
        }
    }

    async saveLawyers(lawyers) {
        for (const lawyer of lawyers) {
            if (lawyer.role === 'Egyéni ügyvéd') {
                const query = {
                    text: `
                        INSERT INTO individual_lawyers (kasz, name, status, chamber, email, languages, license, practice_areas, chamber_position, substitute_name, substitute_kasz)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                        ON CONFLICT (kasz) DO UPDATE SET
                            name = EXCLUDED.name,
                            status = EXCLUDED.status,
                            chamber = EXCLUDED.chamber,
                            email = EXCLUDED.email,
                            languages = EXCLUDED.languages,
                            license = EXCLUDED.license,
                            practice_areas = EXCLUDED.practice_areas,
                            chamber_position = EXCLUDED.chamber_position,
                            substitute_name = EXCLUDED.substitute_name,
                            substitute_kasz = EXCLUDED.substitute_kasz,
                            updated_at = CURRENT_TIMESTAMP;
                    `,
                    values: [
                        lawyer.kasz,
                        lawyer.name,
                        lawyer.status,
                        lawyer.chamber,
                        lawyer.email,
                        lawyer.languages,
                        lawyer.license,
                        lawyer.practiceAreas,
                        lawyer.chamberPosition,
                        lawyer.substitute?.name,
                        lawyer.substitute?.kasz,
                    ],
                };
                await this.db.query(query);
            } else {
                const firmResult = await this.db.query('SELECT id FROM law_firms WHERE name = $1', [lawyer.office?.name]);
                const firmId = firmResult.rows[0]?.id;

                const query = {
                    text: `
                        INSERT INTO firm_lawyers (kasz, name, status, chamber, email, languages, license, practice_areas, chamber_position, substitute_name, substitute_kasz, law_firm_id, office_name, office_address, office_phone)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                        ON CONFLICT (kasz) DO UPDATE SET
                            name = EXCLUDED.name,
                            status = EXCLUDED.status,
                            chamber = EXCLUDED.chamber,
                            email = EXCLUDED.email,
                            languages = EXCLUDED.languages,
                            license = EXCLUDED.license,
                            practice_areas = EXCLUDED.practice_areas,
                            chamber_position = EXCLUDED.chamber_position,
                            substitute_name = EXCLUDED.substitute_name,
                            substitute_kasz = EXCLUDED.substitute_kasz,
                            law_firm_id = EXCLUDED.law_firm_id,
                            office_name = EXCLUDED.office_name,
                            office_address = EXCLUDED.office_address,
                            office_phone = EXCLUDED.office_phone,
                            updated_at = CURRENT_TIMESTAMP;
                    `,
                    values: [
                        lawyer.kasz,
                        lawyer.name,
                        lawyer.status,
                        lawyer.chamber,
                        lawyer.email,
                        lawyer.languages,
                        lawyer.license,
                        lawyer.practiceAreas,
                        lawyer.chamberPosition,
                        lawyer.substitute?.name,
                        lawyer.substitute?.kasz,
                        firmId,
                        lawyer.office?.name,
                        lawyer.office?.address,
                        lawyer.office?.phone,
                    ],
                };
                await this.db.query(query);
            }
        }
        console.log(`Saved ${lawyers.length} lawyers to the database...`);
    }

    async scrapeAll() {
        console.log(`Starting to scrape ${this.totalPages} pages...`);
        
        for (let page = 1; page <= this.totalPages; page++) {
            const lawyers = await this.scrapePage(page);
            if (lawyers.length > 0) {
                await this.saveLawyers(lawyers);
            }
            
            // Respectful delay between requests
            if (page < this.totalPages) {
                await this.sleep(this.delay);
            }
        }
        
        console.log(`\nScraping completed!`);
    }
}

module.exports = HungarianLawyerScraper;
