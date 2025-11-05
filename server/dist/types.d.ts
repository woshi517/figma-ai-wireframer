export { WireframeSpec, WireframeChild, GenerateRequest, GenerateResponse, ComponentMap } from '../shared/types.js';
export interface OpenRouterMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface OpenRouterRequest {
    model: string;
    messages: OpenRouterMessage[];
    temperature?: number;
    max_tokens?: number;
}
export interface OpenRouterResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
//# sourceMappingURL=types.d.ts.map