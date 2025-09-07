'use client';

import { GeneratedImage } from '@/types/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { downloadImage, formatGenerationTime } from '@/lib/imageUtils';

interface ImageGalleryProps {
  images: GeneratedImage[];
  onImageClick?: (image: GeneratedImage) => void;
}

export default function ImageGallery({ images, onImageClick }: ImageGalleryProps) {
  const handleDownload = async (image: GeneratedImage, event: React.MouseEvent) => {
    event.stopPropagation();
    const filename = `ai-image-${image.id}.jpg`;
    await downloadImage(image.url, filename);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No images generated yet</h3>
        <p className="text-gray-500">Enter a prompt above to generate your first AI image!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Generated Images</h2>
        <Badge variant="secondary">{images.length} image{images.length !== 1 ? 's' : ''}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card 
            key={image.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => onImageClick?.(image)}
          >
            <div className="relative">
              <img
                src={image.url}
                alt={image.prompt}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => handleDownload(image, e)}
                    className="bg-white text-black hover:bg-gray-100"
                  >
                    Download
                  </Button>
                </div>
              </div>

              {/* Generation time badge */}
              {image.generationTime && (
                <Badge 
                  className="absolute top-2 right-2 bg-black bg-opacity-70 text-white"
                  variant="secondary"
                >
                  {formatGenerationTime(image.generationTime)}
                </Badge>
              )}
            </div>

            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                  {image.prompt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{image.dimensions.width} × {image.dimensions.height}</span>
                  <span>{new Date(image.timestamp).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {image.model.split('/').pop() || 'AI Generated'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}