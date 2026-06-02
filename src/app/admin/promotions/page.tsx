'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Upload, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Branch {
  id: string;
  name_ar: string;
  name_en: string;
}

interface PromotionBranch {
  promotionId: string;
  branchId: string;
  branch?: Branch;
}

interface Promotion {
  id: string;
  title_ar: string;
  title_en: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  branches?: PromotionBranch[];
}

interface PromotionFormData {
  title_ar: string;
  title_en: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  active: boolean;
  branchIds: string[];
}

const emptyForm: PromotionFormData = {
  title_ar: '',
  title_en: '',
  imageUrl: '',
  startDate: '',
  endDate: '',
  active: true,
  branchIds: [],
};

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.url;
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [deletingPromotion, setDeletingPromotion] = useState<Promotion | null>(null);
  const [form, setForm] = useState<PromotionFormData>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPromotions = useCallback(async () => {
    try {
      const res = await fetch('/api/promotions');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPromotions(data);
    } catch {
      toast.error('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBranches = useCallback(async () => {
    try {
      const res = await fetch('/api/branches');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBranches(data);
    } catch {
      toast.error('Failed to load branches');
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchPromotions(), fetchBranches()]);
  }, [fetchPromotions, fetchBranches]);

  const openCreateDialog = () => {
    setEditingPromotion(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (promo: Promotion) => {
    setEditingPromotion(promo);
    setForm({
      title_ar: promo.title_ar,
      title_en: promo.title_en,
      imageUrl: promo.imageUrl || '',
      startDate: promo.startDate ? promo.startDate.split('T')[0] : '',
      endDate: promo.endDate ? promo.endDate.split('T')[0] : '',
      active: promo.active,
      branchIds: promo.branches?.map((b) => b.branchId) || [],
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleBranch = (branchId: string) => {
    setForm((prev) => ({
      ...prev,
      branchIds: prev.branchIds.includes(branchId)
        ? prev.branchIds.filter((id) => id !== branchId)
        : [...prev.branchIds, branchId],
    }));
  };

  const handleSave = async () => {
    if (!form.title_ar || !form.title_en || !form.startDate || !form.endDate) {
      toast.error('Title (Arabic), Title (English), Start Date, and End Date are required');
      return;
    }

    setSaving(true);
    try {
      const promoData = {
        title_ar: form.title_ar,
        title_en: form.title_en,
        imageUrl: form.imageUrl || null,
        startDate: form.startDate,
        endDate: form.endDate,
        active: form.active,
        branchIds: form.branchIds,
      };

      if (editingPromotion) {
        const res = await fetch(`/api/promotions/${editingPromotion.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(promoData),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to update');
        }
        toast.success('Promotion updated successfully');
      } else {
        const res = await fetch('/api/promotions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(promoData),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to create');
        }
        toast.success('Promotion created successfully');
      }
      setDialogOpen(false);
      fetchPromotions();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPromotion) return;
    try {
      const res = await fetch(`/api/promotions/${deletingPromotion.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Promotion deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingPromotion(null);
      fetchPromotions();
    } catch {
      toast.error('Failed to delete promotion');
    }
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Promotions</h1>
          <p className="text-muted-foreground text-sm">Manage your promotional offers</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Promotion
        </Button>
      </div>

      <Card>
        <div className="max-h-[600px] overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title (AR)</TableHead>
                <TableHead>Title (EN)</TableHead>
                <TableHead className="hidden md:table-cell">Period</TableHead>
                <TableHead className="hidden lg:table-cell">Branches</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-10 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-36" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : promotions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No promotions found. Click &quot;Add Promotion&quot; to create one.
                  </TableCell>
                </TableRow>
              ) : (
                promotions.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell>
                      {promo.imageUrl ? (
                        <img
                          src={promo.imageUrl}
                          alt={promo.title_en}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{promo.title_ar}</TableCell>
                    <TableCell>{promo.title_en}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs">
                      {formatDate(promo.startDate)} — {formatDate(promo.endDate)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant="secondary">{promo.branches?.length ?? 0}</Badge>
                    </TableCell>
                    <TableCell>
                      {isExpired(promo.endDate) ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : promo.active ? (
                        <Badge>Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(promo)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingPromotion(promo);
                            setDeleteDialogOpen(true);
                          }}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPromotion ? 'Edit Promotion' : 'Add Promotion'}</DialogTitle>
            <DialogDescription>
              {editingPromotion ? 'Update promotion details below.' : 'Fill in the details for the new promotion.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="promo_title_ar">Title (Arabic) *</Label>
                <Input
                  id="promo_title_ar"
                  value={form.title_ar}
                  onChange={(e) => setForm((prev) => ({ ...prev, title_ar: e.target.value }))}
                  placeholder="عنوان العرض"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promo_title_en">Title (English) *</Label>
                <Input
                  id="promo_title_en"
                  value={form.title_en}
                  onChange={(e) => setForm((prev) => ({ ...prev, title_en: e.target.value }))}
                  placeholder="Promotion Title"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="promo_start">Start Date *</Label>
                <Input
                  id="promo_start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promo_end">End Date *</Label>
                <Input
                  id="promo_end"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.active}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, active: checked }))}
              />
              <Label>Active</Label>
            </div>

            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex items-start gap-4">
                {form.imageUrl ? (
                  <div className="relative">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="h-20 w-20 rounded-md border object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-5 w-5"
                      onClick={() => setForm((prev) => ({ ...prev, imageUrl: '' }))}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-md border-2 border-dashed bg-muted/50">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Assign to Branches</Label>
              <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
                {branches.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No branches available. Create branches first.</p>
                ) : (
                  branches.map((branch) => (
                    <div key={branch.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`branch_${branch.id}`}
                        checked={form.branchIds.includes(branch.id)}
                        onCheckedChange={() => toggleBranch(branch.id)}
                      />
                      <Label htmlFor={`branch_${branch.id}`} className="text-sm cursor-pointer">
                        {branch.name_en} / {branch.name_ar}
                      </Label>
                    </div>
                  ))
                )}
              </div>
              <p className="text-muted-foreground text-xs">
                Leave empty to apply to all branches.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingPromotion ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Promotion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingPromotion?.title_en}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
