> You are an expert full-stack developer specializing in Figma plugins, TypeScript, and AI integration.  
> Your goal is to build a **Figma plugin** that lets users describe a UI in natural language (e.g., “a login screen with email, password, and a sign-in button”), sends that request to a **secure Node.js/TypeScript backend**, which then uses **OpenRouter (BYOK)** to generate a structured wireframe spec. The plugin renders this spec in Figma using **predefined components from the user’s design system library**.  
>
> Follow Figma plugin best practices: async-safe, sandbox-compliant, and efficient.  
> The backend must **never expose the OpenRouter API key**—it runs separately and is called via HTTPS.  
> Use modern TypeScript (ESM), zod for validation, and clean, modular code.  
> Assume the user has a published Figma component library with known component keys (e.g., `Button/Primary`, `Input/Default`).  

---

### ✅ **Task List for AI Agent**

#### **I. Figma Plugin (Frontend) – `/plugin`**
1. **Initialize plugin structure**  
   - Create `/plugin/manifest.json` with name, id, and main entry `code.js`.
   - Create `/plugin/code.ts` (TypeScript source) and build to `code.js` via esbuild.

2. **Implement UI with Figma’s HTML/CSS modal**  
   - Show a simple modal with:  
     - Text input for user prompt  
     - “Generate” button  
     - Loading state  
     - Error display  

3. **Send request to backend**  
   - On “Generate”, POST to `https://your-deployed-backend.com/api/generate-wireframe`  
   - Payload: `{ prompt: string, userId?: string }`  
   - Handle network errors gracefully.

4. **Render wireframe from JSON spec**  
   - Accept a structured response like:
     ```ts
     interface WireframeSpec {
       type: "frame";
       width: number;
       height: number;
       children: Array<{
         type: "text" | "component";
         x: number; y: number;
         content?: string;
         componentName?: string; // e.g., "Input/Default"
         width?: number; height?: number;
       }>;
     }
     ```
   - Create a top-level frame.
   - For `"text"`: create `figma.createText()`, set position/content.
   - For `"component"`:  
     - Look up real Figma component key from a **local mapping** (stored in `figma.clientStorage`).  
     - Use `await figma.importComponentByKeyAsync(key)`  
     - Create instance and position it.

5. **Store & manage component mapping**  
   - Allow user to **configure mapping** once (e.g., via dev mode or settings UI):  
     ```ts
     // Example mapping
     const componentMap = {
       "Button/Primary": "ab12cd34ef56gh78ij90", // real Figma component key
       "Input/Default": "kl12mn34op56qr78st90"
     };
     ```
   - Save/load via `figma.clientStorage.setAsync("componentMap", map)`.

---

#### **II. Backend API (Node.js + TypeScript) – `/server`**
1. **Set up ESM TypeScript project**  
   - Use `package.json` with `"type": "module"`  
   - Dependencies: `express`, `zod`, `cors`, `dotenv`, `node-fetch`

2. **Create `/api/generate-wireframe` POST endpoint**  
   - Validate input with Zod: `{ prompt: string }`
   - Reject if prompt is empty or too long (>500 chars)

3. **Call OpenRouter securely**  
   - Use `fetch` to `https://openrouter.ai/api/v1/chat/completions`  
   - Headers:
     ```ts
     {
       'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
       'HTTP-Referer': 'https://yourdomain.com', // required
       'X-Title': 'Figma Wireframe Agent',
       'Content-Type': 'application/json'
     }
     ```
   - Model: `anthropic/claude-3.5-sonnet` (configurable via env)
   - System prompt: enforce JSON output + user design rules (see below)

4. **Inject user design preferences into prompt**  
   Example system context:
   > “You are a Figma expert. Generate ONLY a JSON object representing a wireframe. Use this design system:  
   > - Buttons must be instances of 'Button/Primary' or 'Button/Secondary'  
   > - Inputs must use 'Input/Default'  
   > - Spacing: 16px padding, 12px gap  
   > - Font: Inter, 14px body, 20px headings  
   > - Colors: primary=#3B82F6  
   > Output valid JSON matching the WireframeSpec interface. NO MARKDOWN.”

5. **Parse & sanitize LLM output**  
   - Extract JSON from response (handle ```json...``` wrappers)
   - Validate output against `WireframeSpec` schema using Zod
   - Return 500 if invalid

6. **Error handling & logging**  
   - Log OpenRouter errors (without leaking keys)
   - Return user-friendly messages

---

#### **III. Build & Deployment**
1. **Plugin build script**  
   - Use `esbuild` to compile `code.ts` → `code.js` (no node_modules)

2. **Backend deployment**  
   - Provide Dockerfile or Vercel/Render config  
   - Set required env vars: `OPENROUTER_API_KEY`, `PORT`

3. **Local dev setup**  
   - `npm run dev:plugin` → watches + builds plugin  
   - `npm run dev:server` → runs backend on `localhost:3001`

---

### 🧩 **Shared Types (Optional but Recommended)**
Create a shared `types.ts`:
```ts
// types.ts
export interface WireframeChild {
  type: "text" | "component";
  x: number;
  y: number;
  content?: string;
  componentName?: string;
  width?: number;
  height?: number;
}

export interface WireframeSpec {
  type: "frame";
  width: number;
  height: number;
  children: WireframeChild[];
}
```

---

### 📁 Suggested Project Structure
```
/figma-ai-wireframer
├── /plugin
│   ├── manifest.json
│   ├── code.ts
│   └── ui.html (optional for advanced UI)
├── /server
│   ├── server.ts
│   ├── types.ts
│   └── package.json
├── package.json (root, with workspaces or scripts)
└── README.md
```