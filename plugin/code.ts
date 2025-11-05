import { WireframeSpec, ComponentMap, GenerateRequest, GenerateResponse } from '../shared/types';

const uiHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Wireframer</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 16px;
      background: #f8f9fa;
      color: #1a1a1a;
    }
    
    .container {
      max-width: 100%;
    }
    
    h1 {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 16px 0;
      color: #1a1a1a;
    }
    
    .section {
      background: white;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      border: 1px solid #e1e4e8;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 12px 0;
      color: #1a1a1a;
    }
    
    textarea {
      width: 100%;
      min-height: 80px;
      padding: 8px 12px;
      border: 1px solid #d0d7de;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
      box-sizing: border-box;
    }
    
    textarea:focus {
      outline: none;
      border-color: #0969da;
      box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.1);
    }
    
    button {
      background: #1f883d;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      width: 100%;
      margin-top: 12px;
    }
    
    button:hover {
      background: #1a7f37;
    }
    
    button:disabled {
      background: #94d3a2;
      cursor: not-allowed;
    }
    
    .loading {
      display: none;
      text-align: center;
      padding: 16px;
      color: #656d76;
    }
    
    .loading.active {
      display: block;
    }
    
    .spinner {
      border: 2px solid #e1e4e8;
      border-top: 2px solid #0969da;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
      margin: 0 auto 8px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error {
      background: #ffebe9;
      border: 1px solid #fd8c73;
      color: #cf222e;
      padding: 12px;
      border-radius: 6px;
      font-size: 14px;
      margin-top: 12px;
      display: none;
    }
    
    .error.active {
      display: block;
    }
    
    .component-mapping {
      display: grid;
      gap: 8px;
    }
    
    .component-row {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 8px;
      align-items: center;
    }
    
    .component-label {
      font-size: 12px;
      color: #656d76;
    }
    
    .component-input {
      padding: 4px 8px;
      border: 1px solid #d0d7de;
      border-radius: 4px;
      font-size: 12px;
      font-family: monospace;
    }
    
    .component-input:focus {
      outline: none;
      border-color: #0969da;
    }
    
    .tabs {
      display: flex;
      border-bottom: 1px solid #d0d7de;
      margin-bottom: 16px;
    }
    
    .tab {
      padding: 8px 16px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      color: #656d76;
      cursor: pointer;
      font-size: 14px;
      margin: 0;
    }
    
    .tab.active {
      color: #1a1a1a;
      border-bottom-color: #fd8c73;
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>AI Wireframer</h1>
    
    <div class="tabs">
      <button class="tab active" onclick="switchTab('generate')">Generate</button>
      <button class="tab" onclick="switchTab('settings')">Settings</button>
    </div>
    
    <!-- Generate Tab -->
    <div id="generate-tab" class="tab-content active">
      <div class="section">
        <div class="section-title">Describe your UI</div>
        <textarea 
          id="prompt" 
          placeholder="e.g., 'a login screen with email, password, and a sign-in button'"
        ></textarea>
        <button id="generate-btn" onclick="generateWireframe()">
          Generate Wireframe
        </button>
        
        <div id="loading" class="loading">
          <div class="spinner"></div>
          <div>Generating wireframe...</div>
        </div>
        
        <div id="error" class="error"></div>
      </div>
    </div>
    
    <!-- Settings Tab -->
    <div id="settings-tab" class="tab-content">
      <div class="section">
        <div class="section-title">Component Mapping</div>
        <div class="component-mapping">
          <div class="component-row">
            <span class="component-label">Button/Primary</span>
            <input type="text" class="component-input" id="component-Button/Primary" placeholder="Component key">
          </div>
          <div class="component-row">
            <span class="component-label">Button/Secondary</span>
            <input type="text" class="component-input" id="component-Button/Secondary" placeholder="Component key">
          </div>
          <div class="component-row">
            <span class="component-label">Input/Default</span>
            <input type="text" class="component-input" id="component-Input/Default" placeholder="Component key">
          </div>
          <div class="component-row">
            <span class="component-label">Input/Password</span>
            <input type="text" class="component-input" id="component-Input/Password" placeholder="Component key">
          </div>
          <div class="component-row">
            <span class="component-label">Text/Heading</span>
            <input type="text" class="component-input" id="component-Text/Heading" placeholder="Component key">
          </div>
          <div class="component-row">
            <span class="component-label">Text/Body</span>
            <input type="text" class="component-input" id="component-Text/Body" placeholder="Component key">
          </div>
          <div class="component-row">
            <span class="component-label">Container/Card</span>
            <input type="text" class="component-input" id="component-Container/Card" placeholder="Component key">
          </div>
          <div class="component-row">
            <span class="component-label">Container/Section</span>
            <input type="text" class="component-input" id="component-Container/Section" placeholder="Component key">
          </div>
        </div>
        <button onclick="saveComponentMapping()">Save Mapping</button>
      </div>
    </div>
  </div>

  <script>
    "use strict";
    let isLoading = false;
    window.onload = () => {
      parent.postMessage({ pluginMessage: { type: "get-component-map" } }, "*");
    };
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      switch (msg.type) {
        case "loading":
          setLoading(msg.data);
          break;
        case "generate-complete":
          handleGenerateComplete(msg.data);
          break;
        case "component-map-loaded":
          loadComponentMapping(msg.data);
          break;
        case "error":
          showError(msg.data);
          break;
      }
    };
    function switchTab(tabName) {
      document.querySelectorAll(".tab").forEach((tab) => {
        tab.classList.remove("active");
      });
      document.querySelector("[onclick=\\"switchTab('" + tabName + "')\\"]")?.classList.add("active");
      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active");
      });
      document.getElementById(tabName + "-tab")?.classList.add("active");
    }
    function setLoading(loading) {
      isLoading = loading;
      const loadingEl = document.getElementById("loading");
      const generateBtn = document.getElementById("generate-btn");
      if (loading) {
        loadingEl?.classList.add("active");
        generateBtn.textContent = "Generating...";
        generateBtn.disabled = true;
      } else {
        loadingEl?.classList.remove("active");
        generateBtn.textContent = "Generate Wireframe";
        generateBtn.disabled = false;
      }
    }
    function generateWireframe() {
      if (isLoading)
        return;
      const prompt = document.getElementById("prompt").value.trim();
      if (!prompt) {
        showError("Please enter a description of the UI you want to generate.");
        return;
      }
      hideError();
      parent.postMessage({
        pluginMessage: {
          type: "generate",
          data: { prompt }
        }
      }, "*");
    }
    function handleGenerateComplete(wireframeSpec) {
      parent.postMessage({
        pluginMessage: {
          type: "render",
          data: wireframeSpec
        }
      }, "*");
    }
    function loadComponentMapping(componentMap) {
      Object.keys(componentMap).forEach((componentName) => {
        const input = document.getElementById("component-" + componentName);
        if (input) {
          input.value = componentMap[componentName] || "";
        }
      });
    }
    function saveComponentMapping() {
      const componentMap = {};
      document.querySelectorAll(".component-input").forEach((input) => {
        const element = input;
        const componentName = element.id.replace("component-", "");
        componentMap[componentName] = element.value.trim();
      });
      parent.postMessage({
        pluginMessage: {
          type: "save-component-map",
          data: componentMap
        }
      }, "*");
    }
    function showError(message) {
      const errorEl = document.getElementById("error");
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add("active");
      }
    }
    function hideError() {
      const errorEl = document.getElementById("error");
      if (errorEl) {
        errorEl.classList.remove("active");
      }
    }
  </script>
</body>
</html>`;

interface Message {
  type: 'generate' | 'render' | 'save-component-map' | 'get-component-map' | 'error';
  data?: any;
}

// Default component mapping - user can configure this
const DEFAULT_COMPONENT_MAP: ComponentMap = {
  "Button/Primary": "",
  "Button/Secondary": "",
  "Input/Default": "",
  "Input/Password": "",
  "Text/Heading": "",
  "Text/Body": "",
  "Container/Card": "",
  "Container/Section": ""
};

figma.showUI(uiHtml, { width: 400, height: 600 });

figma.ui.onmessage = async (msg: Message) => {
  try {
    switch (msg.type) {
      case 'generate':
        await handleGenerate(msg.data as GenerateRequest);
        break;
      
      case 'render':
        await handleRender(msg.data as WireframeSpec);
        break;
      
      case 'save-component-map':
        await handleSaveComponentMap(msg.data as ComponentMap);
        break;
      
      case 'get-component-map':
        await handleGetComponentMap();
        break;
      
      default:
        figma.notify('Unknown message type');
    }
  } catch (error) {
    console.error('Plugin error:', error);
    figma.ui.postMessage({ 
      type: 'error', 
      data: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

async function handleGenerate(request: GenerateRequest) {
  figma.ui.postMessage({ type: 'loading', data: true });
  
  try {
    const response = await fetch('https://your-deployed-backend.com/api/generate-wireframe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GenerateResponse = await response.json();
    
    if (result.success && result.data) {
      figma.ui.postMessage({ 
        type: 'generate-complete', 
        data: result.data 
      });
    } else {
      throw new Error(result.error || 'Failed to generate wireframe');
    }
  } catch (error) {
    throw new Error(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    figma.ui.postMessage({ type: 'loading', data: false });
  }
}

async function handleRender(spec: WireframeSpec) {
  // Create main frame
  const frame = figma.createFrame();
  frame.name = 'AI Generated Wireframe';
  frame.resize(spec.width, spec.height || 800);
  
  // Get component mapping
  const componentMap = await getComponentMap();
  
  // Render children
  for (const child of spec.children) {
    await renderChild(frame, child, componentMap);
  }
  
  // Add to page and select
  figma.currentPage.appendChild(frame);
  figma.currentPage.selection = [frame];
  figma.viewport.scrollAndZoomIntoView([frame]);
  
  figma.notify('Wireframe generated successfully!');
}

async function renderChild(parent: FrameNode, child: any, componentMap: ComponentMap) {
  switch (child.type) {
    case 'text':
      await renderText(parent, child);
      break;
    
    case 'component':
      await renderComponent(parent, child, componentMap);
      break;
  }
}

async function renderText(parent: FrameNode, child: any) {
  const textNode = figma.createText();
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  
  textNode.characters = child.content || '';
  textNode.x = child.x;
  textNode.y = child.y;
  
  if (child.width) textNode.resize(child.width, textNode.height);
  if (child.height) textNode.resize(textNode.width, child.height);
  
  parent.appendChild(textNode);
}

async function renderComponent(parent: FrameNode, child: any, componentMap: ComponentMap) {
  if (!child.componentName) {
    throw new Error('Component name is required');
  }
  
  const componentKey = componentMap[child.componentName];
  if (!componentKey) {
    // Create placeholder rectangle if component not found
    const rect = figma.createRectangle();
    rect.name = `Missing: ${child.componentName}`;
    rect.x = child.x;
    rect.y = child.y;
    rect.resize(child.width || 100, child.height || 40);
    rect.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    parent.appendChild(rect);
    return;
  }
  
  try {
    const component = await figma.importComponentByKeyAsync(componentKey);
    const instance = component.createInstance();
    instance.x = child.x;
    instance.y = child.y;
    
    if (child.width) instance.resize(child.width, instance.height);
    if (child.height) instance.resize(instance.width, child.height);
    
    parent.appendChild(instance);
  } catch (error) {
    // Fallback to placeholder if import fails
    const rect = figma.createRectangle();
    rect.name = `Error: ${child.componentName}`;
    rect.x = child.x;
    rect.y = child.y;
    rect.resize(child.width || 100, child.height || 40);
    rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.8, b: 0.8 } }];
    parent.appendChild(rect);
  }
}

async function handleSaveComponentMap(map: ComponentMap) {
  await figma.clientStorage.setAsync('componentMap', map);
  figma.notify('Component mapping saved!');
}

async function handleGetComponentMap() {
  const map = await getComponentMap();
  figma.ui.postMessage({ 
    type: 'component-map-loaded', 
    data: map 
  });
}

async function getComponentMap(): Promise<ComponentMap> {
  const saved = await figma.clientStorage.getAsync('componentMap');
  return saved || DEFAULT_COMPONENT_MAP;
}