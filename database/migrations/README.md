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

## Creating New Migrations

Name format: `NNN_description.sql`

Example: `002_add_payments_table.sql`
