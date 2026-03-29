-- Migration: Update user roles from user to merchant
-- Date: 2026-03-14

-- Update existing user roles to merchant
UPDATE users SET role = 'merchant' WHERE role = 'user';

-- Update default value
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'merchant';
