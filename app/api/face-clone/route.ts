import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const sourceImage = formData.get('sourceImage') as File;
    const targetImage = formData.get('targetImage') as File;

    if (!sourceImage || !targetImage) {
      return NextResponse.json(
        { error: 'Both source and target images are required' },
        { status: 400 }
      );
    }

    // Convert File objects to ArrayBuffer
    const sourceBuffer = await sourceImage.arrayBuffer();
    const targetBuffer = await targetImage.arrayBuffer();

    // Mock face cloning process
    // In a real implementation, you would use an AI/ML service here
    // For now, we'll just blend the images together as a placeholder
    const resultBuffer = await sharp(Buffer.from(targetBuffer))
      .composite([
        {
          input: Buffer.from(sourceBuffer),
          gravity: 'center',
        },
      ])
      .toBuffer();

    // Convert the result to base64
    const base64Result = `data:image/jpeg;base64,${resultBuffer.toString('base64')}`;

    return NextResponse.json({ resultImage: base64Result });
  } catch (error) {
    console.error('Error processing images:', error);
    return NextResponse.json(
      { error: 'Failed to process images' },
      { status: 500 }
    );
  }
} 