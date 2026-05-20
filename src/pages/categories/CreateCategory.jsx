import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCategory } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import ImageCropper from '@/components/ImageCropper';

export default function CreateCategory() {
    const navigate = useNavigate();
    const createMutation = useCreateCategory();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        displayOrder: 0,
        isActive: true,
    });

    const [errors, setErrors] = useState({});
    const [uploadingImage, setUploadingImage] = useState(false);
    const [cropperOpen, setCropperOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setErrors(prev => ({ ...prev, image: 'Only image files are allowed (JPEG, PNG, GIF, WEBP)' }));
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
            return;
        }

        // Open cropper with selected image
        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImage(reader.result);
            setCropperOpen(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = async (croppedFile) => {
        await handleUpload(croppedFile);
    };

    const handleUpload = async (file) => {
        const formDataToUpload = new FormData();
        formDataToUpload.append('image', file);

        setUploadingImage(true);
        try {
            const { data } = await api.post('/upload', formDataToUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Save only relative path, not full URL
            setFormData(prev => ({
                ...prev,
                imageUrl: data.imageUrl, // This is already "/uploads/image-123.jpg"
            }));
            setErrors(prev => ({ ...prev, image: '' }));
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                image: error.response?.data?.message || 'Failed to upload image'
            }));
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, imageUrl: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Category name is required';
        if (!formData.imageUrl) newErrors.image = 'Category image is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await createMutation.mutateAsync(formData);
            navigate('/categories');
        } catch (error) {
            console.error('Failed to create category:', error);
        }
    };

  // Return UI ko replace karo

return (
  <div className="min-h-screen bg-[#F8F6F2]">
    <div className=" top-0 z-30 border-b border-[#E8DED3] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div className="mb-2 inline-flex rounded-full bg-[#C9A06C]/10 px-3 py-1 text-xs font-semibold text-[#9B743F]">
            Category Management
          </div>

          <h1 className="text-2xl font-bold text-[#2A1416] sm:text-3xl">
            Add New Category
          </h1>

          <p className="mt-1 text-sm text-[#7A6A62]">
            Create a category with image, description and display order.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/categories')}
            className="rounded-xl border-[#E2D5C5] bg-white text-[#2A1416] hover:bg-[#FAF7F2]"
          >
            Discard
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={createMutation.isLoading}
            className="rounded-xl bg-[#C9A06C] px-6 text-white hover:bg-[#B88D57]"
          >
            {createMutation.isLoading ? 'Creating...' : 'Add Category'}
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
                      Category Name <span className="text-red-500">*</span>
                    </Label>

                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Sarees, Suits, Lehengas"
                      className={`h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C] ${
                        errors.name ? 'border-red-500' : ''
                      }`}
                    />

                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                      Description
                    </Label>

                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter category description..."
                      rows={6}
                      className="resize-none rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C]"
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                      Display Order
                    </Label>

                    <Input
                      name="displayOrder"
                      type="number"
                      value={formData.displayOrder}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className="h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C]"
                    />

                    <p className="mt-2 text-xs text-[#8A7B72]">
                      Lower numbers appear first.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-[#E8DED3] bg-white shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <h3 className="mb-6 text-lg font-semibold text-[#2A1416]">
                  Category Image <span className="text-red-500">*</span>
                </h3>

                {formData.imageUrl ? (
                  <div className="mx-auto max-w-sm">
                    <div className="relative overflow-hidden rounded-3xl border border-[#E8DED3] bg-[#FAF7F2]">
                      <img
                        src={getImageUrl(formData.imageUrl)}
                        alt="Category preview"
                        className="aspect-square w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition hover:bg-red-50"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
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
                        <div className="flex flex-col items-center">
                          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[#E8DED3] border-t-[#C9A06C]" />
                          <p className="text-sm text-[#7A6A62]">
                            Uploading...
                          </p>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto mb-4 h-12 w-12 text-[#C9A06C]" />

                          <p className="mb-1 text-sm font-medium text-[#2A1416]">
                            Drop category image here or{' '}
                            <span className="text-[#C9A06C]">Browse</span>
                          </p>

                          <p className="text-xs text-[#8A7B72]">
                            JPG, PNG, GIF, WEBP supported. Max 5MB.
                          </p>

                          <p className="mt-2 text-[10px] uppercase tracking-wider text-[#9A8D84]">
                            Image will be cropped to square 1:1
                          </p>
                        </>
                      )}
                    </label>

                    {errors.image && (
                      <p className="mt-2 text-center text-sm text-red-500">
                        {errors.image}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-[#E8DED3] bg-white shadow-sm lg:sticky lg:top-28">
              <CardContent className="p-6">
                <h3 className="mb-5 text-lg font-semibold text-[#2A1416]">
                  Category Settings
                </h3>

                <div className="space-y-4 rounded-2xl bg-[#FAF7F2] p-4">
                  <label
                    htmlFor="isActive"
                    className="flex cursor-pointer items-center justify-between rounded-xl bg-white px-4 py-3"
                  >
                    <span className="text-sm font-medium text-[#2A1416]">
                      Active on website
                    </span>

                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 accent-[#C9A06C]"
                    />
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-[#E8DED3] bg-[#FFF9F1] shadow-sm">
              <CardContent className="p-6">
                <h3 className="mb-3 text-sm font-semibold text-[#2A1416]">
                  Category Tips
                </h3>

                <ul className="space-y-2 text-xs leading-5 text-[#7A6A62]">
                  <li>• Use square images for best result</li>
                  <li>• Use clear and short category names</li>
                  <li>• Display order controls position</li>
                  <li>• Add category image for better UX</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>

    <ImageCropper
      open={cropperOpen}
      onClose={() => setCropperOpen(false)}
      imageSrc={selectedImage}
      onCropComplete={handleCropComplete}
      aspectRatio={1}
      targetWidth={800}
      targetHeight={800}
      title="Crop Category Image"
    />
  </div>
);
}
