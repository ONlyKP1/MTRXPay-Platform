-- Migration: Update user roles from merchant to user
-- Date: 2026-03-13

-- Update existing merchant roles to user
UPDATE users SET role = 'user' WHERE role = 'merchant';

-- Update default value
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';
