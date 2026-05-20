import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
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
  Package,
  Sparkles,
  Filter,
} from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

export default function ProductList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const deleteMutation = useDeleteProduct();
  const { data: categories = [] } = useCategories();

  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [page, setPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });

  useEffect(() => {
    const paramSearch = searchParams.get('search') || '';
    if (paramSearch !== searchTerm) {
      setSearchTerm(paramSearch);
    }
  }, [searchParams, searchTerm]);

  const { data: productsData, isLoading } = useProducts({
    page,
    limit: 20,
    search: searchTerm,
    category: filterCategory,
    active: filterActive === 'all' ? '' : filterActive === 'active' ? 'true' : 'false',
  });

  const products = productsData?.products || [];
  const totalPages = productsData?.pages || 1;

  const handleDelete = async () => {
    if (deleteDialog.product) {
      await deleteMutation.mutateAsync(deleteDialog.product._id);
      setDeleteDialog({ open: false, product: null });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] p-6 space-y-6">
        <Skeleton className="h-12 w-72 rounded-xl" />
        <Skeleton className="h-[500px] rounded-3xl" />
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
              Product Management
            </div>

            <h1 className="text-2xl font-bold text-[#2A1416] sm:text-3xl">
              Products
            </h1>

            <p className="mt-1 text-sm text-[#7A6A62]">
              {productsData?.total || 0} {productsData?.total === 1 ? 'product' : 'products'} found
            </p>
          </div>

          <Button
            onClick={() => navigate('/products/create')}
            className="rounded-xl bg-[#C9A06C] px-5 text-white hover:bg-[#B88D57]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl border border-[#E8DED3] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#2A1416]">
            <Filter size={16} className="text-[#C9A06C]" />
            Filters
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A7B72]" />
              <Input
                placeholder="Search by product name, SKU..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] pl-11 focus:border-[#C9A06C]"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setPage(1);
              }}
              className="h-12 rounded-xl border border-[#E2D5C5] bg-[#FCFAF7] px-3 text-sm outline-none focus:border-[#C9A06C]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2">
              {['all', 'active', 'inactive'].map((status) => (
                <Button
                  key={status}
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFilterActive(status);
                    setPage(1);
                  }}
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
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#C9A06C]/10">
                <Package className="h-9 w-9 text-[#C9A06C]" />
              </div>

              <p className="mb-1 text-lg font-semibold text-[#2A1416]">
                No products found
              </p>

              <p className="mb-6 text-sm text-[#7A6A62]">
                Try changing filters or create a new product.
              </p>

              <Button
                onClick={() => navigate('/products/create')}
                className="rounded-xl bg-[#C9A06C] text-white hover:bg-[#B88D57]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[#E8DED3] bg-[#FAF7F2]">
                      <TableHead className="text-xs font-semibold text-[#7A6A62]">Image</TableHead>
                      <TableHead className="text-xs font-semibold text-[#7A6A62]">Product</TableHead>
                      <TableHead className="text-xs font-semibold text-[#7A6A62]">Category</TableHead>
                      <TableHead className="text-right text-xs font-semibold text-[#7A6A62]">Price</TableHead>
                      <TableHead className="text-center text-xs font-semibold text-[#7A6A62]">Stock</TableHead>
                      <TableHead className="text-center text-xs font-semibold text-[#7A6A62]">Status</TableHead>
                      <TableHead className="text-right text-xs font-semibold text-[#7A6A62]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id} className="border-b border-[#F1E8DD] hover:bg-[#FCFAF7]">
                        <TableCell className="py-4">
                          {product.images?.length > 0 ? (
                            <img
                              src={getImageUrl(product.images[0])}
                              alt={product.name}
                              className="h-14 w-14 rounded-2xl border border-[#E8DED3] object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E8DED3] bg-[#FAF7F2]">
                              <ImageIcon className="h-6 w-6 text-[#B8A99B]" />
                            </div>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-semibold text-[#2A1416]">
                              {product.name}
                            </p>

                            <p className="text-xs text-[#8A7B72]">
                              SKU: {product.sku || 'N/A'}
                            </p>

                            <div className="flex flex-wrap gap-2 pt-1">
                              {product.discount > 0 && (
                                <Badge className="border-0 bg-red-50 text-red-600">
                                  {product.discount}% OFF
                                </Badge>
                              )}

                              {product.isTrending && (
                                <Badge className="border-0 bg-[#C9A06C]/10 text-[#9B743F]">
                                  Trending
                                </Badge>
                              )}

                              {product.isCODAvailable === false && (
                                <Badge className="border-0 bg-purple-50 text-purple-600">
                                  Prepaid Only
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-sm text-[#7A6A62]">
                          {product.categoryName || '-'}
                        </TableCell>

                        <TableCell className="text-right font-semibold text-[#2A1416]">
                          ₹{product.price?.toLocaleString()}
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={
                              product.stock > 10
                                ? 'border-green-200 bg-green-50 text-green-700'
                                : product.stock > 0
                                ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                                : 'border-red-200 bg-red-50 text-red-700'
                            }
                          >
                            {product.stock}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge
                            className={
                              product.isActive
                                ? 'border-0 bg-green-100 text-green-700'
                                : 'border-0 bg-gray-100 text-gray-600'
                            }
                          >
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/products/edit/${product._id}`)}
                              className="rounded-xl text-[#7A6A62] hover:bg-[#C9A06C]/10 hover:text-[#C9A06C]"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteDialog({ open: true, product })}
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

              {totalPages > 1 && (
                <div className="flex flex-col gap-3 border-t border-[#E8DED3] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-[#7A6A62]">
                    Page {page} of {totalPages}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="rounded-xl border-[#E2D5C5]"
                    >
                      Previous
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="rounded-xl border-[#E2D5C5]"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, product: null })}
      >
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#2A1416]">
              Delete Product
            </DialogTitle>

            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.product?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, product: null })}
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