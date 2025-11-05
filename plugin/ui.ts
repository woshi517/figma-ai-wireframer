interface Message {
  type: string;
  data?: any;
}

let isLoading = false;

// Initialize
window.onload = () => {
  parent.postMessage({ pluginMessage: { type: 'get-component-map' } }, '*');
};

// Listen for messages from plugin code
window.onmessage = (event) => {
  const msg = event.data.pluginMessage as Message;
  
  switch (msg.type) {
    case 'loading':
      setLoading(msg.data);
      break;
    
    case 'generate-complete':
      handleGenerateComplete(msg.data);
      break;
    
    case 'component-map-loaded':
      loadComponentMapping(msg.data);
      break;
    
    case 'error':
      showError(msg.data);
      break;
  }
};

function switchTab(tabName: string) {
  // Update tab buttons
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[onclick="switchTab('${tabName}')"]`)?.classList.add('active');
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(`${tabName}-tab`)?.classList.add('active');
}

function setLoading(loading: boolean) {
  isLoading = loading;
  const loadingEl = document.getElementById('loading');
  const generateBtn = document.getElementById('generate-btn');
  
  if (loading) {
    loadingEl?.classList.add('active');
    generateBtn!.textContent = 'Generating...';
    generateBtn!.disabled = true;
  } else {
    loadingEl?.classList.remove('active');
    generateBtn!.textContent = 'Generate Wireframe';
    generateBtn!.disabled = false;
  }
}

function generateWireframe() {
  if (isLoading) return;
  
  const prompt = (document.getElementById('prompt') as HTMLTextAreaElement).value.trim();
  
  if (!prompt) {
    showError('Please enter a description of the UI you want to generate.');
    return;
  }
  
  hideError();
  
  parent.postMessage({
    pluginMessage: {
      type: 'generate',
      data: { prompt }
    }
  }, '*');
}

function handleGenerateComplete(wireframeSpec: any) {
  parent.postMessage({
    pluginMessage: {
      type: 'render',
      data: wireframeSpec
    }
  }, '*');
}

function loadComponentMapping(componentMap: any) {
  Object.keys(componentMap).forEach(componentName => {
    const input = document.getElementById(`component-${componentName}`) as HTMLInputElement;
    if (input) {
      input.value = componentMap[componentName] || '';
    }
  });
}

function saveComponentMapping() {
  const componentMap: any = {};
  
  // Collect all component mappings
  document.querySelectorAll('.component-input').forEach(input => {
    const element = input as HTMLInputElement;
    const componentName = element.id.replace('component-', '');
    componentMap[componentName] = element.value.trim();
  });
  
  parent.postMessage({
    pluginMessage: {
      type: 'save-component-map',
      data: componentMap
    }
  }, '*');
}

function showError(message: string) {
  const errorEl = document.getElementById('error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('active');
  }
}

function hideError() {
  const errorEl = document.getElementById('error');
  if (errorEl) {
    errorEl.classList.remove('active');
  }
}