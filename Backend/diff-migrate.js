const { execSync } = require('child_process');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const dbUrlMatch = envFile.match(/DATABASE_URL="?([^"\n]+)"?/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1] : null;

if (!dbUrl) {
    console.error('DATABASE_URL not found in .env');
    process.exit(1);
}

try {
    const dir = 'prisma/migrations/20260616132000_update_models';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    execSync(`npx prisma migrate diff --from-url "${dbUrl}" --to-schema-datamodel prisma/schema.prisma --script > ${dir}/migration.sql`, { stdio: 'inherit' });
    
    console.log('Migration SQL generated. Now deploying...');
    execSync(`npx prisma migrate deploy`, { stdio: 'inherit' });
    
    console.log('Done!');
} catch (e) {
    console.error(e);
}
