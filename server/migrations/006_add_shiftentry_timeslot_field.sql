-- Migration: Add timeslot_id field to ShiftEntry table
-- Created: 2026-01-30
-- Feature: Zeitfenster-Besetzung (Timeslots) für Arbeitsplätze

-- Add timeslot_id field (NULL means full-day shift for backward compatibility)
ALTER TABLE ShiftEntry 
ADD COLUMN IF NOT EXISTS timeslot_id VARCHAR(255) DEFAULT NULL;

-- Index for performance when querying by timeslot
CREATE INDEX IF NOT EXISTS idx_shiftentry_timeslot ON ShiftEntry(timeslot_id);
