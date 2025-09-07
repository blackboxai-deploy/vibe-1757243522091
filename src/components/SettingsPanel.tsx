'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { GenerationSettings } from '@/types/image';

interface SettingsPanelProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: GenerationSettings) => void;
  onClose: () => void;
}

export default function SettingsPanel({ settings, onSettingsChange, onClose }: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const dimensionOptions = [
    { label: '512 × 512 (Square)', width: 512, height: 512 },
    { label: '768 × 768 (Square)', width: 768, height: 768 },
    { label: '1024 × 1024 (Square)', width: 1024, height: 1024 },
    { label: '1536 × 1024 (Landscape)', width: 1536, height: 1024 },
    { label: '1024 × 1536 (Portrait)', width: 1024, height: 1536 },
    { label: '1792 × 1024 (Wide)', width: 1792, height: 1024 },
    { label: '1024 × 1792 (Tall)', width: 1024, height: 1792 }
  ];

  const modelOptions = [
    { label: 'FLUX 1.1 Pro (Recommended)', value: 'replicate/black-forest-labs/flux-1.1-pro' },
    { label: 'FLUX Schnell (Fast)', value: 'replicate/black-forest-labs/flux-schnell' },
    { label: 'FLUX Kontext Max (Context)', value: 'replicate/black-forest-labs/flux-kontext-max' }
  ];

  const handleDimensionChange = (value: string) => {
    const option = dimensionOptions.find(opt => `${opt.width}x${opt.height}` === value);
    if (option) {
      setLocalSettings(prev => ({
        ...prev,
        defaultWidth: option.width,
        defaultHeight: option.height
      }));
    }
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings: GenerationSettings = {
      systemPrompt: "Create a high-quality, detailed image based on the user's prompt. Focus on artistic composition, proper lighting, and visual appeal.",
      defaultWidth: 1024,
      defaultHeight: 1024,
      model: "replicate/black-forest-labs/flux-1.1-pro"
    };
    setLocalSettings(defaultSettings);
  };

  const currentDimension = `${localSettings.defaultWidth}x${localSettings.defaultHeight}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Generation Settings</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* AI Model Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">AI Model</Label>
            <Select value={localSettings.model} onValueChange={(value) => setLocalSettings(prev => ({ ...prev, model: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              FLUX 1.1 Pro provides the best quality but may be slower. Schnell is faster for quick iterations.
            </p>
          </div>

          {/* Image Dimensions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Default Image Dimensions</Label>
            <Select value={currentDimension} onValueChange={handleDimensionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select dimensions" />
              </SelectTrigger>
              <SelectContent>
                {dimensionOptions.map((option) => (
                  <SelectItem key={`${option.width}x${option.height}`} value={`${option.width}x${option.height}`}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Higher resolutions produce better quality but take longer to generate.
            </p>
          </div>

          {/* Advanced Settings Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Generation Info</h3>
            <div className="space-y-1 text-xs text-blue-800">
              <p>• Images are generated using state-of-the-art AI models</p>
              <p>• Generation time varies from 15 seconds to 5 minutes</p>
              <p>• Higher quality models produce better results but take longer</p>
              <p>• System prompts help guide the overall style and quality</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>
              Reset to Defaults
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}