"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";

interface CreateProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateProjectForm({
  onSuccess,
  onCancel,
}: CreateProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [iconUrl, setIconUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    startTransition(async () => {
      const result = await createProject({
        name,
        description: description || undefined,
        iconUrl: iconUrl || undefined,
      });

      if (result.success) {
        router.refresh();
        onSuccess?.();
      } else {
        setError(result.error || "Failed to create project");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        label="Project Name"
        placeholder="e.g., Client Website Redesign"
        required
        autoFocus
        error={error || undefined}
      />

      <div className="w-full">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Brief description of the project..."
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <ImageUpload
        value={iconUrl}
        onChange={setIconUrl}
        disabled={isPending}
      />

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isPending}>
          Create Project
        </Button>
      </div>
    </form>
  );
}
