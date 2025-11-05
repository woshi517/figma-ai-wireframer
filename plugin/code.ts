import { WireframeSpec, ComponentMap, GenerateRequest, GenerateResponse } from '../shared/types';

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

figma.showUI(__html__, { width: 400, height: 600 });

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
  frame.resize(spec.width, spec.height ?? 800);
  
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