export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  dimensions: {
    width: number;
    height: number;
  };
  model: string;
  generationTime?: number;
}

export interface ImageGenerationRequest {
  prompt: string;
  width?: number;
  height?: number;
  model?: string;
  systemPrompt?: string;
}

export interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  generationTime?: number;
  metadata?: {
    model: string;
    prompt: string;
    dimensions: {
      width: number;
      height: number;
    };
  };
}

export interface GenerationSettings {
  systemPrompt: string;
  defaultWidth: number;
  defaultHeight: number;
  model: string;
}

export interface PromptHistory {
  id: string;
  prompt: string;
  timestamp: number;
  imageUrl?: string;
}