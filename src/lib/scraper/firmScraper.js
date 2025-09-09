
const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../../config');

class HungarianLawFirmScraper {
    constructor(db) {
        this.db = db;
        this.baseUrl = config.scraper.baseUrl;
        this.totalPages = config.scraper.firmTotalPages;
        this.delay = config.scraper.delay;
        this.firms = [];
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    buildUrl(pageNumber) {
        return `${this.baseUrl}?name=pubsearcher&action=search&type=office&iroda_status=aktiv&p=${pageNumber}`;
    }

    extractFirmData($) {
        const firms = [];
        
        // Find all law firm entries in div.media containers
        $('div.media').each((index, element) => {
            const $el = $(element);
            const firm = {};
            
            // Extract firm name from h4.media-heading
            const $heading = $el.find('h4.media-heading');
            if ($heading.length > 0) {
                const headingText = $heading.text().trim();
                // Format: "FIRM NAME - TYPE"
                const nameMatch = headingText.match(/^([^-]+)/);
                if (nameMatch) {
                    firm.name = nameMatch[1].trim();
                }
                
                // Extract type
                const typeMatch = headingText.match(/-\s*(.+)$/);
                if (typeMatch) {
                    firm.type = typeMatch[1].trim();
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
                    
                    if (valueText && valueText !== 'NINCS ADAT' && valueText !== 'NINCS MEGADVA') {
                        switch (labelText.toUpperCase()) {
                            case 'NÉV':
                                if (!firm.name) firm.name = valueText;
                                break;
                            case 'RÖGZÍTŐ KAMARA':
                                firm.registeringChamber = valueText;
                                break;
                            case 'STÁTUSZ':
                                firm.status = valueText;
                                break;
                            case 'IRÁNYÍTÓSZÁM':
                                firm.postalCode = valueText;
                                break;
                            case 'HELYSÉG':
                                firm.city = valueText;
                                break;
                            case 'UTCA ÉS HSZ.':
                                firm.street = valueText;
                                break;
                            case 'TELEFON':
                                firm.phone = valueText;
                                break;
                            case 'E-MAIL':
                                firm.email = valueText;
                                break;
                            case 'ADÓSZÁM':
                                firm.taxNumber = valueText;
                                break;
                            case 'EÜSZTV. (CÉGKAPU) ELÉRHETŐSÉG':
                                firm.egovernmentId = valueText;
                                break;
                            case 'IRODAGONDNOK':
                                firm.officeManager = valueText;
                                break;
                            case 'TAGOK':
                                firm.members = valueText;
                                break;
                            case 'IRODAVEZETŐ':
                                firm.officeLeader = valueText;
                                break;
                            // Correspondence address fields
                            case 'KIÉRT. IRÁNYÍTÓSZÁM':
                                firm.corrPostalCode = valueText;
                                break;
                            case 'KIÉRT. HELYSÉG':
                                firm.corrCity = valueText;
                                break;
                            case 'KIÉRT. UTCA/HSZ.':
                                firm.corrStreet = valueText;
                                break;
                        }
                    }
                }
            });
            
            // Extract office leader information from fieldsets
            $el.find('fieldset').each((i, fieldset) => {
                const $fieldset = $(fieldset);
                const legend = $fieldset.find('legend').text().trim();
                
                if (legend === 'Irodavezető*') {
                    const leader = {};
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
                                        leader.name = valueText;
                                        break;
                                    case 'KAMARAI AZONOSÍTÓ SZÁM (KASZ)':
                                        leader.kasz = valueText;
                                        break;
                                }
                            }
                        }
                    });
                    if (Object.keys(leader).length > 0) {
                        firm.officeLeaderDetails = leader;
                    }
                }
            });
            
            // Create full address
            if (firm.postalCode && firm.city && firm.street) {
                firm.fullAddress = `${firm.postalCode} ${firm.city}, ${firm.street}`;
            }
            
            // Create correspondence address if available
            if (firm.corrPostalCode && firm.corrCity && firm.corrStreet) {
                firm.corrFullAddress = `${firm.corrPostalCode} ${firm.corrCity}, ${firm.corrStreet}`;
            }
            
            // Only add if we have at least a name
            if (firm.name) {
                firms.push(firm);
            }
        });

        return firms;
    }

    async scrapePage(pageNumber) {
        try {
            console.log(`Scraping law firm page ${pageNumber}/${this.totalPages}...`);
            const url = this.buildUrl(pageNumber);
            
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 30000
            });

            const $ = cheerio.load(response.data);
            const firms = this.extractFirmData($);
            
            console.log(`Found ${firms.length} law firms on page ${pageNumber}`);
            return firms;

        } catch (error) {
            console.error(`Error scraping page ${pageNumber}:`, error.message);
            return [];
        }
    }

    async saveFirms(firms) {
        for (const firm of firms) {
            const query = {
                text: `
                    INSERT INTO law_firms (name, type, status, registering_chamber, postal_code, city, street, full_address, corr_postal_code, corr_city, corr_street, corr_full_address, phone, email, tax_number, egovernment_id, office_manager, office_leader_name, office_leader_kasz, members)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
                    ON CONFLICT (name) DO UPDATE SET
                        type = EXCLUDED.type,
                        status = EXCLUDED.status,
                        registering_chamber = EXCLUDED.registering_chamber,
                        postal_code = EXCLUDED.postal_code,
                        city = EXCLUDED.city,
                        street = EXCLUDED.street,
                        full_address = EXCLUDED.full_address,
                        corr_postal_code = EXCLUDED.corr_postal_code,
                        corr_city = EXCLUDED.corr_city,
                        corr_street = EXCLUDED.corr_street,
                        corr_full_address = EXCLUDED.corr_full_address,
                        phone = EXCLUDED.phone,
                        email = EXCLUDED.email,
                        tax_number = EXCLUDED.tax_number,
                        egovernment_id = EXCLUDED.egovernment_id,
                        office_manager = EXCLUDED.office_manager,
                        office_leader_name = EXCLUDED.office_leader_name,
                        office_leader_kasz = EXCLUDED.office_leader_kasz,
                        members = EXCLUDED.members,
                        updated_at = CURRENT_TIMESTAMP;
                `,
                values: [
                    firm.name,
                    firm.type,
                    firm.status,
                    firm.registeringChamber,
                    firm.postalCode,
                    firm.city,
                    firm.street,
                    firm.fullAddress,
                    firm.corrPostalCode,
                    firm.corrCity,
                    firm.corrStreet,
                    firm.corrFullAddress,
                    firm.phone,
                    firm.email,
                    firm.taxNumber,
                    firm.egovernmentId,
                    firm.officeManager,
                    firm.officeLeaderDetails?.name,
                    firm.officeLeaderDetails?.kasz,
                    firm.members,
                ],
            };
            await this.db.query(query);
        }
        console.log(`Saved ${firms.length} firms to the database...`);
    }

    async scrapeAll() {
        console.log(`Starting to scrape ${this.totalPages} pages of law firms...`);
        
        for (let page = 1; page <= this.totalPages; page++) {
            const firms = await this.scrapePage(page);
            if (firms.length > 0) {
                await this.saveFirms(firms);
            }
            
            // Respectful delay between requests
            if (page < this.totalPages) {
                await this.sleep(this.delay);
            }
        }

        console.log(`\nLaw firm scraping completed!`);
    }
}

module.exports = HungarianLawFirmScraper;
