import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Sparkles, PackagePlus, IndianRupee, ImagePlus } from 'lucide-react';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import ImageCropper from '@/components/ImageCropper';

export default function CreateProduct() {
    const navigate = useNavigate();
    const createMutation = useCreateProduct();
    const { data: categories = [] } = useCategories();

    const [sections, setSections] = useState([
        { title: 'Product Details', content: '' },
        { title: 'Care Instructions', content: '' },
        { title: 'Shipping & Delivery Policy', content: '' }
    ]);

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

        if (!allowedTypes.includes(file.type)) {
            setErrors((prev) => ({ ...prev, images: 'Only image files are allowed' }));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, images: 'Image size must be less than 5MB' }));
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

            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, data.imageUrl],
            }));

            setErrors((prev) => ({ ...prev, images: '' }));
        } catch (error) {
            setErrors((prev) => ({
                ...prev,
                images: error.response?.data?.message || 'Failed to upload images',
            }));
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const toggleSize = (size) => {
        setFormData((prev) => ({
            ...prev,
            availableSizes: prev.availableSizes.includes(size)
                ? prev.availableSizes.filter((s) => s !== size)
                : [...prev.availableSizes, size],
        }));
    };

    const toggleColor = (color) => {
        setFormData((prev) => ({
            ...prev,
            availableColors: prev.availableColors.includes(color)
                ? prev.availableColors.filter((c) => c !== color)
                : [...prev.availableColors, color],
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.price) newErrors.price = 'Price is required';
        if (!formData.categoryId) newErrors.categoryId = 'Category is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';

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
        setSections(sections.filter((_, i) => i !== index));
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
            await createMutation.mutateAsync(productData);
            navigate('/products');
        } catch (error) {
            console.error('Failed to create product:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F6F2]">
            <div className="top-0 z-30 border-b border-[#E8DED3] bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#C9A06C]/10 px-3 py-1 text-xs font-semibold text-[#9B743F]">
                            <Sparkles size={14} />
                            Kat Forever Admin
                        </div>

                        <h1 className="text-2xl font-bold text-[#2A1416] sm:text-3xl">
                            Add New Product
                        </h1>

                        <p className="mt-1 text-sm text-[#7A6A62]">
                            Create a premium product listing with images, pricing and variants.
                        </p>
                    </div>

                    <div className="flex gap-3">
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
                            disabled={createMutation.isLoading}
                            className="rounded-xl bg-[#C9A06C] px-6 text-white hover:bg-[#B88D57]"
                        >
                            {createMutation.isLoading ? 'Adding...' : 'Add Product'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <Card className="overflow-hidden rounded-3xl border-[#E8DED3] bg-white shadow-sm">
                                <CardContent className="p-6 sm:p-8">
                                    <div className="mb-7 flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C9A06C]/10 text-[#C9A06C]">
                                            <PackagePlus size={22} />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-[#2A1416]">
                                                Basic Information
                                            </h3>
                                            <p className="text-sm text-[#7A6A62]">
                                                Add product identity and description.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                                                SKU <span className="text-red-500">*</span>
                                            </Label>

                                            <Input
                                                name="sku"
                                                value={formData.sku}
                                                onChange={handleChange}
                                                placeholder="e.g. katforever-product-001"
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
                                                placeholder="e.g. Banarasi Silk Saree"
                                                className={`h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C] ${errors.name ? 'border-red-500' : ''}`}
                                            />

                                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                                                Description <span className="text-red-500">*</span>
                                            </Label>

                                            <Textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                placeholder="Enter product description..."
                                                rows={5}
                                                className={`rounded-xl border-[#E2D5C5] bg-[#FCFAF7] resize-none focus:border-[#C9A06C] ${errors.description ? 'border-red-500' : ''}`}
                                            />

                                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden rounded-3xl border-[#E8DED3] bg-white shadow-sm">
                                <CardContent className="p-6 sm:p-8">
                                    <div className="mb-7 flex items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-[#2A1416]">
                                                Additional Sections
                                            </h3>
                                            <p className="text-sm text-[#7A6A62]">
                                                Add product details, care guide and delivery info.
                                            </p>
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={addSection}
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl border-[#E2D5C5] bg-[#FAF7F2] text-[#2A1416] hover:bg-[#C9A06C] hover:text-white"
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
                                                    <div>
                                                        <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                                                            Section Title {index + 1}
                                                        </Label>

                                                        <Input
                                                            value={section.title}
                                                            onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                                                            placeholder="e.g. Material & Fit"
                                                            className="h-12 rounded-xl border-[#E2D5C5] bg-white focus:border-[#C9A06C]"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                                                            Section Content
                                                        </Label>

                                                        <Textarea
                                                            value={section.content}
                                                            onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                                                            placeholder="Enter section description..."
                                                            rows={3}
                                                            className="rounded-xl border-[#E2D5C5] bg-white resize-none focus:border-[#C9A06C]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden rounded-3xl border-[#E8DED3] bg-white shadow-sm">
                                <CardContent className="p-6 sm:p-8">
                                    <div className="mb-7 flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C9A06C]/10 text-[#C9A06C]">
                                            <ImagePlus size={22} />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-[#2A1416]">
                                                Product Images
                                            </h3>
                                            <p className="text-sm text-[#7A6A62]">
                                                Upload high-quality product photos.
                                            </p>
                                        </div>
                                    </div>

                                    {formData.images.length > 0 && (
                                        <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                            {formData.images.map((img, index) => (
                                                <div key={index} className="relative overflow-hidden rounded-2xl border border-[#E8DED3] bg-[#FAF7F2]">
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
                                            <div className="flex flex-col items-center">
                                                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[#E8DED3] border-t-[#C9A06C]" />
                                                <p className="text-sm text-[#7A6A62]">Uploading...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="mx-auto mb-4 h-12 w-12 text-[#C9A06C]" />
                                                <p className="mb-1 text-sm font-medium text-[#2A1416]">
                                                    Drop images here or <span className="text-[#C9A06C]">Browse</span>
                                                </p>
                                                <p className="text-xs text-[#8A7B72]">
                                                    JPG, PNG, GIF, WEBP supported. Max 5MB each.
                                                </p>
                                            </>
                                        )}
                                    </label>

                                    {errors.images && <p className="mt-2 text-sm text-red-500">{errors.images}</p>}
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden rounded-3xl border-[#E8DED3] bg-white shadow-sm">
                                <CardContent className="p-6 sm:p-8">
                                    <div className="mb-7 flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C9A06C]/10 text-[#C9A06C]">
                                            <IndianRupee size={22} />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-[#2A1416]">
                                                Pricing & Stock
                                            </h3>
                                            <p className="text-sm text-[#7A6A62]">
                                                Set price, discount and inventory.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                        {[
                                            { label: 'MRP', name: 'mrp', placeholder: '0.00' },
                                            { label: 'Offer Price', name: 'price', placeholder: '0.00', required: true },
                                            { label: 'Discount (%)', name: 'discount', placeholder: '0' },
                                            { label: 'Stock', name: 'stock', placeholder: '0' },
                                        ].map((field) => (
                                            <div key={field.name}>
                                                <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                                </Label>

                                                <div className="relative">
                                                    {field.name !== 'discount' && field.name !== 'stock' && (
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6A62]">
                                                            ₹
                                                        </span>
                                                    )}

                                                    <Input
                                                        name={field.name}
                                                        type="number"
                                                        value={formData[field.name]}
                                                        onChange={handleChange}
                                                        placeholder={field.placeholder}
                                                        className={`${field.name !== 'discount' && field.name !== 'stock' ? 'pl-8' : ''} h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C] ${errors[field.name] ? 'border-red-500' : ''}`}
                                                    />
                                                </div>

                                                {errors[field.name] && <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden rounded-3xl border-[#E8DED3] bg-white shadow-sm">
                                <CardContent className="p-6 sm:p-8">
                                    <h3 className="mb-6 text-lg font-semibold text-[#2A1416]">
                                        Variants
                                    </h3>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <Label className="mb-3 block text-sm font-medium text-[#2A1416]">
                                                Available Sizes
                                            </Label>

                                            <div className="mb-3 flex flex-wrap gap-2">
                                                {formData.availableSizes.map((size) => (
                                                    <span key={size} className="flex items-center gap-2 rounded-full bg-[#C9A06C]/10 px-3 py-1 text-sm font-medium text-[#9B743F]">
                                                        {size}
                                                        <button type="button" onClick={() => toggleSize(size)}>
                                                            <X size={13} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>

                                            <Input
                                                type="text"
                                                placeholder="Press Enter to add size"
                                                className="h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C]"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const val = e.target.value.trim();

                                                        if (val && !formData.availableSizes.includes(val)) {
                                                            toggleSize(val);
                                                        }

                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <Label className="mb-3 block text-sm font-medium text-[#2A1416]">
                                                Available Colors
                                            </Label>

                                            <div className="mb-3 flex flex-wrap gap-2">
                                                {formData.availableColors.map((color) => (
                                                    <span key={color} className="flex items-center gap-2 rounded-full bg-[#2A1416]/5 px-3 py-1 text-sm font-medium text-[#2A1416]">
                                                        {color}
                                                        <button type="button" onClick={() => toggleColor(color)}>
                                                            <X size={13} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>

                                            <Input
                                                type="text"
                                                placeholder="Press Enter to add color"
                                                className="h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C]"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const val = e.target.value.trim();

                                                        if (val && !formData.availableColors.includes(val)) {
                                                            toggleColor(val);
                                                        }

                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
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

                                            {errors.categoryId && <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>}
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

                                        <div className="rounded-2xl border border-[#E8DED3] bg-[#FFF9F1] p-4">
                                            <h4 className="mb-3 text-sm font-semibold text-[#2A1416]">
                                                Product Tips
                                            </h4>

                                            <ul className="space-y-2 text-xs leading-5 text-[#7A6A62]">
                                                <li>• Add multiple clear images</li>
                                                <li>• Use proper product title</li>
                                                <li>• Add detailed description</li>
                                                <li>• Select correct category</li>
                                                <li>• Add size and color variants</li>
                                            </ul>
                                        </div>
                                    </div>
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
                aspectRatio={3 / 4}
                targetWidth={900}
                targetHeight={1200}
                title="Crop Product Image"
            />
        </div>
    );
}