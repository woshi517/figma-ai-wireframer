# Figma AI Wireframer

A standalone Figma plugin that generates wireframes from natural language descriptions using AI. Users control their own OpenRouter API keys directly in the plugin, with transparent pricing and usage tracking. **No backend server required** - everything runs locally in Figma.

## Features

- 🎨 **Natural Language Input**: Describe UIs in plain English
- 🔑 **User-Controlled API Keys**: Store your own OpenRouter API key securely
- 🧩 **Design System Integration**: Uses your existing Figma components
- ⚡ **Truly Standalone**: No backend server required - direct OpenRouter API calls
- 🛡️ **Secure**: API keys encrypted locally, never leave your device
- 📊 **Usage Tracking**: Monitor API usage, costs, and token consumption
- 🤖 **All OpenRouter Models**: Access to 20+ AI models (Claude, GPT-4, Gemini, Llama, etc.)
- 💰 **Cost Transparency**: Real-time cost calculation and budget tracking
- 🔄 **Live Development**: Hot-reload during development

## Architecture

```
┌─────────────────┐    Direct API  ┌─────────────────┐
│   Figma Plugin  │ ─────────────► │   OpenRouter    │
│   (Standalone)  │                │                 │
│ • UI Modal      │                │ • Claude 3.5    │
│ • API Key Mgmt  │                │ • GPT-4         │
│ • Model Select  │                │ • Gemini        │
│ • Component Map │                │ • Llama 3       │
│ • Wireframe Gen │                │ • +20 models    │
│ • Usage Stats   │                │                 │
└─────────────────┘                └─────────────────┘
```

## Quick Start

### Prerequisites

- **Figma Desktop App**: Download from [figma.com/downloads](https://figma.com/downloads)
- **OpenRouter API Key**: Get one at [openrouter.ai](https://openrouter.ai)
- **Node.js**: Version 16+ for development

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd figma-ai-wireframer

# Install dependencies
npm install

# Build the plugin
npm run build:plugin
```

**Note**: No backend server setup required! The plugin calls OpenRouter directly.

### 3. Install Plugin in Figma

1. **Open Figma Desktop App**
2. **Import Plugin**:
   - Go to `Plugins → Development → Import plugin from manifest...`
   - Navigate to your project: `plugin/manifest.json`
   - Click "Open" to import

3. **Verify Installation**:
   - Plugin appears in `Plugins → Development → AI Wireframer`
   - Also visible in `Plugins → Manage plugins → In development`

### 3. Configure Plugin

1. **Launch Plugin**: `Plugins → Development → AI Wireframer`

2. **API Configuration** (Settings Tab):
   - Enter your OpenRouter API key (starts with `sk-or-`)
   - Select AI model (Claude 3.5 Sonnet recommended)
   - Click "Test API Key" to verify connection
   - Toggle "Save API key locally" if desired

3. **Component Mapping** (Settings Tab):
   - Enter Figma component keys for your design system
   - Click "Save Mapping"

### 4. Generate Your First Wireframe

1. **Switch to Generate Tab**
2. **Enter Prompt**: *"a login screen with email, password, and sign-in button"*
3. **Click "Generate Wireframe"**
4. **View Results**: Wireframe appears on your Figma canvas

## Local Deployment Tutorial

### Development Setup

```bash
# Start development mode (auto-rebuild on changes)
npm run dev:plugin

# In another terminal, start server (optional for advanced features)
npm run dev:server
```

### Plugin Installation Steps

1. **Build Plugin**:
   ```bash
   cd plugin
   npm run build
   ```

2. **Install in Figma**:
   - Open Figma Desktop
   - `Plugins → Development → Import plugin from manifest...`
   - Select `plugin/manifest.json`

3. **Access Plugin**:
   - `Plugins → Development → AI Wireframer`
   - Or use keyboard shortcut if configured

### Configuration Walkthrough

#### API Key Setup
- Go to **Settings** tab
- Enter OpenRouter API key in "API Configuration" section
- Use 👁️ button to show/hide key
- Select preferred AI model from dropdown
- Click "Test API Key" to verify
- Check "Save API key locally" to persist settings

#### Component Library Setup
- Create components in Figma or use existing library
- Get component keys: Select component → Right-click → Copy → Copy as link
- Extract key from URL (long alphanumeric string)
- Enter keys in "Component Mapping" section:
  - `Button/Primary`: Primary action buttons
  - `Button/Secondary`: Secondary actions
  - `Input/Default`: Text inputs
  - `Input/Password`: Password fields
  - `Text/Heading`: Headings
  - `Text/Body`: Body text
  - `Container/Card`: Card containers
  - `Container/Section`: Section containers

### Testing the Plugin

#### Basic Functionality Test
1. Open plugin → Generate tab
2. Enter: *"simple contact form with name, email, message, and submit button"*
3. Click "Generate Wireframe"
4. Verify wireframe appears on canvas

#### Advanced Features Test
1. **Model Selection**: Try different AI models in Settings
2. **Usage Tracking**: Check Usage tab after generations
3. **Cost Monitoring**: View real-time cost calculations
4. **Component Mapping**: Test with real vs. placeholder components

### Development Workflow

#### Making Changes
1. Edit `plugin/code.ts` or `plugin/ui.html`
2. Run `npm run build:plugin` or use `npm run dev:plugin` for auto-rebuild
3. In Figma: Right-click plugin → "Reload plugin"
4. Test changes immediately

#### Debugging
- Check Figma console: `Plugins → Development → [Plugin] → Open console`
- Verify `code.js` exists in plugin directory
- Ensure network access to `openrouter.ai`
- Test API key validity in Settings tab

### Troubleshooting

#### Plugin Won't Load
- Verify `code.js` exists: `ls plugin/code.js`
- Check Figma Desktop is updated
- Try: `Plugins → Development → [Right-click plugin] → Reload plugin`
- Restart Figma Desktop

#### API Key Issues
- Verify key starts with `sk-or-`
- Check OpenRouter account has credits
- Test key in Settings → "Test API Key"
- Ensure no extra spaces in key field

#### Network Errors
- Plugin requires internet for OpenRouter API
- Check firewall/antivirus blocking connections
- Verify `manifest.json` has correct `networkAccess` domains

#### Component Not Found
- Verify component keys are correct format
- Ensure components are published in team library
- Check component names match exactly (case-sensitive)
- Test with placeholder components first

#### Performance Issues
- Large wireframes may take longer to generate
- Try simpler prompts for faster results
- Check token usage in Usage tab
- Consider switching to faster models (Claude Haiku)

## Usage Guide

### Basic Workflow

1. **Launch Plugin**: `Plugins → Development → AI Wireframer`

2. **First-Time Setup** (Settings Tab):
   - Enter OpenRouter API key
   - Select preferred AI model
   - Test API connection
   - Configure component mapping (optional)

3. **Generate Wireframes** (Generate Tab):
   - Enter natural language description
   - Example: *"a dashboard with navigation sidebar, main content area, and user profile dropdown"*
   - Click "Generate Wireframe"
   - Wireframe appears on Figma canvas

### Advanced Features

#### Model Selection
- **Claude 3.5 Sonnet**: Best quality/speed balance ($3/1M tokens)
- **Claude 3 Haiku**: Fast and cost-effective ($0.25/1M tokens)
- **GPT-4**: High quality, slower ($30/1M tokens)
- **GPT-4 Turbo**: Faster GPT-4 ($10/1M tokens)
- **Gemini Pro**: Google's model ($0.50/1M tokens)
- **Llama 3 70B**: Open source option ($1/1M tokens)

#### Usage Monitoring
- **Real-time Costs**: See costs as you generate
- **Token Tracking**: Monitor prompt/completion tokens
- **Daily Usage**: View usage patterns over time
- **Generation History**: Track all your wireframe creations

#### Component Integration
- **Design System Sync**: Use your existing Figma components
- **Automatic Layout**: AI generates proper spacing and alignment
- **Fallback Handling**: Graceful degradation for missing components
- **Custom Mapping**: Map any component names you prefer

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

The plugin dynamically loads **all available models** from OpenRouter, including:

### Popular Models
- **Claude 3.5 Sonnet** (⭐ Recommended) - Best balance of quality and speed
- **Claude 3 Haiku** - Fast and cost-effective prototyping
- **GPT-4** - High quality, more expensive
- **GPT-4 Turbo** - Faster GPT-4 for productivity
- **Gemini Pro** - Google's AI for variety
- **Llama 3 70B** - Open source alternative

### Model Selection Features
- **Dynamic Loading**: Automatically fetches latest models from OpenRouter
- **Real-time Pricing**: Shows current costs for each model
- **Smart Filtering**: Excludes vision/image models for wireframe generation
- **Cost Comparison**: Compare pricing across models
- **Usage Tracking**: Tracks costs per model used

### Choosing a Model
- **Quality Work**: Use Claude 3.5 Sonnet or GPT-4
- **Prototyping**: Use Claude 3 Haiku for speed
- **Budget**: Check pricing in the model dropdown
- **Experiment**: Try different models for different use cases

## Usage Statistics & Cost Tracking

### Real-Time Monitoring

The plugin provides comprehensive usage tracking:

- **📊 Live Dashboard**: View costs, tokens, and generations in real-time
- **💰 Cost Breakdown**: See prompt vs. completion token costs
- **📈 Daily Usage**: Track spending patterns over the last 30 days
- **🔄 Generation History**: View all your wireframe creations with timestamps

### Cost Transparency

- **Per-Generation Costs**: See exact cost for each wireframe
- **Model Pricing**: Real-time pricing for all available models
- **Budget Alerts**: Monitor spending against your limits
- **Export Data**: Access to raw usage data for analysis

### Privacy & Security

- **Local Storage**: All data stored in Figma's secure client storage
- **No External Tracking**: Usage data never leaves your device
- **User Control**: You own your API keys and usage data
- **Transparent Pricing**: No hidden fees or markup

### Example Usage Data

```
Total Cost: $2.47
Total Tokens: 45,231
Generations: 23
Average Cost: $0.11 per wireframe
Most Used Model: Claude 3.5 Sonnet
```

## Development

### Project Structure

```
/figma-ai-wireframer
├── /plugin              # Figma plugin (standalone - no backend needed)
│   ├── manifest.json    # Plugin configuration
│   ├── code.ts         # Main plugin logic (TypeScript)
│   ├── code.js         # Compiled plugin code
│   ├── ui.html         # Plugin UI (HTML/CSS/JS)
│   ├── ui.ts           # UI logic (TypeScript)
│   └── package.json    # Plugin dependencies
├── /server             # Optional backend (for advanced deployments)
│   ├── server.ts       # Express server
│   ├── routes/         # API endpoints
│   │   ├── generate-with-key.ts
│   │   ├── models.ts
│   │   ├── usage.ts
│   │   └── validate-key.ts
│   └── types.ts        # Server types
├── /shared             # Shared TypeScript interfaces
│   └── types.ts        # Common types
├── package.json        # Root workspace config
└── README.md
```

### Development Scripts

```bash
# Plugin Development (Primary)
npm run dev:plugin      # Watch and auto-build plugin
npm run build:plugin    # Build plugin for production

# Server Development (Optional - for advanced features)
npm run dev:server      # Start development server
npm run build:server    # Build server for production

# Full Build (Optional)
npm run build          # Build both plugin and server
```

**Note**: For basic plugin development, only `npm run dev:plugin` is needed. The server is optional for advanced deployments.

### Development Workflow

1. **Setup Development Environment**:
   ```bash
   npm install
   npm run dev:plugin    # Auto-rebuild on changes
   ```

2. **Make Changes**:
   - Edit `plugin/code.ts` for main logic
   - Edit `plugin/ui.html`/`ui.ts` for UI
   - Edit `shared/types.ts` for interfaces

3. **Test Changes**:
   - Plugin auto-rebuilds with `npm run dev:plugin`
   - Reload plugin in Figma: `Plugins → Development → [Right-click] → Reload plugin`
   - Check console: `Plugins → Development → [Plugin] → Open console`

4. **Debug Issues**:
   - Use Figma's developer console for client-side debugging
   - Check network requests in browser dev tools
   - Verify API key validity in plugin settings

### Adding New Features

#### New AI Models
1. Update model pricing in `plugin/code.ts` `handleGenerateWithKey`
2. Add model to UI dropdown in `plugin/ui.html`
3. Test with different model configurations

#### New UI Components
1. Add component name to `DEFAULT_COMPONENT_MAP` in `plugin/code.ts`
2. Update UI form in `plugin/ui.html`
3. Add rendering logic in `renderComponent` function

#### New API Endpoints
1. Create new route file in `server/routes/`
2. Add endpoint to `server/server.ts`
3. Update plugin code to call new endpoint
4. Add UI controls if needed

### Testing Strategy

- **Unit Tests**: Test individual functions and API calls
- **Integration Tests**: Test full plugin workflow
- **UI Tests**: Verify all tabs and interactions work
- **Error Handling**: Test edge cases and error scenarios
- **Performance**: Monitor memory usage and generation speed

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

### Essential
- **Figma Desktop App**: Version 116+ (download from [figma.com/downloads](https://figma.com/downloads))
- **OpenRouter API Key**: Free account at [openrouter.ai](https://openrouter.ai)
- **Internet Connection**: Required for AI API calls

### Recommended
- **Node.js**: Version 16+ (for development and building)
- **Figma Component Library**: Published design system for best results
- **Git**: For version control and collaboration

### System Requirements
- **macOS**: 10.15+ or **Windows**: 10+ or **Linux**: Ubuntu 18.04+
- **RAM**: 4GB+ recommended
- **Storage**: 100MB+ free space

## Cost Estimation & Pricing

### Model Pricing (per 1M tokens)

| Model | Prompt Cost | Completion Cost | Best For |
|-------|-------------|-----------------|----------|
| **Claude 3.5 Sonnet** | $3.00 | $15.00 | ⭐ **Recommended** - Best quality/speed balance |
| **Claude 3 Haiku** | $0.25 | $1.25 | ⚡ Fast, cost-effective prototyping |
| **GPT-4** | $30.00 | $60.00 | 🎯 High-quality, complex designs |
| **GPT-4 Turbo** | $10.00 | $30.00 | 🚀 Faster GPT-4 for productivity |
| **Gemini Pro** | $0.50 | $1.50 | 🤖 Google's AI for variety |
| **Llama 3 70B** | $1.00 | $1.00 | 🆓 Open-source alternative |

### Typical Usage Costs

- **Simple Wireframe**: 500-800 tokens = $0.02-$0.05
- **Complex Dashboard**: 1,500-2,500 tokens = $0.08-$0.15
- **Multi-screen Flow**: 3,000-5,000 tokens = $0.15-$0.30

### Cost Optimization Tips

1. **Start with Claude Haiku** for prototyping ($0.25/1M tokens)
2. **Use Claude 3.5 Sonnet** for production work ($3.00/1M tokens)
3. **Write Clear Prompts** - reduces token usage
4. **Iterate Incrementally** - generate simpler versions first
5. **Monitor Usage** - track costs in the Usage tab

### Free Tier Limits

Most models offer free credits for testing:
- **OpenRouter**: $1-5 free credits for new accounts
- **Anthropic**: Free tier available for Claude models
- **Google**: Free tier for Gemini models

### Billing & Payment

- **Pay-per-use**: Only pay for tokens you consume
- **No Subscription**: No monthly fees or minimums
- **Transparent Pricing**: Real-time cost tracking in plugin
- **Direct Billing**: Pay OpenRouter directly - no middleman fees

## Publishing & Deployment

### Local Development
- Use the plugin locally for personal use
- Develop and test in Figma Desktop
- No publishing required for local use

### Publishing to Figma Community
1. **Prepare Assets**:
   - Create plugin icon (128x128px PNG)
   - Write compelling description
   - Take screenshots of the plugin in action
   - Choose relevant tags

2. **Submit for Review**:
   - Go to Figma plugin management
   - Click "Submit for review"
   - Wait 1-2 weeks for approval
   - Plugin becomes available to all Figma users

3. **Post-Publication**:
   - Monitor usage analytics
   - Respond to user feedback
   - Release updates through Figma dashboard

### Backend Deployment (Optional)
The plugin works standalone, but you can deploy the backend for advanced features like user management or analytics:

```bash
# Using Vercel (recommended)
npm install -g vercel
cd server
vercel --prod

# Set environment variables:
# OPENROUTER_API_KEY=your-key-here
# SITE_URL=https://your-domain.vercel.app
```

### Enterprise Deployment
- **Self-hosted**: Deploy backend on your infrastructure
- **Custom Domain**: Use your company's domain
- **User Management**: Add authentication and user tracking
- **Analytics**: Integrate with your analytics platform
- **Team Features**: Shared usage tracking and billing

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Submit a pull request with detailed description

### Development Guidelines
- Follow TypeScript best practices
- Add JSDoc comments for new functions
- Test all new features locally
- Update README for any new features
- Ensure backward compatibility

## License

MIT License - see LICENSE file for details.