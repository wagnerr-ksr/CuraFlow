#!/usr/bin/env node
/**
 * Migration Script: Base44 → Railway
 * 
 * This script helps migrate your CuraFlow app from Base44 to Railway
 * by updating environment variables and API endpoints.
 */

import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n🚀 CuraFlow Migration: Base44 → Railway\n');
  console.log('This script will help you migrate your backend to Railway.\n');
  
  // Check if frontend is already on Railway
  const hasFrontend = await question('Is your frontend already deployed on Railway? (y/n): ');
  
  // Collect Railway configuration
  const config = {
    frontendUrl: hasFrontend.toLowerCase() === 'y' 
      ? await question('Enter your Railway frontend URL (e.g., https://curaflow.railway.app): ')
      : null,
    railwayUrl: await question('Enter your Railway backend URL (will be created, e.g., https://curaflow-api.railway.app): '),
    mysqlHost: await question('MySQL Host (from Railway): '),
    mysqlPort: await question('MySQL Port (default 3306): ') || '3306',
    mysqlUser: await question('MySQL User: '),
    mysqlPassword: await question('MySQL Password: '),
    mysqlDatabase: await question('MySQL Database: '),
    jwtSecret: await question('JWT Secret (leave empty to generate): ') || generateSecret()
  };
  
  console.log('\n📝 Configuration collected. Creating files...\n');
  
  // Create server .env file
  const serverEnv = `# Railway Server Environment
MYSQL_HOST=${config.mysqlHost}
MYSQL_PORT=${config.mysqlPort}
MYSQL_USER=${config.mysqlUser}
MYSQL_PASSWORD=${config.mysqlPassword}
MYSQL_DATABASE=${config.mysqlDatabase}

JWT_SECRET=${config.jwtSecret}

PORT=3000
NODE_ENV=production
`;
  
  await fs.writeFile('server/.env', serverEnv);
  console.log('✅ Created server/.env');
  
  // Create frontend .env file with Railway API URL
  let frontendMessage = '';
  if (!config.frontendUrl) {
    const frontendEnv = `# Railway Backend URL
VITE_API_URL=${config.railwayUrl}
VITE_USE_RAILWAY=true
`;
    
    await fs.writeFile('.env.local', frontendEnv);
    console.log('✅ Created .env.local for frontend');
    frontendMessage = '3. Add .env.local to your frontend deployment';
  } else {
    console.log('✅ Frontend already on Railway - set VITE_API_URL in Railway Dashboard');
    frontendMessage = `3. In Railway Frontend Service → Variables, set:
     VITE_API_URL=${config.railwayUrl}
     VITE_USE_RAILWAY=true`;
  }
  
  // Create deployment info file
  const deployInfo = {
    migratedAt: new Date().toISOString(),
    platform: 'railway',
    backendUrl: config.railwayUrl,
    database: {
      host: config.mysqlHost,
      port: config.mysqlPort,
      database: config.mysqlDatabase
    }
  };
  
  await fs.writeFile('server/deployment-info.json', JSON.stringify(deployInfo, null, 2));
  console.log('✅ Created deployment-info.json');
  
  console.log('\n✨ Migration setup complete!\n');
  console.log('Next steps:');
  console.log('1. cd server && npm install');
  console.log('2. Deploy backend to Railway: railway up');
  console.log(frontendMessage);
  console.log('4. Test connection: node server/scripts/test-connection.js');
  console.log('\nSee RAILWAY_DEPLOYMENT.md for detailed instructions.\n');
  
  rl.close();
}

function generateSecret() {
  return Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

main().catch(console.error);
