#!/usr/bin/env node

const http = require('http');

function testConnection(port, name) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: port,
      path: '/',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      console.log(`✅ ${name} is running on port ${port}`);
      resolve(true);
    });

    req.on('error', () => {
      console.log(`❌ ${name} is NOT running on port ${port}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`⏰ ${name} connection timeout on port ${port}`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function main() {
  console.log('🔍 Testing server connections...\n');
  
  const cmsRunning = await testConnection(3010, 'CMS');
  const frontendRunning = await testConnection(3007, 'Frontend');
  
  console.log('\n📊 Summary:');
  console.log(`CMS (3010): ${cmsRunning ? '✅ Running' : '❌ Not running'}`);
  console.log(`Frontend (3007): ${frontendRunning ? '✅ Running' : '❌ Not running'}`);
  
  if (!cmsRunning || !frontendRunning) {
    console.log('\n🚀 To start servers:');
    console.log('npm run dev');
  }
}

main().catch(console.error);