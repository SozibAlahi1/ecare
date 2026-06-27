"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
}

export default function ImageUploader({ 
  value, 
  onChange, 
  label = "Upload Image", 
  accept = "image/*",
  maxSizeMB = 50
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit dynamically (default 50MB)
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size should be less than ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const id = `file-uploader-${Math.random().toString(36).substr(2, 9)}`;

  const isZip = value && (value.endsWith(".zip") || value.includes(".zip?"));

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3">
        {value && (
          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            {isZip ? (
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">ZIP</span>
            ) : (
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}
        
        <input
          type="file"
          accept={accept}
          onChange={handleUpload}
          className="hidden"
          id={id}
        />
        <label htmlFor={id} className="cursor-pointer">
          <span className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-colors gap-2">
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            {label}
          </span>
        </label>
      </div>
      {error && <p className="text-[10px] text-red-500 font-semibold">{error}</p>}
    </div>
  );
}
