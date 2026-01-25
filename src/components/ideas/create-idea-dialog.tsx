'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, AlertCircle } from 'lucide-react';

interface CreateIdeaDialogProps {
  currentCount: number;
  limit: number;
  tier: string;
  onIdeaCreated?: () => void;
}

export function CreateIdeaDialog({
  currentCount,
  limit,
  tier,
  onIdeaCreated
}: CreateIdeaDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isAtLimit = currentCount >= limit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter a name for your idea');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'TIER_LIMIT_REACHED') {
          setError(data.error);
        } else {
          setError(data.error || 'Failed to create idea');
        }
        return;
      }

      // Success - close dialog, reset form, and redirect
      setOpen(false);
      setName('');
      onIdeaCreated?.();

      // Redirect to the new idea's detail page
      router.push(`/ideas/${data.idea.id}`);

    } catch (err) {
      console.error('Error creating idea:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      setOpen(newOpen);
      if (!newOpen) {
        setName('');
        setError(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          disabled={isAtLimit}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Idea
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Idea</DialogTitle>
            <DialogDescription>
              Give your product idea a name. You can add more details later.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Idea Name</Label>
              <Input
                id="name"
                placeholder="e.g., AI-powered task manager"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              {currentCount} of {limit} idea{limit > 1 ? 's' : ''} used ({tier} plan)
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Idea'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Simpler button for when at limit - shows upgrade prompt
export function CreateIdeaLimitReached({ tier }: { tier: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          New Idea
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upgrade to Add More Ideas</DialogTitle>
          <DialogDescription>
            You have reached the idea limit for your {tier} plan.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Upgrade your plan to validate more product ideas and grow your business.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" asChild>
            <a href="/settings/billing">View Plans</a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
