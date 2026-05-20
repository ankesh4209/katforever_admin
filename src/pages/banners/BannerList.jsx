import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBanners, useDeleteBanner, useToggleBanner } from '@/hooks/useBanners';
import { Button } from '@/components/ui/button';
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
  Edit,
  Trash2,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

export default function BannerList() {
  const navigate = useNavigate();
  const { data: banners = [], isLoading } = useBanners();
  const deleteMutation = useDeleteBanner();
  const toggleMutation = useToggleBanner();

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    banner: null,
  });

  const handleDelete = async () => {
    if (deleteDialog.banner) {
      await deleteMutation.mutateAsync(deleteDialog.banner._id);
      setDeleteDialog({ open: false, banner: null });
    }
  };

  const handleToggle = async (id) => {
    await toggleMutation.mutateAsync(id);
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
              Banner Management
            </div>

            <h1 className="text-2xl font-bold text-[#2A1416] sm:text-3xl">
              Banners
            </h1>

            <p className="mt-1 text-sm text-[#7A6A62]">
              {banners.length} {banners.length === 1 ? 'banner' : 'banners'} found
            </p>
          </div>

          <Button
            onClick={() => navigate('/banners/create')}
            className="rounded-xl bg-[#C9A06C] px-5 text-white hover:bg-[#B88D57]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Banner
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-[#E8DED3] bg-white shadow-sm">
          {banners.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#C9A06C]/10">
                <ImageIcon className="h-9 w-9 text-[#C9A06C]" />
              </div>

              <p className="mb-1 text-lg font-semibold text-[#2A1416]">
                No banners found
              </p>

              <p className="mb-6 text-sm text-[#7A6A62]">
                Create a new banner for your homepage or offer section.
              </p>

              <Button
                onClick={() => navigate('/banners/create')}
                className="rounded-xl bg-[#C9A06C] text-white hover:bg-[#B88D57]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Banner
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#E8DED3] bg-[#FAF7F2]">
                    <TableHead className="text-xs font-semibold text-[#7A6A62]">
                      Preview
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[#7A6A62]">
                      Banner
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[#7A6A62]">
                      Link
                    </TableHead>
                    <TableHead className="text-center text-xs font-semibold text-[#7A6A62]">
                      Order
                    </TableHead>
                    <TableHead className="text-center text-xs font-semibold text-[#7A6A62]">
                      Status
                    </TableHead>
                    <TableHead className="text-center text-xs font-semibold text-[#7A6A62]">
                      Dates
                    </TableHead>
                    <TableHead className="text-right text-xs font-semibold text-[#7A6A62]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {banners.map((banner) => (
                    <TableRow
                      key={banner._id}
                      className="border-b border-[#F1E8DD] hover:bg-[#FCFAF7]"
                    >
                      <TableCell className="py-4">
                        <img
                          src={getImageUrl(banner.imageUrl)}
                          alt={banner.title}
                          className="h-14 w-36 rounded-2xl border border-[#E8DED3] object-cover"
                        />
                      </TableCell>

                      <TableCell>
                        <p className="font-semibold text-[#2A1416]">
                          {banner.title || (
                            <span className="italic text-[#9A8D84]">
                              No Title
                            </span>
                          )}
                        </p>
                      </TableCell>

                      <TableCell className="max-w-xs truncate text-sm text-[#7A6A62]">
                        {banner.link || '-'}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className="border-[#E2D5C5] bg-[#FAF7F2] text-[#7A6A62]"
                        >
                          {banner.displayOrder}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggle(banner._id)}
                          disabled={toggleMutation.isLoading}
                          className="p-0 hover:bg-transparent"
                        >
                          {banner.isActive ? (
                            <Badge className="border-0 bg-green-100 text-green-700">
                              <Eye className="mr-1 h-3 w-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="border-0 bg-gray-100 text-gray-600">
                              <EyeOff className="mr-1 h-3 w-3" />
                              Inactive
                            </Badge>
                          )}
                        </Button>
                      </TableCell>

                      <TableCell className="text-center text-xs text-[#7A6A62]">
                        <div>
                          {banner.startDate
                            ? new Date(banner.startDate).toLocaleDateString()
                            : '-'}
                        </div>

                        {banner.endDate && (
                          <div className="text-[#9A8D84]">
                            to {new Date(banner.endDate).toLocaleDateString()}
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/banners/edit/${banner._id}`)}
                            className="rounded-xl text-[#7A6A62] hover:bg-[#C9A06C]/10 hover:text-[#C9A06C]"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteDialog({ open: true, banner })}
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
        onOpenChange={(open) => setDeleteDialog({ open, banner: null })}
      >
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#2A1416]">
              Delete Banner
            </DialogTitle>

            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.banner?.title}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, banner: null })}
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