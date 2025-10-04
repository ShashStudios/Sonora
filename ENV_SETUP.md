# Environment Variables Setup

Add these to your `.env.local` file:

```bash
# ElevenLabs API Key (for voice output)
ELEVENLABS_API_KEY=your_elevenlabs_key_here

# Azure OpenAI (for AI chat responses)
AZURE_OPENAI_API_KEY=your_azure_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini

# Clerk (already configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

## What You Need:
1. **ElevenLabs API Key** - Get from https://elevenlabs.io/app/settings/api-keys
2. **Azure OpenAI** - Your Azure OpenAI resource credentials
