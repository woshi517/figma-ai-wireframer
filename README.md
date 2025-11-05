# Figma AI Wireframer

A standalone Figma plugin that generates wireframes from natural language descriptions using AI. Users control their own OpenRouter API keys directly in the plugin, with no backend required.

## Features

- 🎨 **Natural Language Input**: Describe UIs in plain English
- 🔑 **User-Controlled API Keys**: Store your own OpenRouter API key securely
- 🧩 **Design System Integration**: Uses your existing Figma components
- ⚡ **Standalone**: No backend server required - everything runs in the plugin
- 🛡️ **Secure**: API keys encrypted locally, never leave your device
- 📊 **Usage Tracking**: Monitor API usage and costs
- 🤖 **Multiple Models**: Choose from various AI models (Claude, GPT-4, Gemini, etc.)

## Architecture

```
┌─────────────────┐    Direct API    ┌─────────────────┐
│   Figma Plugin  │ ─────────────► │   OpenRouter    │
│                 │                │                 │
│ • UI Modal      │                │ • Claude 3.5    │
│ • API Key Mgmt  │                │ • GPT-4         │
│ • Component     │                │ • Gemini        │
│   Mapping       │                │ • Llama 3       │
│ • Rendering     │                │                 │
│ • Usage Stats   │                │                 │
└─────────────────┘                └─────────────────┘
```

## Quick Start

### 1. Get OpenRouter API Key

1. Sign up at [OpenRouter.ai](https://openrouter.ai)
2. Get your API key (starts with `sk-or-`)
3. Note your key - you'll need it for the plugin

### 2. Setup Plugin

```bash
# Install dependencies
cd plugin
npm install

# Build plugin
npm run build

# Or watch for changes during development
npm run dev
```

### 3. Install in Figma

1. Open Figma Desktop app
2. Go to Plugins → Development → Import plugin from manifest...
3. Select `plugin/manifest.json`
4. Open the plugin from the plugins menu

### 4. Configure Plugin

1. Open the plugin and go to **Settings** tab
2. **API Configuration**:
   - Enter your OpenRouter API key
   - Choose your preferred AI model
   - Click "Test Connection" to verify
   - Click "Save API Settings"
3. **Component Mapping**:
   - Enter your Figma component keys for each design system element
   - Click "Save Mapping"

## Usage

1. Open the plugin in Figma
2. **Configure Settings** (first time only):
   - Enter your OpenRouter API key
   - Choose AI model
   - Test connection
   - Save settings
3. **Generate Wireframes**:
   - Go to **Generate** tab
   - Describe the UI you want: *"a login screen with email, password, and a sign-in button"*
   - Click "Generate Wireframe"
4. The AI will create a structured wireframe using your components
5. Results appear directly in your Figma canvas

## Component Mapping

The plugin uses these standard component names:

- `Button/Primary` - Primary action buttons
- `Button/Secondary` - Secondary action buttons  
- `Input/Default` - Text input fields
- `Input/Password` - Password input fields
- `Text/Heading` - Heading text elements
- `Text/Body` - Body text elements
- `Container/Card` - Card containers
- `Container/Section` - Section containers

**How to get component keys:**
1. In Figma, select a component from your library
2. Right-click → Copy → Copy as link
3. Extract the component key from the URL (the long alphanumeric string)
4. Enter these keys in the plugin's Settings tab

## Available AI Models

- **Claude 3.5 Sonnet** (Recommended) - Best balance of quality and speed
- **Claude 3 Haiku** - Fast and cost-effective
- **GPT-4** - High quality, more expensive
- **GPT-4 Turbo** - Faster GPT-4
- **Gemini Pro** - Google's model
- **Llama 3 70B** - Open source model

## Usage Statistics

The plugin tracks your API usage locally:
- **Total Requests**: Number of wireframes generated
- **Total Tokens**: AI tokens used
- **Estimated Cost**: Approximate cost based on model pricing

All data is stored locally and never leaves your Figma environment.

## Development

### Project Structure

```
/figma-ai-wireframer
├── /plugin              # Figma plugin (standalone)
│   ├── manifest.json    # Plugin configuration
│   ├── code.ts         # Main plugin logic
│   ├── ui.html         # Plugin UI
│   └── ui.ts           # UI logic
├── /shared             # Shared TypeScript types
│   └── types.ts        # Common interfaces
├── /server             # Legacy backend (no longer needed)
└── README.md
```

### Scripts

```bash
# Development
npm run dev:plugin    # Watch and build plugin

# Production
npm run build:plugin  # Build plugin for production
npm run build        # Build plugin
```

## Security & Privacy

- ✅ **Local Storage**: API keys stored encrypted in Figma client storage
- ✅ **No Backend**: No server required - everything runs locally
- ✅ **Direct API**: Plugin calls OpenRouter directly
- ✅ **Input Validation**: All inputs validated before API calls
- ✅ **Error Handling**: Secure error messages without key exposure

## API Key Security

Your OpenRouter API key is:
- Encrypted locally using XOR cipher
- Stored in Figma's secure client storage
- Never transmitted to any third-party servers
- Only sent directly to OpenRouter API

## Requirements

- OpenRouter API key
- Figma Desktop app (for plugin development)
- Published Figma component library (optional but recommended)

## Cost Estimation

Approximate costs per 1M tokens:
- Claude 3.5 Sonnet: $3.00
- Claude 3 Haiku: $0.25
- GPT-4: $30.00
- GPT-4 Turbo: $10.00
- Gemini Pro: $0.50
- Llama 3 70B: $1.00

Typical wireframe generation uses ~500-2000 tokens.

## License

MIT License - see LICENSE file for details.