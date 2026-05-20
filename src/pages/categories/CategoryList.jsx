import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories, useDeleteCategory } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Plus,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  FolderKanban,
  Filter,
} from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

export default function CategoryList() {
  const navigate = useNavigate();
  const { data: categories = [], isLoading } = useCategories();
  const deleteMutation = useDeleteCategory();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    category: null,
  });

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterActive === 'all' ||
      (filterActive === 'active' && category.isActive) ||
      (filterActive === 'inactive' && !category.isActive);

    return matchesSearch && matchesFilter;
  });

  const handleDelete = async () => {
    if (deleteDialog.category) {
      await deleteMutation.mutateAsync(deleteDialog.category._id);
      setDeleteDialog({ open: false, category: null });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] p-6 space-y-6">
        <Skeleton className="h-12 w-72 rounded-xl" />
        <Skeleton className="h-[480px] rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <div className="border-b border-[#E8DED3] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#C9A06C]/10 px-3 py-1 text-xs font-semibold text-[#9B743F]">
              <Sparkles size={14} />
              Category Management
            </div>

            <h1 className="text-2xl font-bold text-[#2A1416] sm:text-3xl">
              Categories
            </h1>

            <p className="mt-1 text-sm text-[#7A6A62]">
              {filteredCategories.length}{' '}
              {filteredCategories.length === 1 ? 'category' : 'categories'} found
            </p>
          </div>

          <Button
            onClick={() => navigate('/categories/create')}
            className="rounded-xl bg-[#C9A06C] px-5 text-white hover:bg-[#B88D57]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl border border-[#E8DED3] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#2A1416]">
            <Filter size={16} className="text-[#C9A06C]" />
            Filters
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A7B72]" />

              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] pl-11 focus:border-[#C9A06C]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {['all', 'active', 'inactive'].map((status) => (
                <Button
                  key={status}
                  type="button"
                  variant="outline"
                  onClick={() => setFilterActive(status)}
                  className={`h-12 rounded-xl capitalize ${
                    filterActive === status
                      ? 'border-[#C9A06C] bg-[#C9A06C] text-white hover:bg-[#B88D57]'
                      : 'border-[#E2D5C5] bg-white text-[#2A1416] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#E8DED3] bg-white shadow-sm">
          {filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#C9A06C]/10">
                <FolderKanban className="h-9 w-9 text-[#C9A06C]" />
              </div>

              <p className="mb-1 text-lg font-semibold text-[#2A1416]">
                No categories found
              </p>

              <p className="mb-6 text-sm text-[#7A6A62]">
                Try changing filters or create a new category.
              </p>

              <Button
                onClick={() => navigate('/categories/create')}
                className="rounded-xl bg-[#C9A06C] text-white hover:bg-[#B88D57]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#E8DED3] bg-[#FAF7F2]">
                    <TableHead className="text-xs font-semibold text-[#7A6A62]">
                      Image
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[#7A6A62]">
                      Category
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[#7A6A62]">
                      Description
                    </TableHead>
                    <TableHead className="text-center text-xs font-semibold text-[#7A6A62]">
                      Order
                    </TableHead>
                    <TableHead className="text-center text-xs font-semibold text-[#7A6A62]">
                      Status
                    </TableHead>
                    <TableHead className="text-right text-xs font-semibold text-[#7A6A62]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow
                      key={category._id}
                      className="border-b border-[#F1E8DD] hover:bg-[#FCFAF7]"
                    >
                      <TableCell className="py-4">
                        {category.imageUrl ? (
                          <img
                            src={getImageUrl(category.imageUrl)}
                            alt={category.name}
                            className="h-14 w-14 rounded-2xl border border-[#E8DED3] object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E8DED3] bg-[#FAF7F2]">
                            <ImageIcon className="h-6 w-6 text-[#B8A99B]" />
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <p className="font-semibold text-[#2A1416]">
                          {category.name}
                        </p>
                      </TableCell>

                      <TableCell className="max-w-md truncate text-sm text-[#7A6A62]">
                        {category.description || '-'}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className="border-[#E2D5C5] bg-[#FAF7F2] text-[#7A6A62]"
                        >
                          {category.displayOrder}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          className={
                            category.isActive
                              ? 'border-0 bg-green-100 text-green-700'
                              : 'border-0 bg-gray-100 text-gray-600'
                          }
                        >
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/categories/edit/${category._id}`)
                            }
                            className="rounded-xl text-[#7A6A62] hover:bg-[#C9A06C]/10 hover:text-[#C9A06C]"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDeleteDialog({ open: true, category })
                            }
                            className="rounded-xl text-[#7A6A62] hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, category: null })
        }
      >
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#2A1416]">
              Delete Category
            </DialogTitle>

            <DialogDescription>
              Are you sure you want to delete "
              {deleteDialog.category?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDialog({ open: false, category: null })
              }
              className="rounded-xl border-[#E2D5C5]"
            >
              Cancel
            </Button>

            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isLoading}
              className="rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}