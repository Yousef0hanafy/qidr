'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, QrCode, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
  slug: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  tiktok?: string;
  snapchat?: string;
  facebook?: string;
  websiteUrl?: string;
  googleMapLink?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BranchFormData {
  name_ar: string;
  name_en: string;
  slug: string;
  address: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  tiktok: string;
  snapchat: string;
  facebook: string;
  websiteUrl: string;
  googleMapLink: string;
}

const emptyForm: BranchFormData = {
  name_ar: '',
  name_en: '',
  slug: '',
  address: '',
  phone: '',
  whatsapp: '',
  instagram: '',
  tiktok: '',
  snapchat: '',
  facebook: '',
  websiteUrl: '',
  googleMapLink: '',
};

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);
  const [form, setForm] = useState<BranchFormData>(emptyForm);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrBranch, setQrBranch] = useState<Branch | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  const fetchBranches = useCallback(async () => {
    try {
      const res = await fetch('/api/branches');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBranches(data);
    } catch {
      toast.error('Failed to load branches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const openCreateDialog = () => {
    setEditingBranch(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (branch: Branch) => {
    setEditingBranch(branch);
    setForm({
      name_ar: branch.name_ar,
      name_en: branch.name_en,
      slug: branch.slug,
      address: branch.address || '',
      phone: branch.phone || '',
      whatsapp: branch.whatsapp || '',
      instagram: branch.instagram || '',
      tiktok: branch.tiktok || '',
      snapchat: branch.snapchat || '',
      facebook: branch.facebook || '',
      websiteUrl: branch.websiteUrl || '',
      googleMapLink: branch.googleMapLink || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name_ar || !form.name_en || !form.slug) {
      toast.error('Name (Arabic), Name (English), and Slug are required');
      return;
    }

    setSaving(true);
    try {
      if (editingBranch) {
        const res = await fetch(`/api/branches/${editingBranch.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to update');
        }
        toast.success('Branch updated successfully');
      } else {
        const res = await fetch('/api/branches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to create');
        }
        toast.success('Branch created successfully');
      }
      setDialogOpen(false);
      fetchBranches();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (branch: Branch) => {
    try {
      const res = await fetch(`/api/branches/${branch.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !branch.isActive }),
      });
      if (!res.ok) throw new Error('Failed to toggle');
      toast.success(`Branch ${branch.isActive ? 'deactivated' : 'activated'}`);
      fetchBranches();
    } catch {
      toast.error('Failed to update branch status');
    }
  };

  const handleDelete = async () => {
    if (!deletingBranch) return;
    try {
      const res = await fetch(`/api/branches/${deletingBranch.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Branch deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingBranch(null);
      fetchBranches();
    } catch {
      toast.error('Failed to delete branch');
    }
  };

  const handleGenerateQR = async (branch: Branch) => {
    setQrBranch(branch);
    setQrDialogOpen(true);
    setQrLoading(true);
    setQrDataUrl('');
    try {
      const res = await fetch(`/api/qr?branchId=${branch.id}&slug=${branch.slug}`);
      if (!res.ok) throw new Error('Failed to generate QR code');
      const data = await res.json();
      setQrDataUrl(data.qrCode);
    } catch {
      toast.error('Failed to generate QR code');
    } finally {
      setQrLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl || !qrBranch) return;
    const link = document.createElement('a');
    link.download = `qr-${qrBranch.slug}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const updateForm = (key: keyof BranchFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Branches</h1>
          <p className="text-muted-foreground text-sm">Manage your restaurant branches</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Branch
        </Button>
      </div>

      <Card>
        <div className="max-h-[600px] overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name (AR)</TableHead>
                <TableHead>Name (EN)</TableHead>
                <TableHead className="hidden md:table-cell">Slug</TableHead>
                <TableHead className="hidden lg:table-cell">Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : branches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No branches found. Click &quot;Add Branch&quot; to create one.
                  </TableCell>
                </TableRow>
              ) : (
                branches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell className="font-medium">{branch.name_ar}</TableCell>
                    <TableCell>{branch.name_en}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{branch.slug}</TableCell>
                    <TableCell className="hidden lg:table-cell">{branch.phone || '—'}</TableCell>
                    <TableCell>
                      <Switch
                        checked={branch.isActive}
                        onCheckedChange={() => handleToggleActive(branch)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleGenerateQR(branch)} title="QR Code">
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(branch)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingBranch(branch);
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBranch ? 'Edit Branch' : 'Add Branch'}</DialogTitle>
            <DialogDescription>
              {editingBranch ? 'Update branch details below.' : 'Fill in the details for the new branch.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name_ar">Name (Arabic) *</Label>
                <Input
                  id="name_ar"
                  value={form.name_ar}
                  onChange={(e) => updateForm('name_ar', e.target.value)}
                  placeholder="اسم الفرع"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_en">Name (English) *</Label>
                <Input
                  id="name_en"
                  value={form.name_en}
                  onChange={(e) => updateForm('name_en', e.target.value)}
                  placeholder="Branch Name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => updateForm('slug', e.target.value)}
                placeholder="branch-slug"
                disabled={!!editingBranch}
              />
              {editingBranch && (
                <p className="text-muted-foreground text-xs">Slug cannot be changed after creation.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => updateForm('address', e.target.value)}
                placeholder="123 Main St"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  placeholder="+966 5x xxx xxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={form.whatsapp}
                  onChange={(e) => updateForm('whatsapp', e.target.value)}
                  placeholder="+966 5x xxx xxxx"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={form.instagram}
                  onChange={(e) => updateForm('instagram', e.target.value)}
                  placeholder="@handle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktok">TikTok</Label>
                <Input
                  id="tiktok"
                  value={form.tiktok}
                  onChange={(e) => updateForm('tiktok', e.target.value)}
                  placeholder="@handle"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="snapchat">Snapchat</Label>
                <Input
                  id="snapchat"
                  value={form.snapchat}
                  onChange={(e) => updateForm('snapchat', e.target.value)}
                  placeholder="@handle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={form.facebook}
                  onChange={(e) => updateForm('facebook', e.target.value)}
                  placeholder="facebook.com/page"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website</Label>
                <Input
                  id="websiteUrl"
                  value={form.websiteUrl}
                  onChange={(e) => updateForm('websiteUrl', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="googleMapLink">Google Maps Link</Label>
                <Input
                  id="googleMapLink"
                  value={form.googleMapLink}
                  onChange={(e) => updateForm('googleMapLink', e.target.value)}
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingBranch ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Branch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingBranch?.name_en}&quot;? This action cannot be
              undone and will remove all associated data including items, variants, promotions, and feedback.
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

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code - {qrBranch?.name_en}</DialogTitle>
            <DialogDescription>
              Scan this QR code to access the menu for this branch.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {qrLoading ? (
              <Skeleton className="h-64 w-64 rounded-lg" />
            ) : qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code" className="h-64 w-64 rounded-lg border" />
            ) : (
              <p className="text-muted-foreground">Failed to load QR code.</p>
            )}
            <div className="text-center">
              <p className="text-sm font-medium">{qrBranch?.name_ar}</p>
              <p className="text-muted-foreground text-xs">/{qrBranch?.slug}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQrDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleDownloadQR} disabled={!qrDataUrl}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
