const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

const CMS_URL = 'https://mouhajer-cms-omega.vercel.app';
const UPLOAD_ENDPOINT = `${CMS_URL}/api/media/upload`;
const TEST_IMAGE = path.join(__dirname, 'public', 'images', '0.webp');

async function testUpload() {
  console.log('🧪 Testing single file upload...\n');
  console.log(`📡 Endpoint: ${UPLOAD_ENDPOINT}`);
  console.log(`📁 File: ${TEST_IMAGE}\n`);

  const sessionCookie = process.env.SESSION_COOKIE;
  console.log(`🔐 Session Cookie: ${sessionCookie ? 'Provided ✓' : 'Missing ✗'}\n`);

  const formData = new FormData();
  const fileStream = fs.createReadStream(TEST_IMAGE);

  formData.append('file', fileStream, {
    filename: '0.webp',
    contentType: 'image/webp',
  });

  try {
    const headers = {
      ...formData.getHeaders(),
    };

    if (sessionCookie) {
      headers['Cookie'] = sessionCookie;
    }

    console.log('📤 Uploading...\n');
    console.log('Headers:', JSON.stringify(headers, null, 2), '\n');

    const response = await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers,
    });

    console.log(`📊 Response Status: ${response.status} ${response.statusText}\n`);

    const responseText = await response.text();
    console.log('Response Body:', responseText, '\n');

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.log('⚠️  Response is not JSON');
      return;
    }

    if (!response.ok) {
      console.log('❌ Upload Failed!');
      console.log('Error:', data.error || data);
    } else {
      console.log('✅ Upload Successful!');
      console.log('Data:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log('❌ Request Failed!');
    console.log('Error:', error.message);
    console.log('Stack:', error.stack);
  }
}

testUpload();
