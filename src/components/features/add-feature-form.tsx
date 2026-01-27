"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { createFeature } from "@/actions/features";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddFeatureFormProps {
  projectId: string;
}

export function AddFeatureForm({ projectId }: AddFeatureFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    startTransition(async () => {
      const result = await createFeature({
        projectId,
        name,
        description: description || undefined,
      });

      if (result.success) {
        formRef.current?.reset();
        setIsOpen(false);
        router.refresh();
      } else {
        setError(result.error || "Failed to create feature");
      }
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
      >
        <PlusIcon className="w-5 h-5" />
        Add Feature
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
    >
      <div className="space-y-3">
        <Input
          name="name"
          placeholder="Feature name (e.g., User Authentication)"
          required
          autoFocus
          error={error || undefined}
        />
        <Input
          name="description"
          placeholder="Description (optional)"
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" isLoading={isPending}>
          Add Feature
        </Button>
      </div>
    </form>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
  );
}
