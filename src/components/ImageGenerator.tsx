'use client';

import { useState, useEffect } from 'react';
import { GeneratedImage, ImageGenerationResponse, GenerationSettings } from '@/types/image';
import { generateImageId, saveImageToHistory, getImageHistory, saveSettings, loadSettings } from '@/lib/imageUtils';
import PromptInput from './PromptInput';
import ImageGallery from './ImageGallery';
import GenerationHistory from './GenerationHistory';
import SettingsPanel from './SettingsPanel';
import LoadingSpinner from './LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [settings, setSettings] = useState<GenerationSettings>({
    systemPrompt: "Create a high-quality, detailed image based on the user's prompt. Focus on artistic composition, proper lighting, and visual appeal.",
    defaultWidth: 1024,
    defaultHeight: 1024,
    model: "replicate/black-forest-labs/flux-1.1-pro"
  });
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Load saved images and settings on component mount
  useEffect(() => {
    const savedImages = getImageHistory();
    setGeneratedImages(savedImages);
    
    const savedSettings = loadSettings();
    setSettings(savedSettings);
  }, []);

  const simulateProgress = () => {
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 2000);
    
    return interval;
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    const progressInterval = simulateProgress();

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          width: settings.defaultWidth,
          height: settings.defaultHeight,
          model: settings.model,
          systemPrompt: settings.systemPrompt
        }),
      });

      const data: ImageGenerationResponse = await response.json();

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (!data.success || !data.imageUrl) {
        throw new Error(data.error || 'Failed to generate image');
      }

      const newImage: GeneratedImage = {
        id: generateImageId(),
        url: data.imageUrl,
        prompt: prompt.trim(),
        timestamp: Date.now(),
        dimensions: {
          width: settings.defaultWidth,
          height: settings.defaultHeight
        },
        model: settings.model,
        generationTime: data.generationTime
      };

      // Save to history and update state
      saveImageToHistory(newImage);
      setGeneratedImages(prev => [newImage, ...prev]);
      
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'An error occurred while generating the image');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleImageSelect = (image: GeneratedImage) => {
    setPrompt(image.prompt);
    // Optionally scroll to top or focus prompt input
  };

  const handleSettingsChange = (newSettings: GenerationSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all generation history?')) {
      localStorage.removeItem('ai_image_history');
      setGeneratedImages([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          AI Image Generator
        </h1>
        <p className="text-lg text-gray-600">
          Create stunning images with advanced AI technology
        </p>
        <div className="flex items-center justify-center mt-4 space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(true)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Generation History */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <GenerationHistory
            images={generatedImages}
            onImageSelect={handleImageSelect}
            onClearHistory={handleClearHistory}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 order-1 lg:order-2 space-y-6">
          {/* Prompt Input */}
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onGenerate={generateImage}
            isGenerating={isGenerating}
            systemPrompt={settings.systemPrompt}
            onSystemPromptChange={(value) => setSettings(prev => ({ ...prev, systemPrompt: value }))}
          />

          {/* Error Display */}
          {error && (
            <Card className="bg-red-50 border-red-200 p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-800">{error}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  Dismiss
                </Button>
              </div>
            </Card>
          )}

          {/* Loading State */}
          {isGenerating && (
            <Card className="bg-blue-50 border-blue-200">
              <LoadingSpinner
                size="lg"
                text="Generating your image..."
                showProgress={true}
                progress={generationProgress}
              />
            </Card>
          )}

          {/* Generated Images Gallery */}
          <ImageGallery
            images={generatedImages}
            onImageClick={handleImageSelect}
          />
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}