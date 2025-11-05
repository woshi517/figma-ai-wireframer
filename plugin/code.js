"use strict";
(() => {
  // code.ts
  var uiHtml = `<!DOCTYPE html>
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
    
    /* Settings Styles */
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: #24292f;
    }
    
    .api-help {
      font-size: 12px;
      color: #656d76;
      margin-bottom: 8px;
    }
    
    .api-help a {
      color: #0969da;
      text-decoration: none;
    }
    
    .api-help a:hover {
      text-decoration: underline;
    }
    
    .api-key-group {
      display: flex;
      gap: 8px;
    }
    
    .api-key-group input {
      flex: 1;
    }
    
    .api-key-group button {
      margin: 0;
      width: auto;
      white-space: nowrap;
    }
    
    .key-status {
      margin-top: 6px;
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 4px;
    }
    
    .key-status.valid {
      background: #dcffe4;
      color: #1a7f37;
    }
    
    .key-status.invalid {
      background: #ffebe9;
      color: #cf222e;
    }
    
    .key-status.validating {
      background: #fff8c5;
      color: #d4a017;
    }
    
    .models-list {
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #d0d7de;
      border-radius: 6px;
      padding: 8px;
    }
    
    .model-item {
      padding: 8px;
      border-bottom: 1px solid #f6f8fa;
    }
    
    .model-item:last-child {
      border-bottom: none;
    }
    
    .model-name {
      font-weight: 500;
      color: #24292f;
    }
    
    .model-id {
      font-size: 12px;
      color: #656d76;
      margin-top: 2px;
    }
    
    .model-description {
      font-size: 11px;
      color: #6b7280;
      margin-top: 4px;
      line-height: 1.3;
    }
    
    .model-context {
      font-size: 10px;
      color: #9ca3af;
      margin-top: 2px;
    }
    
    .no-models {
      text-align: center;
      color: #656d76;
      padding: 16px;
    }
    
    select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d0d7de;
      border-radius: 6px;
      background: white;
      font-size: 14px;
    }
    
    select:focus {
      outline: none;
      border-color: #0969da;
      box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.1);
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
        <div class="section-title">OpenRouter Configuration</div>
        <div class="form-group">
          <label for="apiKey">API Key</label>
          <div class="api-help">
            Get your API key from <a href="https://openrouter.ai/keys" target="_blank">OpenRouter.ai/keys</a>
          </div>
          <div class="api-key-group">
            <input type="password" id="apiKey" placeholder="sk-or-v1-...">
            <button id="saveKey" class="btn btn-primary" onclick="saveApiKey()">Save Key</button>
          </div>
          <div id="keyStatus" class="key-status"></div>
        </div>
        
        <div class="form-group">
          <label>Available Models</label>
          <div id="modelsList" class="models-list">
            <div class="loading">Loading models...</div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="defaultModel">Default Model</label>
        <select id="defaultModel" onchange="saveDefaultModel()">
          <option value="">Select a model</option>
        </select>
        </div>
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
        case "settings-loaded":
          loadSettings(msg.data);
          break;
        case "api-key-saved":
          updateKeyStatus(msg.data);
          // Re-enable save button
          const saveBtn = document.getElementById("saveKey");
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = "Save Key";
          }
          break;
        case "models-loaded":
          displayModels(msg.data);
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
      var tabButton = document.querySelector("[onclick=\\"switchTab('" + tabName + "')\\]");
      if (tabButton) tabButton.classList.add("active");
      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active");
      });
      var tabContent = document.getElementById(tabName + "-tab");
      if (tabContent) tabContent.classList.add("active");
    }
    function setLoading(loading) {
      isLoading = loading;
      var loadingEl = document.getElementById("loading");
      var generateBtn = document.getElementById("generate-btn");
      if (loading) {
        if (loadingEl) loadingEl.classList.add("active");
        generateBtn.textContent = "Generating...";
        generateBtn.disabled = true;
      } else {
        if (loadingEl) loadingEl.classList.remove("active");
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
    function loadSettings(settings) {
      const apiKeyInput = document.getElementById("apiKey");
      if (apiKeyInput && settings.apiKey) {
        apiKeyInput.value = settings.apiKey;
        updateKeyStatus(true);
      }
      
      if (settings.defaultModel) {
        const select = document.getElementById("defaultModel");
        if (select) {
          select.value = settings.defaultModel;
        }
      }
      
      // Load models if API key is present
      if (settings.apiKey) {
        loadModels();
      }
    }
    
    function saveApiKey() {
      const apiKey = document.getElementById("apiKey").value.trim();
      if (!apiKey) {
        showError("API key cannot be empty");
        return;
      }
      
      // Show validating status
      updateKeyStatus(null);
      
      // Disable save button during validation
      const saveBtn = document.getElementById("saveKey");
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = "Validating...";
      }
      
      parent.postMessage({
        pluginMessage: {
          type: "save-api-key",
          data: apiKey
        }
      }, "*");
    }
    
    function loadModels() {
      const modelsList = document.getElementById("modelsList");
      if (modelsList) {
        modelsList.innerHTML = '<div class="loading">Loading models...</div>';
      }
      
      parent.postMessage({
        pluginMessage: {
          type: "load-models"
        }
      }, "*");
    }
    
    function saveDefaultModel() {
      const select = document.getElementById("defaultModel");
      const modelId = select ? select.value : "";
      
      parent.postMessage({
        pluginMessage: {
          type: "save-default-model",
          data: modelId
        }
      }, "*");
    }
    
    function updateKeyStatus(isValid) {
      const statusEl = document.getElementById("keyStatus");
      if (statusEl) {
        if (isValid === true) {
          statusEl.textContent = "\u2713 API key validated and saved";
          statusEl.className = "key-status valid";
        } else if (isValid === false) {
          statusEl.textContent = "\u2717 Invalid API key";
          statusEl.className = "key-status invalid";
        } else {
          statusEl.textContent = "Validating...";
          statusEl.className = "key-status validating";
        }
      }
    }
    
    function displayModels(models) {
      const modelsList = document.getElementById("modelsList");
      const select = document.getElementById("defaultModel");
      
      if (!modelsList || !select) return;
      
      if (models.length === 0) {
        modelsList.innerHTML = '<div class="no-models">No models available. Please check your API key.</div>';
        return;
      }
      
      // Display models list with more details
      modelsList.innerHTML = models.map(function(model) {
        var description = model.description ? 
          '<div class="model-description">' + model.description.substring(0, 100) + (model.description.length > 100 ? '...' : '') + '</div>' : '';
        var contextInfo = model.contextLength ? 
          '<div class="model-context">Context: ' + model.contextLength.toLocaleString() + ' tokens</div>' : '';
        
        return '<div class="model-item">' +
          '<div class="model-name">' + model.name + '</div>' +
          '<div class="model-id">' + model.id + '</div>' +
          description +
          contextInfo +
          '</div>';
      }).join('');
      
      // Update select options
      select.innerHTML = '<option value="">Select a model</option>' + 
        models.map(function(model) { 
          return '<option value="' + model.id + '">' + model.name + '</option>';
        }).join('');
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
    
    // Initialize settings on load
    loadSettings({});
  <\/script>
</body>
</html>`;
  figma.showUI(uiHtml, { width: 400, height: 600 });
  figma.ui.onmessage = async (msg) => {
    try {
      switch (msg.type) {
        case "generate":
          await handleGenerate(msg.data);
          break;
        case "render":
          await handleRender(msg.data);
          break;
        case "save-api-key":
          await handleSaveApiKey(msg.data);
          break;
        case "get-settings":
          await handleGetSettings();
          break;
        case "load-models":
          await handleLoadModels();
          break;
        case "save-default-model":
          await handleSaveDefaultModel(msg.data);
          break;
        default:
          figma.notify("Unknown message type");
      }
    } catch (error) {
      console.error("Plugin error:", error);
      figma.ui.postMessage({
        type: "error",
        data: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };
  async function handleGenerate(request) {
    figma.ui.postMessage({ type: "loading", data: true });
    try {
      const apiKey = await figma.clientStorage.getAsync("apiKey");
      const defaultModel = await figma.clientStorage.getAsync("defaultModel");
      if (!apiKey) {
        throw new Error("Please configure your OpenRouter API key in Settings");
      }
      if (!defaultModel) {
        throw new Error("Please select a default model in Settings");
      }
      const response = await fetch("http://localhost:3001/api/generate-with-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: request.prompt,
          userId: request.userId,
          apiKey,
          model: defaultModel
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success && result.data) {
        figma.ui.postMessage({
          type: "generate-complete",
          data: result.data
        });
      } else {
        throw new Error(result.error || "Failed to generate wireframe");
      }
    } catch (error) {
      throw new Error(`Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      figma.ui.postMessage({ type: "loading", data: false });
    }
  }
  async function handleRender(spec) {
    const frame = figma.createFrame();
    frame.name = "AI Generated Wireframe";
    frame.resize(spec.width, spec.height || 800);
    for (const child of spec.children) {
      await renderChild(frame, child);
    }
    figma.currentPage.appendChild(frame);
    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify("Wireframe generated successfully!");
  }
  async function renderChild(parent, child) {
    switch (child.type) {
      case "text":
        await renderText(parent, child);
        break;
      case "component":
        await renderComponent(parent, child);
        break;
    }
  }
  async function renderText(parent, child) {
    const textNode = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    textNode.characters = child.content || "";
    textNode.x = child.x;
    textNode.y = child.y;
    if (child.width)
      textNode.resize(child.width, textNode.height);
    if (child.height)
      textNode.resize(textNode.width, child.height);
    parent.appendChild(textNode);
  }
  async function renderComponent(parent, child) {
    if (!child.componentName) {
      throw new Error("Component name is required");
    }
    const node = await createAutoComponent(child.componentName, child);
    if (node) {
      parent.appendChild(node);
    }
  }
  async function createAutoComponent(componentName, child) {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    switch (componentName) {
      case "Button/Primary":
        return createButton(child, "#3B82F6", "#FFFFFF");
      case "Button/Secondary":
        return createButton(child, "#F3F4F6", "#1F2937");
      case "Input/Default":
      case "Input/Password":
        return createInput(child, false);
      case "Text/Heading":
        return createTextElement(child, 24, "Bold");
      case "Text/Body":
        return createTextElement(child, 14, "Regular");
      case "Container/Card":
        return createContainer(child, 16, "#FFFFFF");
      case "Container/Section":
        return createContainer(child, 0, "#F9FAFB");
      default:
        const rect = figma.createRectangle();
        rect.name = componentName;
        rect.x = child.x;
        rect.y = child.y;
        rect.resize(child.width || 200, child.height || 40);
        rect.fills = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
        rect.cornerRadius = 4;
        return rect;
    }
  }
  async function createButton(child, bgColor, textColor) {
    const frame = figma.createFrame();
    frame.name = "Button";
    frame.x = child.x;
    frame.y = child.y;
    frame.resize(child.width || 120, child.height || 40);
    frame.fills = [{ type: "SOLID", color: hexToFigmaColor(bgColor) }];
    frame.cornerRadius = 6;
    const text = figma.createText();
    text.characters = child.content || "Button";
    text.fontSize = 14;
    text.fills = [{ type: "SOLID", color: hexToFigmaColor(textColor) }];
    text.x = (frame.width - text.width) / 2;
    text.y = (frame.height - text.height) / 2;
    frame.appendChild(text);
    return frame;
  }
  async function createInput(child, isPassword) {
    const frame = figma.createFrame();
    frame.name = isPassword ? "Password Input" : "Text Input";
    frame.x = child.x;
    frame.y = child.y;
    frame.resize(child.width || 200, child.height || 40);
    frame.fills = [{ type: "SOLID", color: hexToFigmaColor("#FFFFFF") }];
    frame.strokes = [{ type: "SOLID", color: hexToFigmaColor("#D1D5DB") }];
    frame.strokeWeight = 1;
    frame.cornerRadius = 4;
    const text = figma.createText();
    text.characters = child.content || (isPassword ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : "Enter text...");
    text.fontSize = 14;
    text.fills = [{ type: "SOLID", color: hexToFigmaColor("#6B7280") }];
    text.x = 12;
    text.y = (frame.height - text.height) / 2;
    frame.appendChild(text);
    return frame;
  }
  async function createTextElement(child, fontSize, fontWeight) {
    const text = figma.createText();
    text.name = "Text";
    text.characters = child.content || "Text";
    text.fontSize = fontSize;
    text.fontName = { family: "Inter", style: fontWeight };
    text.fills = [{ type: "SOLID", color: hexToFigmaColor("#1F2937") }];
    text.x = child.x;
    text.y = child.y;
    if (child.width)
      text.resize(child.width, text.height);
    if (child.height)
      text.resize(text.width, child.height);
    return text;
  }
  async function createContainer(child, padding, bgColor) {
    const frame = figma.createFrame();
    frame.name = "Container";
    frame.x = child.x;
    frame.y = child.y;
    frame.resize(child.width || 300, child.height || 200);
    frame.fills = [{ type: "SOLID", color: hexToFigmaColor(bgColor) }];
    frame.cornerRadius = 8;
    if (padding > 0) {
      frame.paddingTop = padding;
      frame.paddingRight = padding;
      frame.paddingBottom = padding;
      frame.paddingLeft = padding;
    }
    return frame;
  }
  function hexToFigmaColor(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  }
  async function handleSaveApiKey(apiKey) {
    try {
      const validationResponse = await fetch("https://openrouter.ai/api/v1/auth/key", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });
      if (!validationResponse.ok) {
        let errorMessage = "Invalid API key";
        if (validationResponse.status === 401) {
          errorMessage = "Invalid API key. Please check your OpenRouter API key.";
        } else if (validationResponse.status === 403) {
          errorMessage = "API key does not have required permissions.";
        }
        figma.ui.postMessage({ type: "api-key-saved", data: false });
        figma.ui.postMessage({ type: "error", data: errorMessage });
        return;
      }
      const userData = await validationResponse.json();
      console.log("API key validated for user:", userData);
      await figma.clientStorage.setAsync("apiKey", apiKey);
      figma.ui.postMessage({ type: "api-key-saved", data: true });
      figma.notify("API key validated and saved!");
      await handleLoadModels();
    } catch (error) {
      console.error("API key validation failed:", error);
      figma.ui.postMessage({ type: "api-key-saved", data: false });
      let errorMessage = "Failed to validate API key";
      if (error instanceof Error) {
        if (error.message.includes("fetch")) {
          errorMessage = "Network error. Please check your internet connection.";
        } else {
          errorMessage = error.message;
        }
      }
      figma.ui.postMessage({ type: "error", data: errorMessage });
    }
  }
  async function handleGetSettings() {
    const apiKey = await figma.clientStorage.getAsync("apiKey") || "";
    const defaultModel = await figma.clientStorage.getAsync("defaultModel") || "";
    figma.ui.postMessage({
      type: "settings-loaded",
      data: { apiKey, defaultModel }
    });
  }
  async function handleLoadModels() {
    const apiKey = await figma.clientStorage.getAsync("apiKey");
    if (!apiKey) {
      figma.ui.postMessage({ type: "models-loaded", data: [] });
      return;
    }
    try {
      const validationResponse = await fetch("https://openrouter.ai/api/v1/auth/key", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });
      if (!validationResponse.ok) {
        if (validationResponse.status === 401) {
          throw new Error("Invalid API key");
        } else if (validationResponse.status === 403) {
          throw new Error("API key does not have required permissions");
        }
        throw new Error("API key validation failed");
      }
      const modelsResponse = await fetch("https://openrouter.ai/api/v1/models", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://figma-ai-wireframer.com",
          "X-Title": "Figma Wireframe Agent"
        }
      });
      if (!modelsResponse.ok) {
        throw new Error(`Failed to load models: ${modelsResponse.statusText}`);
      }
      const data = await modelsResponse.json();
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Invalid response from OpenRouter models API");
      }
      const models = data.data.filter((model) => {
        return model.id && model.name && // Exclude vision, image, and specialized models
        !model.id.includes("vision") && !model.id.includes("image") && !model.id.includes("dall-e") && !model.id.includes("stable-diffusion") && !model.id.includes("midjourney") && // Include models that support chat completions
        (model.id.includes("chat") || model.id.includes("gpt") || model.id.includes("claude") || model.id.includes("llama") || model.id.includes("mistral") || model.id.includes("gemini"));
      }).map((model) => ({
        id: model.id,
        name: model.name || model.id,
        description: model.description || "",
        pricing: model.pricing || {},
        contextLength: model.context_length || 4096
      })).sort((a, b) => {
        const priority = ["claude-3.5-sonnet", "gpt-4", "gpt-4-turbo", "gemini-pro"];
        const aPriority = priority.findIndex((p) => a.id.includes(p));
        const bPriority = priority.findIndex((p) => b.id.includes(p));
        if (aPriority !== -1 && bPriority !== -1)
          return aPriority - bPriority;
        if (aPriority !== -1)
          return -1;
        if (bPriority !== -1)
          return 1;
        return a.name.localeCompare(b.name);
      });
      figma.ui.postMessage({ type: "models-loaded", data: models });
      figma.notify(`Loaded ${models.length} models successfully`);
    } catch (error) {
      console.error("Failed to load models:", error);
      figma.ui.postMessage({ type: "models-loaded", data: [] });
      let errorMessage = "Failed to load models";
      if (error instanceof Error) {
        if (error.message.includes("Invalid API key")) {
          errorMessage = "Invalid API key. Please check your OpenRouter API key.";
        } else if (error.message.includes("permissions")) {
          errorMessage = "API key lacks required permissions.";
        } else {
          errorMessage = error.message;
        }
      }
      figma.ui.postMessage({ type: "error", data: errorMessage });
    }
  }
  async function handleSaveDefaultModel(modelId) {
    await figma.clientStorage.setAsync("defaultModel", modelId);
    figma.notify("Default model saved!");
  }
})();
