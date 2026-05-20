import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Upload, X, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import ImageCropper from '@/components/ImageCropper';

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: product, isLoading } = useProduct(id);
    const updateMutation = useUpdateProduct();
    const deleteMutation = useDeleteProduct();
    const { data: categories = [] } = useCategories();

    const [sections, setSections] = useState([]);

    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        description: '',
        mrp: '',
        price: '',
        discount: '',
        categoryId: '',
        stock: '',
        images: [],
        availableSizes: [],
        availableColors: [],
        isTrending: false,
        isActive: true,
        isCODAvailable: true,
    });

    const [errors, setErrors] = useState({});
    const [uploadingImage, setUploadingImage] = useState(false);
    const [cropperOpen, setCropperOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(false);



    useEffect(() => {
        if (product) {
            setFormData({
                sku: product.sku || '',
                name: product.name || '',
                description: product.description || '',
                mrp: product.mrp?.toString() || '',
                price: product.price?.toString() || '',
                discount: product.discount?.toString() || '',
                categoryId: product.categoryId || '',
                stock: product.stock?.toString() || '',
                images: product.images || [],
                availableSizes: product.availableSizes || [],
                availableColors: product.availableColors || [],
                isTrending: product.isTrending || false,
                isActive: product.isActive !== undefined ? product.isActive : true,
            });
            if (product.additionalSections && Array.isArray(product.additionalSections)) {
                setSections(product.additionalSections);
            }
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setErrors(prev => ({ ...prev, images: 'Only image files are allowed' }));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, images: 'Image size must be less than 5MB' }));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImage(reader.result);
            setCropperOpen(true);
        };
        reader.readAsDataURL(file);

        e.target.value = null;
    };

    const handleCropComplete = async (croppedFile) => {
        await handleUpload(croppedFile);
    };

    const handleUpload = async (file) => {
        setUploadingImage(true);
        try {
            const formDataToUpload = new FormData();
            formDataToUpload.append('image', file);

            const { data } = await api.post('/upload', formDataToUpload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, data.imageUrl],
            }));
            setErrors(prev => ({ ...prev, images: '' }));
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                images: error.response?.data?.message || 'Failed to upload image'
            }));
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const toggleSize = (size) => {
        setFormData(prev => ({
            ...prev,
            availableSizes: prev.availableSizes.includes(size)
                ? prev.availableSizes.filter(s => s !== size)
                : [...prev.availableSizes, size],
        }));
    };

    const toggleColor = (color) => {
        setFormData(prev => ({
            ...prev,
            availableColors: prev.availableColors.includes(color)
                ? prev.availableColors.filter(c => c !== color)
                : [...prev.availableColors, color],
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.price) newErrors.price = 'Price is required';
        if (!formData.categoryId) newErrors.categoryId = 'Category is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSectionChange = (index, field, value) => {
        const newSections = [...sections];
        newSections[index][field] = value;
        setSections(newSections);
    };

    const addSection = () => {
        setSections([...sections, { title: '', content: '' }]);
    };

    const removeSection = (index) => {
        const newSections = sections.filter((_, i) => i !== index);
        setSections(newSections);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const productData = {
            ...formData,
            additionalSections: sections,
            mrp: formData.mrp ? parseFloat(formData.mrp) : 0,
            price: parseFloat(formData.price),
            discount: formData.discount ? parseFloat(formData.discount) : 0,
            stock: parseInt(formData.stock) || 0,
        };

        try {
            await updateMutation.mutateAsync({ id, data: productData });
            navigate('/products');
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(id);
            navigate('/products');
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 space-y-6">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-96" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Product not found</p>
                    <Button onClick={() => navigate('/products')}>Back to Products</Button>
                </div>
            </div>
        );
    }

return (
  <div className="min-h-screen bg-[#F8F6F2]">
    <div className="sticky top-0 z-30 border-b border-[#E8DED3] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#C9A06C]/10 px-3 py-1 text-xs font-semibold text-[#9B743F]">
            Edit Product
          </div>

          <h1 className="text-2xl font-bold text-[#2A1416] sm:text-3xl">
            Update Product
          </h1>

          <p className="mt-1 text-sm text-[#7A6A62]">
            Update product information, pricing, images and visibility.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setDeleteDialog(true)}
            className="rounded-xl border-red-200 bg-white text-red-600 hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/products')}
            className="rounded-xl border-[#E2D5C5] bg-white text-[#2A1416] hover:bg-[#FAF7F2]"
          >
            Discard
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={updateMutation.isLoading}
            className="rounded-xl bg-[#C9A06C] px-6 text-white hover:bg-[#B88D57]"
          >
            {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>

    <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="rounded-3xl border-[#E8DED3] bg-white shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <h3 className="mb-6 text-lg font-semibold text-[#2A1416]">
                  Basic Information
                </h3>

                <div className="space-y-5">
                  <div>
                    <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                      SKU <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className={`h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C] ${errors.sku ? 'border-red-500' : ''}`}
                    />
                    {errors.sku && <p className="mt-1 text-sm text-red-500">{errors.sku}</p>}
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C] ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                      Description
                    </Label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      className="resize-none rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-[#E8DED3] bg-white shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#2A1416]">
                    Additional Sections
                  </h3>

                  <Button
                    type="button"
                    onClick={addSection}
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-[#E2D5C5] bg-[#FAF7F2] hover:bg-[#C9A06C] hover:text-white"
                  >
                    + Add
                  </Button>
                </div>

                <div className="space-y-4">
                  {sections.map((section, index) => (
                    <div
                      key={index}
                      className="relative rounded-2xl border border-[#E8DED3] bg-[#FAF7F2] p-4"
                    >
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#7A6A62] hover:bg-red-50 hover:text-red-500"
                      >
                        <X size={15} />
                      </button>

                      <div className="space-y-4 pr-10">
                        <Input
                          value={section.title}
                          onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                          placeholder="Section title"
                          className="h-12 rounded-xl border-[#E2D5C5] bg-white focus:border-[#C9A06C]"
                        />

                        <Textarea
                          value={section.content}
                          onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                          placeholder="Section content"
                          rows={3}
                          className="resize-none rounded-xl border-[#E2D5C5] bg-white focus:border-[#C9A06C]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-[#E8DED3] bg-white shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <h3 className="mb-6 text-lg font-semibold text-[#2A1416]">
                  Product Images
                </h3>

                {formData.images.length > 0 && (
                  <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {formData.images.map((img, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden rounded-2xl border border-[#E8DED3] bg-[#FAF7F2]"
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`Product ${index + 1}`}
                          className="h-32 w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-500 shadow"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <label
                  htmlFor="imageUpload"
                  className="block cursor-pointer rounded-3xl border-2 border-dashed border-[#D9C8B3] bg-[#FCFAF7] p-10 text-center transition hover:border-[#C9A06C] hover:bg-[#FFF9F1]"
                >
                  {uploadingImage ? (
                    <p className="text-sm text-[#7A6A62]">Uploading...</p>
                  ) : (
                    <>
                      <Upload className="mx-auto mb-4 h-12 w-12 text-[#C9A06C]" />
                      <p className="text-sm font-medium text-[#2A1416]">
                        Add more images or <span className="text-[#C9A06C]">Browse</span>
                      </p>
                      <p className="mt-1 text-xs text-[#8A7B72]">
                        JPG, PNG, GIF, WEBP supported. Max 5MB.
                      </p>
                    </>
                  )}
                </label>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-[#E8DED3] bg-white shadow-sm lg:sticky lg:top-28">
              <CardContent className="p-6">
                <h3 className="mb-5 text-lg font-semibold text-[#2A1416]">
                  Product Settings
                </h3>

                <div className="space-y-5">
                  <div>
                    <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                      Category <span className="text-red-500">*</span>
                    </Label>

                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className={`h-12 w-full rounded-xl border bg-[#FCFAF7] px-3 text-sm outline-none focus:border-[#C9A06C] ${errors.categoryId ? 'border-red-500' : 'border-[#E2D5C5]'}`}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3 rounded-2xl bg-[#FAF7F2] p-4">
                    {[
                      { id: 'isActive', label: 'Active on website' },
                      { id: 'isTrending', label: 'Mark as Trending' },
                      { id: 'isCODAvailable', label: 'Cash on Delivery' },
                    ].map((item) => (
                      <label
                        key={item.id}
                        htmlFor={item.id}
                        className="flex cursor-pointer items-center justify-between rounded-xl bg-white px-4 py-3"
                      >
                        <span className="text-sm font-medium text-[#2A1416]">
                          {item.label}
                        </span>

                        <input
                          id={item.id}
                          name={item.id}
                          type="checkbox"
                          checked={formData[item.id]}
                          onChange={handleChange}
                          className="h-4 w-4 accent-[#C9A06C]"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>

    <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{product?.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDeleteDialog(false)}
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

    <ImageCropper
      open={cropperOpen}
      onClose={() => setCropperOpen(false)}
      imageSrc={selectedImage}
      onCropComplete={handleCropComplete}
      aspectRatio={3 / 4}
      targetWidth={900}
      targetHeight={1200}
      title="Crop Product Image"
    />
  </div>
);
}
