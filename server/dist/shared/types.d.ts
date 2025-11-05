export interface WireframeChild {
    type: "text" | "component" | "container";
    content?: string;
    componentName?: string;
    x?: number;
    y?: number;
    width?: number | "stretch" | "hug";
    height?: number | "stretch" | "hug";
    layoutAlign?: "stretch" | "center" | "min" | "max";
    layoutGrow?: number;
    layoutMode?: "vertical" | "horizontal";
    itemSpacing?: number;
    padding?: number | {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    children?: WireframeChild[];
}
export interface WireframeSpec {
    type: "frame";
    width: number;
    height?: number;
    layoutMode?: "vertical" | "horizontal";
    itemSpacing?: number;
    padding?: number | {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    children: WireframeChild[];
}
export interface Settings {
    apiKey: string;
    defaultModel: string;
}
export interface Model {
    id: string;
    name: string;
}
export interface GenerateRequest {
    prompt: string;
    userId?: string;
}
export interface GenerateResponse {
    success: boolean;
    data?: WireframeSpec;
    error?: string;
}
//# sourceMappingURL=types.d.ts.map