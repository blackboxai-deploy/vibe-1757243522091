'use client';

import { GeneratedImage } from '@/types/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface GenerationHistoryProps {
  images: GeneratedImage[];
  onImageSelect: (image: GeneratedImage) => void;
  onClearHistory: () => void;
}

export default function GenerationHistory({ images, onImageSelect, onClearHistory }: GenerationHistoryProps) {
  if (images.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No generation history yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg">History</CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {images.length}
          </Badge>
          {images.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="text-red-600 hover:text-red-800 hover:bg-red-50 text-xs"
            >
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {images.map((image) => (
          <div
            key={image.id}
            className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onImageSelect(image)}
          >
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              <img
                src={image.url}
                alt={image.prompt}
                className="w-12 h-12 rounded-md object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 line-clamp-2 leading-tight mb-1">
                {image.prompt}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {new Date(image.timestamp).toLocaleDateString()}
                </span>
                
                {image.generationTime && (
                  <Badge variant="outline" className="text-xs">
                    {image.generationTime.toFixed(1)}s
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-400">
                  {image.dimensions.width} × {image.dimensions.height}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}