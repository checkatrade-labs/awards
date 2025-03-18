'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Upload, X } from 'lucide-react';

interface ImageUploadProps {
  images: File[];
  onChange: (images: File[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  images,
  onChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate preview URLs for the images
  const previewUrls = images.map((file) => URL.createObjectURL(file));

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    setError(null);
    
    // Check if adding more files would exceed the limit
    if (images.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name} (not an image)`);
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} (exceeds 5MB)`);
        return;
      }

      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      setError(`Some files were not added: ${invalidFiles.join(', ')}`);
    }

    if (validFiles.length > 0) {
      onChange([...images, ...validFiles]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Add Photos (Optional)
      </label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          <div className="flex justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-sm text-gray-700">
            Drag and drop image files here, or click to select files
          </p>
          <p className="text-xs text-gray-600">
            JPG, PNG, GIF up to 5MB (max {maxImages} images)
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={images.length >= maxImages}
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Images
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={images.length >= maxImages}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Selected Images ({images.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden bg-gray-100">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="object-cover"
                    width={200}
                    height={200}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-600">
        Adding photos helps showcase the quality of work and strengthens your nomination.
      </p>
    </div>
  );
}
