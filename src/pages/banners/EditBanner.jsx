import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useBanner,
  useUpdateBanner,
  useDeleteBanner,
} from "@/hooks/useBanners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import ImageCropper from "@/components/ImageCropper";

export default function EditBanner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: banner, isLoading } = useBanner(id);
  const updateMutation = useUpdateBanner();
  const deleteMutation = useDeleteBanner();

  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    mobileImageUrl: "",
    link: "",
    displayOrder: 0,
    isActive: true,
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingMobileImage, setUploadingMobileImage] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropType, setCropType] = useState("desktop");
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || "",
        imageUrl: banner.imageUrl || "",
        mobileImageUrl: banner.mobileImageUrl || "",
        link: banner.link || "",
        displayOrder: banner.displayOrder || 0,
        isActive: banner.isActive,
        startDate: banner.startDate
          ? new Date(banner.startDate).toISOString().split("T")[0]
          : "",
        endDate: banner.endDate
          ? new Date(banner.endDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [banner]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileSelect = (e, type = "desktop") => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [type === "desktop" ? "image" : "mobileImage"]:
          "Only image files are allowed",
      }));
      return;
    }

    // Validate file size (10MB for banners)
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [type === "desktop" ? "image" : "mobileImage"]:
          "Image size must be less than 10MB",
      }));
      return;
    }

    // Open cropper with selected image
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setCropType(type);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedFile) => {
    await handleUpload(croppedFile, cropType);
  };

  const handleUpload = async (file, type = "desktop") => {
    const formDataToUpload = new FormData();
    formDataToUpload.append("image", file);

    if (type === "desktop") setUploadingImage(true);
    else setUploadingMobileImage(true);

    try {
      const { data } = await api.post("/upload", formDataToUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData((prev) => ({
        ...prev,
        [type === "desktop" ? "imageUrl" : "mobileImageUrl"]: data.imageUrl,
      }));
      setErrors((prev) => ({
        ...prev,
        [type === "desktop" ? "image" : "mobileImage"]: "",
      }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [type === "desktop" ? "image" : "mobileImage"]:
          error.response?.data?.message || "Failed to upload image",
      }));
    } finally {
      if (type === "desktop") setUploadingImage(false);
      else setUploadingMobileImage(false);
    }
  };

  const removeImage = (type) => {
    if (type === "desktop") {
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
      setErrors((prev) => ({ ...prev, image: "" }));
    } else if (type === "mobile") {
      setFormData((prev) => ({ ...prev, mobileImageUrl: "" }));
      setErrors((prev) => ({ ...prev, mobileImage: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.imageUrl) newErrors.image = "Banner image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateMutation.mutateAsync({ id, data: formData });
      navigate("/banners");
    } catch (error) {
      console.error("Failed to update banner:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      navigate("/banners");
    } catch (error) {
      console.error("Failed to delete banner:", error);
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

  if (!banner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Banner not found</p>
          <Button onClick={() => navigate("/banners")}>Back to Banners</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <div className="top-0 z-30 border-b border-[#E8DED3] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="mb-2 inline-flex rounded-full bg-[#C9A06C]/10 px-3 py-1 text-xs font-semibold text-[#9B743F]">
              Edit Banner
            </div>

            <h1 className="text-2xl font-bold text-[#2A1416] sm:text-3xl">
              Update Banner
            </h1>

            <p className="mt-1 text-sm text-[#7A6A62]">
              Update banner images, dates, visibility and links.
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
              onClick={() => navigate("/banners")}
              className="rounded-xl border-[#E2D5C5] bg-white text-[#2A1416] hover:bg-[#FAF7F2]"
            >
              Discard
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={updateMutation.isLoading}
              className="rounded-xl bg-[#C9A06C] px-6 text-white hover:bg-[#B88D57]"
            >
              {updateMutation.isLoading ? "Saving..." : "Save Changes"}
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
                    Banner Information
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                        Banner Title
                      </Label>

                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Festive Sale 2026"
                        className="h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C]"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                        Link URL
                      </Label>

                      <Input
                        name="link"
                        type="url"
                        value={formData.link}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        className="h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C]"
                      />

                      <p className="mt-2 text-xs text-[#8A7B72]">
                        Optional: Banner click redirect URL.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                          Start Date
                        </Label>

                        <Input
                          name="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={handleChange}
                          className="h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C]"
                        />
                      </div>

                      <div>
                        <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                          End Date
                        </Label>

                        <Input
                          name="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={handleChange}
                          className="h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C]"
                        />
                      </div>
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
                        min="0"
                        placeholder="0"
                        className="h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C]"
                      />

                      <p className="mt-2 text-xs text-[#8A7B72]">
                        Lower numbers appear first.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#FAF7F2] p-4">
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
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-[#E8DED3] bg-white shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="mb-6 text-lg font-semibold text-[#2A1416]">
                    Desktop Banner Image <span className="text-red-500">*</span>
                  </h3>

                  {formData.imageUrl ? (
                    <div className="relative overflow-hidden rounded-3xl border border-[#E8DED3] bg-[#FAF7F2]">
                      <img
                        src={getImageUrl(formData.imageUrl)}
                        alt="Banner preview"
                        className="w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage("desktop")}
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 shadow-md hover:bg-red-50"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, "desktop")}
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
                              Upload desktop banner
                            </p>
                            <p className="mt-1 text-xs text-[#8A7B72]">
                              Recommended 1920x600px, ratio 16:5.
                            </p>
                          </>
                        )}
                      </label>

                      {errors.image && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors.image}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-[#E8DED3] bg-white shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="mb-6 text-lg font-semibold text-[#2A1416]">
                    Mobile Banner Image
                  </h3>

                  {formData.mobileImageUrl ? (
                    <div className="relative mx-auto max-w-[280px] overflow-hidden rounded-3xl border border-[#E8DED3] bg-[#FAF7F2]">
                      <img
                        src={getImageUrl(formData.mobileImageUrl)}
                        alt="Mobile banner preview"
                        className="w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage("mobile")}
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 shadow-md hover:bg-red-50"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        id="mobileImageUpload"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, "mobile")}
                        className="hidden"
                      />

                      <label
                        htmlFor="mobileImageUpload"
                        className="block cursor-pointer rounded-3xl border-2 border-dashed border-[#D9C8B3] bg-[#FCFAF7] p-10 text-center transition hover:border-[#C9A06C] hover:bg-[#FFF9F1]"
                      >
                        {uploadingMobileImage ? (
                          <p className="text-sm text-[#7A6A62]">Uploading...</p>
                        ) : (
                          <>
                            <Upload className="mx-auto mb-4 h-12 w-12 text-[#C9A06C]" />
                            <p className="text-sm font-medium text-[#2A1416]">
                              Upload mobile banner
                            </p>
                            <p className="mt-1 text-xs text-[#8A7B72]">
                              Optional. Recommended 800x1000px.
                            </p>
                          </>
                        )}
                      </label>

                      {errors.mobileImage && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors.mobileImage}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="rounded-3xl border-[#E8DED3] bg-[#FFF9F1] shadow-sm lg:sticky lg:top-28">
                <CardContent className="p-6">
                  <h3 className="mb-3 text-sm font-semibold text-[#2A1416]">
                    Update Tips
                  </h3>

                  <ul className="space-y-2 text-xs leading-5 text-[#7A6A62]">
                    <li>• Desktop ratio: 16:5</li>
                    <li>• Mobile ratio: 4:5</li>
                    <li>• Mobile image is optional</li>
                    <li>• Lower order shows first</li>
                    <li>• Disable inactive banners</li>
                    <li>• Update campaign dates regularly</li>
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
        aspectRatio={cropType === "desktop" ? 16 / 5 : 4 / 5}
        targetWidth={cropType === "desktop" ? 1920 : 800}
        targetHeight={cropType === "desktop" ? 600 : 1000}
        title={
          cropType === "desktop" ? "Crop Desktop Banner" : "Crop Mobile Banner"
        }
      />

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#2A1416]">Delete Banner</DialogTitle>

            <DialogDescription>
              Are you sure you want to delete "{banner.title}"? This action
              cannot be undone.
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
              {deleteMutation.isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
