# Auto Layout Implementation Guide

The Figma AI Wireframer now supports dynamic Auto Layout based on user prompts. This creates professional, responsive wireframes that leverage Figma's native Auto Layout capabilities.

## 🎯 How It Works

### **Layout Detection**
The plugin automatically detects the layout type based on your prompt:

- **Forms**: "login form", "signup page", "contact form"
- **Lists**: "todo list", "menu items", "feed"
- **Grids**: "product gallery", "dashboard", "photo grid"
- **Cards**: "profile card", "article post", "review card"
- **Headers**: "navigation header", "toolbar", "menu bar"
- **Modals**: "popup dialog", "modal window", "overlay"
- **Sidebars**: "navigation panel", "menu sidebar"
- **Tables**: "data table", "spreadsheet view"

### **Auto Layout Properties**
Instead of x,y coordinates, the plugin uses:

```json
{
  "type": "container",
  "layoutMode": "vertical",     // or "horizontal"
  "itemSpacing": 12,           // Gap between children
  "padding": 16,              // Container padding
  "layoutAlign": "stretch",     // "stretch", "center", "min", "max"
  "layoutGrow": 0,             // Growth factor
  "width": "stretch",          // "stretch", "hug", or number
  "height": "hug"             // "hug", "stretch", or number
}
```

## 🎨 Layout Patterns

### **Form Layout**
```json
{
  "type": "frame",
  "layoutMode": "vertical",
  "itemSpacing": 16,
  "padding": 24,
  "children": [
    {
      "type": "container",
      "layoutMode": "vertical",
      "itemSpacing": 12,
      "children": [
        {
          "type": "component",
          "componentName": "Text/Heading",
          "content": "Login"
        },
        {
          "type": "component",
          "componentName": "Input/Default",
          "layoutAlign": "stretch"
        },
        {
          "type": "component",
          "componentName": "Input/Password",
          "layoutAlign": "stretch"
        },
        {
          "type": "component",
          "componentName": "Button/Primary",
          "layoutAlign": "center"
        }
      ]
    }
  ]
}
```

### **List Layout**
```json
{
  "type": "frame",
  "layoutMode": "vertical",
  "itemSpacing": 8,
  "children": [
    {
      "type": "container",
      "layoutMode": "vertical",
      "itemSpacing": 8,
      "children": [
        {
          "type": "component",
          "componentName": "Container/Card",
          "layoutAlign": "stretch"
        },
        {
          "type": "component",
          "componentName": "Container/Card",
          "layoutAlign": "stretch"
        }
      ]
    }
  ]
}
```

### **Grid Layout**
```json
{
  "type": "frame",
  "layoutMode": "vertical",
  "itemSpacing": 16,
  "children": [
    {
      "type": "container",
      "layoutMode": "horizontal",
      "itemSpacing": 12,
      "layoutAlign": "stretch",
      "children": [
        {
          "type": "component",
          "componentName": "Container/Card",
          "layoutGrow": 1
        },
        {
          "type": "component",
          "componentName": "Container/Card",
          "layoutGrow": 1
        }
      ]
    }
  ]
}
```

## 🧪 Testing Examples

Try these prompts to test different layouts:

### **Forms**
- "a login form with email and password fields"
- "a signup form with name, email, and password"
- "a contact form with message textarea"

### **Lists**
- "a todo list with checkboxes"
- "a menu list with navigation items"
- "a settings list with toggle switches"

### **Grids**
- "a product grid with 3 columns"
- "a photo gallery grid layout"
- "a dashboard with widget grid"

### **Cards**
- "a user profile card with avatar and info"
- "an article card with title and excerpt"
- "a review card with rating and text"

### **Headers**
- "a navigation header with logo and menu"
- "a toolbar with search and profile"
- "a header with title and actions"

## ✨ Benefits of Auto Layout

- **Responsive**: Automatically adapts to different screen sizes
- **Consistent Spacing**: Design system spacing enforced automatically
- **Easy Editing**: Users can easily modify layouts in Figma
- **Professional**: Results look polished and organized
- **Flexible**: Supports complex nested layouts
- **Maintainable**: Changes to spacing propagate automatically

## 🔧 Technical Implementation

### **Container Creation**
```typescript
function renderContainer(parent: FrameNode, container: any, componentMap: ComponentMap) {
  const containerFrame = figma.createFrame();
  containerFrame.layoutMode = container.layoutMode.toUpperCase();
  containerFrame.itemSpacing = container.itemSpacing;
  containerFrame.layoutPositioning = 'AUTO';
  
  // Apply padding
  if (container.padding) {
    containerFrame.paddingTop = container.padding;
    containerFrame.paddingRight = container.padding;
    containerFrame.paddingBottom = container.padding;
    containerFrame.paddingLeft = container.padding;
  }
  
  // Render children recursively
  container.children.forEach(child => {
    renderChildWithAutoLayout(containerFrame, child, componentMap);
  });
  
  parent.appendChild(containerFrame);
}
```

### **Component Properties**
```typescript
function setAutoLayoutProperties(node: any, config: any) {
  node.layoutPositioning = 'AUTO';
  
  if (config.layoutAlign) {
    node.layoutAlign = config.layoutAlign.toUpperCase();
  }
  
  if (config.layoutGrow !== undefined) {
    node.layoutGrow = config.layoutGrow;
  }
  
  if (config.width === 'stretch') {
    node.layoutAlign = 'STRETCH';
  }
}
```

This Auto Layout implementation makes the generated wireframes much more professional and easier to edit in Figma!