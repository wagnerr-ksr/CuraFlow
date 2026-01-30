-- Migration: Add permission columns to TeamRole table
-- Date: 2026-01-30

-- Add permission columns for role-based service assignments
ALTER TABLE `TeamRole` 
ADD COLUMN IF NOT EXISTS `can_do_foreground_duty` BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS `can_do_background_duty` BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS `excluded_from_statistics` BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS `description` VARCHAR(255) DEFAULT NULL;

-- Update existing roles with appropriate permissions
-- Chefarzt: Kann Hintergrund, kein Vordergrund (normalerweise nicht in Dienste eingeteilt)
UPDATE `TeamRole` SET 
    `can_do_foreground_duty` = FALSE,
    `can_do_background_duty` = TRUE,
    `excluded_from_statistics` = FALSE,
    `description` = 'Oberste Führungsebene'
WHERE `name` = 'Chefarzt';

-- Oberarzt: Kann Hintergrund, kein Vordergrund
UPDATE `TeamRole` SET 
    `can_do_foreground_duty` = FALSE,
    `can_do_background_duty` = TRUE,
    `excluded_from_statistics` = FALSE,
    `description` = 'Kann Hintergrunddienste übernehmen'
WHERE `name` = 'Oberarzt';

-- Facharzt: Kann beides
UPDATE `TeamRole` SET 
    `can_do_foreground_duty` = TRUE,
    `can_do_background_duty` = TRUE,
    `excluded_from_statistics` = FALSE,
    `description` = 'Kann alle Dienste übernehmen'
WHERE `name` = 'Facharzt';

-- Assistenzarzt: Nur Vordergrund
UPDATE `TeamRole` SET 
    `can_do_foreground_duty` = TRUE,
    `can_do_background_duty` = FALSE,
    `excluded_from_statistics` = FALSE,
    `description` = 'Kann Vordergrunddienste übernehmen'
WHERE `name` = 'Assistenzarzt';

-- Nicht-Radiologe: Nichts, wird nicht gezählt
UPDATE `TeamRole` SET 
    `can_do_foreground_duty` = FALSE,
    `can_do_background_duty` = FALSE,
    `excluded_from_statistics` = TRUE,
    `description` = 'Wird in Statistiken nicht gezählt'
WHERE `name` = 'Nicht-Radiologe';
