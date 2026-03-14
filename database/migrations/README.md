# Database Migrations

## Running Migrations

### Option 1: Supabase Dashboard
1. Go to your Supabase project
2. Open SQL Editor
3. Copy/paste each migration file in order
4. Run

### Option 2: Command Line
```bash
cd backend/api
npm run migrate
```

## Migration Files

Run in order:
1. `001_create_core_tables.sql` - Users, Merchants, Onboardings
2. `002_update_user_roles.sql` - User role updates
3. `003_update_roles_to_merchant.sql` - Set default role to merchant
4. `004_add_profiles_and_timestamps.sql` - Profiles table, updated_at columns

## Creating New Migrations

Name format: `NNN_description.sql`

Example: `002_add_payments_table.sql`
