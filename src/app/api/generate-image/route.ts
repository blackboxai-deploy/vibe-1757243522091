import { NextRequest, NextResponse } from 'next/server';
import { ImageGenerationRequest, ImageGenerationResponse } from '@/types/image';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: ImageGenerationRequest = await request.json();
    const { prompt, width = 1024, height = 1024, model = 'replicate/black-forest-labs/flux-1.1-pro', systemPrompt } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Prompt is required'
      } as ImageGenerationResponse, { status: 400 });
    }

    // Construct the final prompt with system prompt if provided
    const finalPrompt = systemPrompt 
      ? `${systemPrompt}\n\nUser prompt: ${prompt}`
      : prompt;

    const startTime = Date.now();

    // Make request to AI API
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'jasolaaksh@gmail.com',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: finalPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      return NextResponse.json({
        success: false,
        error: `Failed to generate image: ${response.status} ${response.statusText}`
      } as ImageGenerationResponse, { status: 500 });
    }

    const data = await response.json();
    const generationTime = (Date.now() - startTime) / 1000;

    // Extract image URL from response
    let imageUrl: string | undefined;
    
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      imageUrl = data.choices[0].message.content;
    } else if (typeof data === 'string' && data.startsWith('http')) {
      imageUrl = data;
    } else if (data.url) {
      imageUrl = data.url;
    } else if (data.image_url) {
      imageUrl = data.image_url;
    }

    if (!imageUrl) {
      console.error('No image URL in response:', data);
      return NextResponse.json({
        success: false,
        error: 'No image URL received from AI service'
      } as ImageGenerationResponse, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      generationTime: generationTime,
      metadata: {
        model: model,
        prompt: prompt,
        dimensions: { width, height }
      }
    } as ImageGenerationResponse);

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    } as ImageGenerationResponse, { status: 500 });
  }
}