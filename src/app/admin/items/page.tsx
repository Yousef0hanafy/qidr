'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Upload, ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Category {
  id: string;
  name_ar: string;
  name_en: string;
}

interface Variant {
  id?: string;
  branchId?: string;
  itemId?: string;
  variantName_ar: string;
  variantName_en: string;
  price: number;
  available: boolean;
  status: string;
}

interface Item {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  categoryId: string;
  imageUrl?: string;
  calories?: number;
  allergens?: string;
  nutritionalFacts?: string;
  isActive: boolean;
  createdAt: string;
  category?: Category;
  itemVariants?: Variant[];
}

interface ItemFormData {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  categoryId: string;
  imageUrl: string;
  calories: string;
  allergens: string;
  nutritionalFacts: string;
  isActive: boolean;
}

const emptyForm: ItemFormData = {
  name_ar: '',
  name_en: '',
  description_ar: '',
  description_en: '',
  categoryId: '',
  imageUrl: '',
  calories: '',
  allergens: '',
  nutritionalFacts: '',
  isActive: true,
};

const emptyVariant: Omit<Variant, 'id' | 'branchId' | 'itemId'> = {
  variantName_ar: '',
  variantName_en: '',
  price: 0,
  available: true,
  status: 'available',
};

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.url;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [branches, setBranches] = useState<{ id: string; name_en: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);
  const [form, setForm] = useState<ItemFormData>(emptyForm);
  const [variants, setVariants] = useState<Omit<Variant, 'id' | 'branchId' | 'itemId'>[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedBranchId) params.set('branchId', selectedBranchId);
      const res = await fetch(`/api/items?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [selectedBranchId]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCategories(data);
    } catch {
      toast.error('Failed to load categories');
    }
  }, []);

  const fetchBranches = useCallback(async () => {
    try {
      const res = await fetch('/api/branches');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBranches(data);
    } catch {
      // Silently fail for branches
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchItems(), fetchCategories(), fetchBranches()]);
  }, [fetchItems, fetchCategories, fetchBranches]);

  const openCreateDialog = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setVariants([{ ...emptyVariant }]);
    setDialogOpen(true);
  };

  const openEditDialog = (item: Item) => {
    setEditingItem(item);
    setForm({
      name_ar: item.name_ar,
      name_en: item.name_en,
      description_ar: item.description_ar || '',
      description_en: item.description_en || '',
      categoryId: item.categoryId,
      imageUrl: item.imageUrl || '',
      calories: item.calories?.toString() || '',
      allergens: item.allergens || '',
      nutritionalFacts: item.nutritionalFacts || '',
      isActive: item.isActive,
    });

    if (item.itemVariants && item.itemVariants.length > 0) {
      setVariants(
        item.itemVariants.map((v) => ({
          variantName_ar: v.variantName_ar,
          variantName_en: v.variantName_en,
          price: v.price,
          available: v.available,
          status: v.status,
          id: v.id,
          branchId: v.branchId,
          itemId: v.itemId,
        }))
      );
    } else {
      setVariants([{ ...emptyVariant }]);
    }

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

  const addVariant = () => {
    setVariants((prev) => [...prev, { ...emptyVariant }]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: string | number | boolean) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleSave = async () => {
    if (!form.name_ar || !form.name_en || !form.categoryId) {
      toast.error('Name (Arabic), Name (English), and Category are required');
      return;
    }

    // Validate variants
    const validVariants = variants.filter(
      (v) => v.variantName_ar && v.variantName_en && v.price > 0
    );
    if (validVariants.length === 0) {
      toast.error('At least one valid variant is required');
      return;
    }

    setSaving(true);
    try {
      const itemData = {
        name_ar: form.name_ar,
        name_en: form.name_en,
        description_ar: form.description_ar || null,
        description_en: form.description_en || null,
        categoryId: form.categoryId,
        imageUrl: form.imageUrl || null,
        calories: form.calories ? parseInt(form.calories) : null,
        allergens: form.allergens || null,
        nutritionalFacts: form.nutritionalFacts || null,
        isActive: form.isActive,
      };

      let itemId: string;

      if (editingItem) {
        const res = await fetch(`/api/items/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to update');
        }
        itemId = editingItem.id;
        toast.success('Item updated successfully');
      } else {
        const res = await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to create');
        }
        const item = await res.json();
        itemId = item.id;
        toast.success('Item created successfully');
      }

      // Save variants for all branches
      const branchToUse = selectedBranchId || branches[0]?.id;
      if (branchToUse) {
        // Delete existing variants for this item+branch
        if (editingItem) {
          const existingVariants = editingItem.itemVariants || [];
          for (const ev of existingVariants) {
            if (ev.branchId === branchToUse && ev.id) {
              await fetch(`/api/variants?id=${ev.id}`, { method: 'DELETE' });
            }
          }
        }

        // Create new variants
        for (const v of validVariants) {
          await fetch('/api/variants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              branchId: branchToUse,
              itemId,
              variantName_ar: v.variantName_ar,
              variantName_en: v.variantName_en,
              price: v.price,
              available: v.available,
              status: v.status,
            }),
          });
        }
      }

      setDialogOpen(false);
      fetchItems();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      const res = await fetch(`/api/items/${deletingItem.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Item deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingItem(null);
      fetchItems();
    } catch {
      toast.error('Failed to delete item');
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name_en || '—';
  };

  const getMinPrice = (item: Item) => {
    if (!item.itemVariants || item.itemVariants.length === 0) return '—';
    const prices = item.itemVariants.map((v) => v.price);
    return `SAR ${Math.min(...prices).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Items</h1>
          <p className="text-muted-foreground text-sm">Manage your menu items and variants</p>
        </div>
        <div className="flex items-center gap-3">
          {branches.length > 0 && (
            <Select value={selectedBranchId || "__all__"} onValueChange={(val) => setSelectedBranchId(val === "__all__" ? "" : val)}>
              <SelectTrigger className="w-40">
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
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      <Card>
        <div className="max-h-[600px] overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name (AR)</TableHead>
                <TableHead>Name (EN)</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell">Calories</TableHead>
                <TableHead className="hidden sm:table-cell">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-10 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No items found. Click &quot;Add Item&quot; to create one.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name_en}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.name_ar}</TableCell>
                    <TableCell>{item.name_en}</TableCell>
                    <TableCell className="hidden md:table-cell">{getCategoryName(item.categoryId)}</TableCell>
                    <TableCell className="hidden lg:table-cell">{item.calories || '—'}</TableCell>
                    <TableCell className="hidden sm:table-cell">{getMinPrice(item)}</TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? 'default' : 'secondary'}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingItem(item);
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
            <DialogTitle>{editingItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update item details below.' : 'Fill in the details for the new menu item.'}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="variants">Variants ({variants.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="item_name_ar">Name (Arabic) *</Label>
                  <Input
                    id="item_name_ar"
                    value={form.name_ar}
                    onChange={(e) => setForm((prev) => ({ ...prev, name_ar: e.target.value }))}
                    placeholder="اسم الصنف"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item_name_en">Name (English) *</Label>
                  <Input
                    id="item_name_en"
                    value={form.name_en}
                    onChange={(e) => setForm((prev) => ({ ...prev, name_en: e.target.value }))}
                    placeholder="Item Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="item_desc_ar">Description (Arabic)</Label>
                  <Input
                    id="item_desc_ar"
                    value={form.description_ar}
                    onChange={(e) => setForm((prev) => ({ ...prev, description_ar: e.target.value }))}
                    placeholder="وصف الصنف"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item_desc_en">Description (English)</Label>
                  <Input
                    id="item_desc_en"
                    value={form.description_en}
                    onChange={(e) => setForm((prev) => ({ ...prev, description_en: e.target.value }))}
                    placeholder="Item Description"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item_category">Category *</Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, categoryId: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name_en} / {cat.name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="item_calories">Calories</Label>
                  <Input
                    id="item_calories"
                    type="number"
                    value={form.calories}
                    onChange={(e) => setForm((prev) => ({ ...prev, calories: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
                  />
                  <Label>Active</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item_allergens">Allergens</Label>
                <Input
                  id="item_allergens"
                  value={form.allergens}
                  onChange={(e) => setForm((prev) => ({ ...prev, allergens: e.target.value }))}
                  placeholder="e.g., gluten, dairy, nuts"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="item_nutrition">Nutritional Facts</Label>
                <Input
                  id="item_nutrition"
                  value={form.nutritionalFacts}
                  onChange={(e) => setForm((prev) => ({ ...prev, nutritionalFacts: e.target.value }))}
                  placeholder="Nutritional information"
                />
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
            </TabsContent>

            <TabsContent value="variants" className="py-4">
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium">Variant #{index + 1}</p>
                      {variants.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeVariant(index)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Name (AR)</Label>
                        <Input
                          value={variant.variantName_ar}
                          onChange={(e) => updateVariant(index, 'variantName_ar', e.target.value)}
                          placeholder="صغير"
                          dir="rtl"
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Name (EN)</Label>
                        <Input
                          value={variant.variantName_en}
                          onChange={(e) => updateVariant(index, 'variantName_en', e.target.value)}
                          placeholder="Small"
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Price (SAR)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={variant.price || ''}
                          onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="h-8"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={variant.available}
                          onCheckedChange={(checked) => updateVariant(index, 'available', checked)}
                          className="scale-75"
                        />
                        <Label className="text-xs">Available</Label>
                      </div>
                      <div className="space-y-1">
                        <Select
                          value={variant.status}
                          onValueChange={(val) => updateVariant(index, 'status', val)}
                        >
                          <SelectTrigger className="h-8 w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                            <SelectItem value="hidden">Hidden</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                ))}

                <Button variant="outline" onClick={addVariant} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variant
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingItem?.name_en}&quot;? All associated variants will also
              be permanently deleted. This action cannot be undone.
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
