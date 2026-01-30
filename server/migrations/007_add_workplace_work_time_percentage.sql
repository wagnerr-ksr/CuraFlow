-- Migration: Add work_time_percentage field to Workplace table
-- Created: 2026-01-30
-- Feature: Arbeitszeit-Prozentsatz für Dienste (z.B. Rufbereitschaft = 70%)

-- Add work_time_percentage field (defaults to 100 for full work time)
-- Allows decimal values like 70.5 for 70.5%
ALTER TABLE Workplace 
ADD COLUMN IF NOT EXISTS work_time_percentage DECIMAL(5,2) DEFAULT 100.00;

-- Add comment for documentation
COMMENT ON COLUMN Workplace.work_time_percentage IS 'Prozentsatz der Arbeitszeit, die dieser Arbeitsplatz/Dienst repräsentiert (z.B. 70 für Rufbereitschaft)';
