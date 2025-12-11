// Test Ollama Connection
const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://laptop-0bp8f5ud:11434';

async function testOllama() {
  console.log('🔍 Testing Ollama connection...\n');
  console.log(`URL: ${OLLAMA_URL}\n`);

  try {
    // Test 1: Health check
    console.log('1️⃣  Testing /api/tags endpoint...');
    const tagsResponse = await fetch(`${OLLAMA_URL}/api/tags`);

    if (!tagsResponse.ok) {
      throw new Error(`HTTP ${tagsResponse.status}: ${tagsResponse.statusText}`);
    }

    const tagsData = await tagsResponse.json();
    console.log('✅ Connected successfully!');
    console.log(`📦 Available models: ${tagsData.models?.length || 0}`);

    if (tagsData.models && tagsData.models.length > 0) {
      tagsData.models.forEach(model => {
        console.log(`   - ${model.name}`);
      });
    }

    // Test 2: Simple chat
    console.log('\n2️⃣  Testing chat endpoint...');
    const chatResponse = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        messages: [{ role: 'user', content: 'Say hello in one word' }],
        stream: false,
      }),
    });

    if (!chatResponse.ok) {
      throw new Error(`Chat failed: HTTP ${chatResponse.status}`);
    }

    const chatData = await chatResponse.json();
    console.log('✅ Chat working!');
    console.log(`💬 Response: "${chatData.message?.content || 'No response'}"`);

    console.log('\n✅ ALL TESTS PASSED! Ollama is ready for the chatbot.\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure Ollama is running (check system tray)');
    console.log('2. Restart Ollama: Right-click icon → Quit, then reopen');
    console.log('3. Check environment variables are set correctly');
    console.log(`4. Try: curl ${OLLAMA_URL}/api/tags\n`);
    process.exit(1);
  }
}

testOllama();
