'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function AddDomainDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    scanFrequency: 'daily' as 'hourly' | 'daily' | 'weekly' | 'manual',
    notifyOnViolations: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formData.url,
          name: formData.name || undefined,
          scanFrequency: formData.scanFrequency,
          notifyOnViolations: formData.notifyOnViolations,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add domain');
      }

      // Success - close dialog and refresh
      setOpen(false);
      router.refresh();
      setFormData({
        url: '',
        name: '',
        scanFrequency: 'daily',
        notifyOnViolations: true,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to add domain');
    } finally {
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
      <DialogContent className="bg-[#162a2e] border-[#224349] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Domain</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a domain to monitor its security headers and CSP policy.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url" className="text-gray-300">
                Domain URL *
              </Label>
              <Input
                id="url"
                placeholder="example.com or https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
                className="bg-[#102023] border-[#224349] text-white placeholder:text-[#8fc3cc]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Display Name (optional)
              </Label>
              <Input
                id="name"
                placeholder="My Production Site"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[#102023] border-[#224349] text-white placeholder:text-[#8fc3cc]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scanFrequency" className="text-gray-300">
                Scan Frequency
              </Label>
              <Select
                value={formData.scanFrequency}
                onValueChange={(value: 'hourly' | 'daily' | 'weekly' | 'manual') =>
                  setFormData({ ...formData, scanFrequency: value })
                }
              >
                <SelectTrigger className="bg-[#102023] border-[#224349] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#162a2e] border-[#224349]">
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-[#224349] bg-[#224349] text-[#8fc3cc] hover:bg-[#2b545c]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#07b6d5] hover:brightness-110 text-[#102023] font-semibold"
            >
              {loading ? 'Adding...' : 'Add Domain'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
