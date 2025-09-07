'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPromptHistory, savePromptToHistory } from '@/lib/imageUtils';
import { PromptHistory } from '@/types/image';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
}

export default function PromptInput({
  value,
  onChange,
  onGenerate,
  isGenerating,
  systemPrompt,
  onSystemPromptChange
}: PromptInputProps) {
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);

  useEffect(() => {
    setPromptHistory(getPromptHistory());
  }, []);

  const handleGenerate = () => {
    if (value.trim()) {
      savePromptToHistory(value.trim());
      setPromptHistory(getPromptHistory());
      onGenerate();
    }
  };

  const handlePromptSelect = (prompt: string) => {
    onChange(prompt);
    setShowHistory(false);
  };

  const examplePrompts = [
    "A serene mountain landscape at sunset with golden light",
    "Futuristic cyberpunk city with neon lights and flying cars",
    "Portrait of a wise old wizard with magical sparkles",
    "Underwater scene with colorful coral reef and tropical fish",
    "Steampunk mechanical dragon with brass gears and steam"
  ];

  return (
    <div className="space-y-4">
      {/* System Prompt Section */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-orange-800">System Prompt</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSystemPrompt(!showSystemPrompt)}
              className="text-orange-600 hover:text-orange-800"
            >
              {showSystemPrompt ? 'Hide' : 'Customize'}
            </Button>
          </div>
        </CardHeader>
        {showSystemPrompt && (
          <CardContent className="pt-0">
            <Textarea
              placeholder="Enter system prompt to guide the AI's image generation style and approach..."
              value={systemPrompt}
              onChange={(e) => onSystemPromptChange(e.target.value)}
              className="min-h-[80px] border-orange-200 focus:border-orange-400"
            />
            <p className="text-xs text-orange-600 mt-2">
              The system prompt helps define the overall style, quality, and approach for image generation.
            </p>
          </CardContent>
        )}
      </Card>

      {/* Main Prompt Input */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Image Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe the image you want to generate..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[120px] resize-none"
            disabled={isGenerating}
          />

          {/* Example Prompts */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Example Prompts:</h4>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((prompt, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 transition-colors"
                  onClick={() => onChange(prompt)}
                >
                  {prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              disabled={isGenerating}
            >
              {showHistory ? 'Hide History' : 'Recent Prompts'}
            </Button>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !value.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? 'Generating...' : 'Generate Image'}
            </Button>
          </div>

          {/* Prompt History */}
          {showHistory && promptHistory.length > 0 && (
            <Card className="bg-gray-50">
              <CardContent className="p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Prompts:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {promptHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 bg-white rounded cursor-pointer hover:bg-blue-50 transition-colors"
                      onClick={() => handlePromptSelect(item.prompt)}
                    >
                      <p className="text-sm text-gray-700 line-clamp-2">{item.prompt}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}