#!/usr/bin/env node

/**
 * Helper Script: Generate Secure Admin Password Hash
 * 
 * Usage:
 *   node scripts/generatePasswordHash.js your_password
 * 
 * This generates a bcrypt hash of your admin password
 * Copy the hash to your .env as ADMIN_PASSWORD
 * 
 * For maximum security:
 * 1. Generate a random password: openssl rand -base64 32
 * 2. Run this script: node scripts/generatePasswordHash.js <password>
 * 3. Copy the hash to .env as ADMIN_PASSWORD
 * 4. Update authController.js to use bcrypt.compare()
 */

import bcryptjs from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('❌ Please provide a password as argument');
  console.error('Usage: node generatePasswordHash.js "your_password"');
  process.exit(1);
}

if (password.length < 8) {
  console.error('❌ Password must be at least 8 characters');
  process.exit(1);
}

(async () => {
  try {
    const hash = await bcryptjs.hash(password, 10);
    
    console.log('\n✅ Password Hash Generated Successfully\n');
    console.log('Hashed Password:');
    console.log(hash);
    console.log('\n📝 Add this to your .env file:\n');
    console.log(`ADMIN_PASSWORD=${hash}`);
    console.log('\n💾 Make sure to commit .env to a secure vault (not git)\n');
  } catch (error) {
    console.error('❌ Error generating hash:', error.message);
    process.exit(1);
  }
})();
