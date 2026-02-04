-- Migration: Add affects_availability field to Workplace table
-- Created: 2026-02-04
-- Feature: Konfigurierbar ob Einteilung an einem Arbeitsplatz die Verfügbarkeit beeinflusst
-- 
-- Beschreibung:
-- Pro Arbeitsplatz soll festlegbar sein, ob die Einteilung eines Mitarbeiters 
-- die Verfügbarkeit beeinträchtigt oder nicht. 
-- Default ist TRUE (Einteilung beeinflusst Verfügbarkeit).
-- Bei FALSE: Mitarbeiter bleibt weiterhin unter "Verfügbar" gelistet.
-- Konfliktprüfung erfolgt dann lediglich bezüglich Abwesenheiten.
--
-- Beispiel: "Demo Chirurgie" -> affects_availability = FALSE
-- Der Mitarbeiter kann dort eingeteilt werden, erscheint aber trotzdem als verfügbar.

-- Add affects_availability field (defaults to TRUE for backward compatibility)
ALTER TABLE Workplace 
ADD COLUMN IF NOT EXISTS affects_availability BOOLEAN DEFAULT TRUE;

