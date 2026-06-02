'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Branch {
  id: string;
  name_ar: string;
  name_en: string;
}

interface FeedbackEntry {
  id: string;
  branchId: string;
  rating: number;
  customerName?: string;
  feedbackMessage?: string;
  createdAt: string;
  branch?: {
    name_ar: string;
    name_en: string;
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-muted text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  const fetchBranches = useCallback(async () => {
    try {
      const res = await fetch('/api/branches');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBranches(data);
    } catch {
      // Silently fail
    }
  }, []);

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedBranchId) params.set('branchId', selectedBranchId);
      const res = await fetch(`/api/feedback?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setFeedbacks(data);
    } catch {
      // Silently fail for feedback
    } finally {
      setLoading(false);
    }
  }, [selectedBranchId]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const averageRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feedback</h1>
          <p className="text-muted-foreground text-sm">View customer reviews and ratings</p>
        </div>
        <div className="flex items-center gap-3">
          {branches.length > 0 && (
            <Select value={selectedBranchId || "__all__"} onValueChange={(val) => setSelectedBranchId(val === "__all__" ? "" : val)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Branches</SelectItem>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="text-muted-foreground text-sm">Total Reviews</div>
          <div className="text-2xl font-bold">{feedbacks.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-muted-foreground text-sm">Average Rating</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{averageRating}</span>
            <StarRating rating={Math.round(parseFloat(averageRating))} />
          </div>
        </Card>
        <Card className="p-4 hidden sm:block">
          <div className="text-muted-foreground text-sm">5-Star Reviews</div>
          <div className="text-2xl font-bold">
            {feedbacks.filter((f) => f.rating === 5).length}
          </div>
        </Card>
      </div>

      <Card>
        <div className="max-h-[600px] overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Branch</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="hidden md:table-cell">Customer</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-36" /></TableCell>
                  </TableRow>
                ))
              ) : feedbacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="mx-auto mb-3 h-10 w-10 opacity-50" />
                    <p>No feedback found.</p>
                    <p className="text-xs mt-1">Feedback will appear here when customers submit reviews.</p>
                  </TableCell>
                </TableRow>
              ) : (
                feedbacks.map((fb) => (
                  <TableRow key={fb.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{fb.branch?.name_en || '—'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StarRating rating={fb.rating} />
                        <span className="text-muted-foreground text-xs">{fb.rating}.0</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {fb.customerName || (
                        <span className="text-muted-foreground text-xs">Anonymous</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate text-sm">{fb.feedbackMessage || '—'}</p>
                      <div className="sm:hidden mt-1">
                        <Badge variant="outline" className="text-xs">{fb.branch?.name_en || '—'}</Badge>
                        <span className="text-muted-foreground text-xs ml-2">{formatDate(fb.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                      {formatDate(fb.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
