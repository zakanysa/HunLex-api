-- HunLex API Database Schema
-- Run this on your Render PostgreSQL database

-- Individual lawyers table
CREATE TABLE IF NOT EXISTS individual_lawyers (
    id SERIAL PRIMARY KEY,
    kasz VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255),
    status VARCHAR(100),
    chamber VARCHAR(255),
    email VARCHAR(255),
    languages TEXT,
    license VARCHAR(255),
    practice_areas TEXT,
    chamber_position VARCHAR(255),
    substitute_name VARCHAR(255),
    substitute_kasz VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Firm lawyers table
CREATE TABLE IF NOT EXISTS firm_lawyers (
    id SERIAL PRIMARY KEY,
    kasz VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255),
    status VARCHAR(100),
    chamber VARCHAR(255),
    email VARCHAR(255),
    languages TEXT,
    license VARCHAR(255),
    practice_areas TEXT,
    chamber_position VARCHAR(255),
    substitute_name VARCHAR(255),
    substitute_kasz VARCHAR(50),
    law_firm_id INTEGER,
    office_name VARCHAR(255),
    office_address TEXT,
    office_phone VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Law firms table
CREATE TABLE IF NOT EXISTS law_firms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(100),
    status VARCHAR(100),
    registering_chamber VARCHAR(255),
    postal_code VARCHAR(20),
    city VARCHAR(255),
    street VARCHAR(255),
    full_address TEXT,
    corr_postal_code VARCHAR(20),
    corr_city VARCHAR(255),
    corr_street VARCHAR(255),
    corr_full_address TEXT,
    phone VARCHAR(100),
    email VARCHAR(255),
    tax_number VARCHAR(50),
    egovernment_id VARCHAR(100),
    office_manager VARCHAR(255),
    office_leader_name VARCHAR(255),
    office_leader_kasz VARCHAR(50),
    members TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Combined view for all lawyers (used by API)
CREATE OR REPLACE VIEW all_lawyers AS
SELECT 
    kasz,
    name,
    status,
    chamber,
    email,
    languages,
    license,
    practice_areas,
    chamber_position,
    substitute_name,
    substitute_kasz,
    'individual' as lawyer_type,
    null as office_name,
    null as office_address,
    null as office_phone,
    created_at,
    updated_at
FROM individual_lawyers
UNION ALL
SELECT 
    kasz,
    name,
    status,
    chamber,
    email,
    languages,
    license,
    practice_areas,
    chamber_position,
    substitute_name,
    substitute_kasz,
    'firm' as lawyer_type,
    office_name,
    office_address,
    office_phone,
    created_at,
    updated_at
FROM firm_lawyers;

-- Add foreign key constraint
ALTER TABLE firm_lawyers 
ADD CONSTRAINT fk_firm_lawyers_law_firm_id 
FOREIGN KEY (law_firm_id) REFERENCES law_firms(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_individual_lawyers_kasz ON individual_lawyers(kasz);
CREATE INDEX IF NOT EXISTS idx_firm_lawyers_kasz ON firm_lawyers(kasz);
CREATE INDEX IF NOT EXISTS idx_law_firms_name ON law_firms(name);
CREATE INDEX IF NOT EXISTS idx_firm_lawyers_law_firm_id ON firm_lawyers(law_firm_id);