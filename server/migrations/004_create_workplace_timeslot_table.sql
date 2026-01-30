-- Migration: Create WorkplaceTimeslot table for timeslot-based scheduling
-- Created: 2026-01-30
-- Feature: Zeitfenster-Besetzung (Timeslots) für Arbeitsplätze

CREATE TABLE IF NOT EXISTS WorkplaceTimeslot (
    id VARCHAR(255) PRIMARY KEY,
    workplace_id VARCHAR(255) NOT NULL,
    label VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    `order` INT DEFAULT 0,
    overlap_tolerance_minutes INT DEFAULT 0,
    spans_midnight BOOLEAN DEFAULT FALSE,
    created_date DATETIME(3),
    updated_date DATETIME(3),
    created_by VARCHAR(255),
    
    INDEX idx_timeslot_workplace (workplace_id)
);

-- Note: Foreign key constraint is optional and might fail if Workplace table structure differs
-- If you need referential integrity, uncomment the following:
-- ALTER TABLE WorkplaceTimeslot 
--     ADD CONSTRAINT fk_timeslot_workplace 
--     FOREIGN KEY (workplace_id) REFERENCES Workplace(id) ON DELETE CASCADE;
