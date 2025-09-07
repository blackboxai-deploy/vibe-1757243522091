import { GeneratedImage, PromptHistory } from '@/types/image';

// Generate unique ID for images
export function generateImageId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Save images to localStorage
export function saveImageToHistory(image: GeneratedImage): void {
  try {
    const existing = getImageHistory();
    const updated = [image, ...existing].slice(0, 50); // Keep last 50 images
    localStorage.setItem('ai_image_history', JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save image to history:', error);
  }
}

// Get image history from localStorage
export function getImageHistory(): GeneratedImage[] {
  try {
    const stored = localStorage.getItem('ai_image_history');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load image history:', error);
    return [];
  }
}

// Save prompt to history
export function savePromptToHistory(prompt: string): void {
  try {
    const existing = getPromptHistory();
    const newPrompt: PromptHistory = {
      id: generateImageId(),
      prompt,
      timestamp: Date.now()
    };
    const updated = [newPrompt, ...existing.filter(p => p.prompt !== prompt)].slice(0, 20);
    localStorage.setItem('ai_prompt_history', JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save prompt to history:', error);
  }
}

// Get prompt history from localStorage
export function getPromptHistory(): PromptHistory[] {
  try {
    const stored = localStorage.getItem('ai_prompt_history');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load prompt history:', error);
    return [];
  }
}

// Download image function
export async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Failed to download image:', error);
  }
}

// Format generation time
export function formatGenerationTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds.toFixed(1)}s`;
}

// Get default settings
export function getDefaultSettings() {
  return {
    systemPrompt: "Create a high-quality, detailed image based on the user's prompt. Focus on artistic composition, proper lighting, and visual appeal.",
    defaultWidth: 1024,
    defaultHeight: 1024,
    model: "replicate/black-forest-labs/flux-1.1-pro"
  };
}

// Save settings to localStorage
export function saveSettings(settings: any): void {
  try {
    localStorage.setItem('ai_generation_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

// Load settings from localStorage
export function loadSettings() {
  try {
    const stored = localStorage.getItem('ai_generation_settings');
    return stored ? { ...getDefaultSettings(), ...JSON.parse(stored) } : getDefaultSettings();
  } catch (error) {
    console.error('Failed to load settings:', error);
    return getDefaultSettings();
  }
}