'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [targetImage, setTargetImage] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSourceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSourceImage(e.target.files[0]);
      setError(null);
    }
  };

  const handleTargetImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTargetImage(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceImage || !targetImage) {
      setError('Please upload both source and target images');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('sourceImage', sourceImage);
    formData.append('targetImage', targetImage);

    try {
      const response = await fetch('/api/face-clone', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process images');
      }

      const data = await response.json();
      setResultImage(data.resultImage);
    } catch (err) {
      setError('An error occurred while processing the images');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Face Cloning App
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Source Face Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleSourceImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {sourceImage && (
                <div className="relative h-48 w-full">
                  <Image
                    src={URL.createObjectURL(sourceImage)}
                    alt="Source face"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Target Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleTargetImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {targetImage && (
                <div className="relative h-48 w-full">
                  <Image
                    src={URL.createObjectURL(targetImage)}
                    alt="Target image"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !sourceImage || !targetImage}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Clone Face'}
          </button>

          {error && (
            <div className="text-red-600 text-center">{error}</div>
          )}
        </form>

        {resultImage && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-center mb-4">Result</h2>
            <div className="relative h-96 w-full">
              <Image
                src={resultImage}
                alt="Cloned face result"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}