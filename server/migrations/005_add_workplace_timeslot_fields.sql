-- Migration: Add timeslot-related fields to Workplace table
-- Created: 2026-01-30
-- Feature: Zeitfenster-Besetzung (Timeslots) für Arbeitsplätze

-- Add timeslots_enabled field (defaults to FALSE for backward compatibility)
ALTER TABLE Workplace 
ADD COLUMN IF NOT EXISTS timeslots_enabled BOOLEAN DEFAULT FALSE;

-- Add default overlap tolerance setting per workplace
ALTER TABLE Workplace 
ADD COLUMN IF NOT EXISTS default_overlap_tolerance_minutes INT DEFAULT 15;
