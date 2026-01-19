"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AddDomainButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          name: name || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to add domain. Please try again.");
        setLoading(false);
        return;
      }

      setLoading(false);
      setOpen(false);
      setUrl("");
      setName("");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#07b6d5] hover:brightness-110 text-[#102023] font-semibold shadow-lg shadow-[#07b6d5]/10">
          <Plus className="mr-2 h-4 w-4" />
          Add Domain
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#162a2e] border-[#224349] text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Add Domain</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Domain URL</label>
            <Input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-[#102023] border-[#224349] text-white placeholder:text-[#8fc3cc]"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Display Name (optional)</label>
            <Input
              type="text"
              placeholder="Example Production"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#102023] border-[#224349] text-white placeholder:text-[#8fc3cc]"
            />
          </div>
          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-[#224349] bg-transparent text-[#8fc3cc] hover:bg-[#2b545c]"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#07b6d5] hover:brightness-110 text-[#102023] font-semibold shadow-lg shadow-[#07b6d5]/10"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Domain"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

