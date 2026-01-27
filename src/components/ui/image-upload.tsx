"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils/cn";

interface ImageUploadProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  maxSizeKB?: number;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  maxSizeKB = 100,
  className,
  disabled = false,
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);

      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a PNG, JPG, GIF, or WebP image");
        return;
      }

      // Validate file size
      if (file.size > maxSizeKB * 1024) {
        setError(`Image must be less than ${maxSizeKB}KB`);
        return;
      }

      // Resize and convert to base64
      try {
        const resizedDataUrl = await resizeImage(file, 128, 128);
        onChange(resizedDataUrl);
      } catch (err) {
        console.error("Image processing error:", err);
        setError("Failed to process image");
      }
    },
    [maxSizeKB, onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Project Icon (optional)
      </label>

      {value ? (
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            <img
              src={value}
              alt="Project icon"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
            isDragging
              ? "border-primary-400 bg-primary-50"
              : "border-gray-300 hover:border-gray-400 bg-gray-50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            Click or drag to upload an icon
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PNG, JPG, GIF, WebP (max {maxSizeKB}KB)
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Helper function to resize image
async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/png", 0.9);
        resolve(dataUrl);
      } else {
        reject(new Error("Could not get canvas context"));
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));

    img.src = URL.createObjectURL(file);
  });
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  );
}
