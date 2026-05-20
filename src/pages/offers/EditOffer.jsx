import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOffer, useUpdateOffer, useDeleteOffer } from "@/hooks/useOffers";
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
import { Trash2 } from "lucide-react";

export default function EditOffer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: offer, isLoading } = useOffer(id);
  const updateMutation = useUpdateOffer();
  const deleteMutation = useDeleteOffer();

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    endDate: "",
    usageLimit: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title || "",
        code: offer.code || "",
        discountType: offer.discountType || "percentage",
        discountValue: offer.discountValue?.toString() || "",
        minOrderAmount: offer.minOrderAmount?.toString() || "",
        maxDiscount: offer.maxDiscount?.toString() || "",
        endDate: offer.endDate
          ? new Date(offer.endDate).toISOString().split("T")[0]
          : "",
        usageLimit: offer.usageLimit?.toString() || "",
        isActive: offer.isActive ?? true,
      });
    }
  }, [offer]);

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

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.discountValue)
      newErrors.discountValue = "Discount value is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const offerData = {
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      minOrderAmount: formData.minOrderAmount
        ? parseFloat(formData.minOrderAmount)
        : 0,
      maxDiscount: formData.maxDiscount
        ? parseFloat(formData.maxDiscount)
        : undefined,
      usageLimit: formData.usageLimit
        ? parseInt(formData.usageLimit)
        : undefined,
    };

    try {
      await updateMutation.mutateAsync({ id, data: offerData });
      navigate("/offers");
    } catch (error) {
      console.error("Failed to update offer:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      navigate("/offers");
    } catch (error) {
      console.error("Failed to delete offer:", error);
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

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Offer not found</p>
          <Button onClick={() => navigate("/offers")}>Back to Offers</Button>
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
              Edit Offer
            </div>

            <h1 className="text-2xl font-bold text-[#2A1416] sm:text-3xl">
              Update Offer
            </h1>

            <p className="mt-1 text-sm text-[#7A6A62]">
              Update coupon details, discount value, validity and status.
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
              onClick={() => navigate("/offers")}
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
                    Basic Information
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                        Offer Title <span className="text-red-500">*</span>
                      </Label>

                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C] ${
                          errors.title ? "border-red-500" : ""
                        }`}
                      />

                      {errors.title && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                        Coupon Code
                      </Label>

                      <Input
                        name="code"
                        value={formData.code}
                        disabled
                        className="h-12 rounded-xl border-[#E2D5C5] bg-[#FAF7F2] font-mono text-[#9B743F]"
                      />

                      <p className="mt-2 text-xs text-[#8A7B72]">
                        Code cannot be changed after creation.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#FAF7F2] p-4">
                      <label
                        htmlFor="isActive"
                        className="flex cursor-pointer items-center justify-between rounded-xl bg-white px-4 py-3"
                      >
                        <span className="text-sm font-medium text-[#2A1416]">
                          Active for use
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
                    Discount Details
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                        Discount Type
                      </Label>

                      <div className="flex h-12 items-center rounded-xl border border-[#E2D5C5] bg-[#FAF7F2] px-4 text-sm font-medium text-[#7A6A62]">
                        {formData.discountType === "percentage"
                          ? "Percentage (%)"
                          : "Fixed Amount (₹)"}
                      </div>

                      <p className="mt-2 text-xs text-[#8A7B72]">
                        Type cannot be changed after creation.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                          Discount Value <span className="text-red-500">*</span>
                        </Label>

                        <Input
                          name="discountValue"
                          type="number"
                          value={formData.discountValue}
                          onChange={handleChange}
                          min="0"
                          className={`h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C] ${
                            errors.discountValue ? "border-red-500" : ""
                          }`}
                        />

                        {errors.discountValue && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.discountValue}
                          </p>
                        )}
                      </div>

                      {formData.discountType === "percentage" && (
                        <div>
                          <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                            Max Discount
                          </Label>

                          <Input
                            name="maxDiscount"
                            type="number"
                            value={formData.maxDiscount}
                            onChange={handleChange}
                            min="0"
                            className="h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C]"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                        Minimum Order Amount
                      </Label>

                      <Input
                        name="minOrderAmount"
                        type="number"
                        value={formData.minOrderAmount}
                        onChange={handleChange}
                        min="0"
                        className="h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-[#E8DED3] bg-white shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="mb-6 text-lg font-semibold text-[#2A1416]">
                    Usage & Validity
                  </h3>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                          End Date <span className="text-red-500">*</span>
                        </Label>

                        <Input
                          name="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={handleChange}
                          className={`h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C] ${
                            errors.endDate ? "border-red-500" : ""
                          }`}
                        />

                        {errors.endDate && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.endDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="mb-2 block text-sm font-medium text-[#2A1416]">
                          Usage Limit
                        </Label>

                        <Input
                          name="usageLimit"
                          type="number"
                          value={formData.usageLimit}
                          onChange={handleChange}
                          min="1"
                          className="h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C]"
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#FAF7F2] p-4">
                      <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                        <div className="rounded-xl bg-white p-4">
                          <span className="block text-xs text-[#8A7B72]">
                            Times Used
                          </span>
                          <span className="mt-1 block text-lg font-bold text-[#2A1416]">
                            {offer.usedCount || 0}
                          </span>
                        </div>

                        <div className="rounded-xl bg-white p-4">
                          <span className="block text-xs text-[#8A7B72]">
                            Created On
                          </span>
                          <span className="mt-1 block text-lg font-bold text-[#2A1416]">
                            {new Date(offer.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="rounded-3xl border-[#E8DED3] bg-white shadow-sm lg:sticky lg:top-28">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-sm font-semibold text-[#2A1416]">
                    Coupon Preview
                  </h3>

                  <div className="rounded-3xl border-2 border-dashed border-[#C9A06C] bg-[#FFF9F1] p-5 text-center">
                    <p className="mb-2 font-mono text-2xl font-bold text-[#C9A06C]">
                      {formData.code}
                    </p>

                    <p className="mb-4 text-sm text-[#7A6A62]">
                      {formData.title || "Offer Title"}
                    </p>

                    <div className="inline-flex rounded-xl bg-[#C9A06C] px-4 py-2 text-sm font-bold text-white">
                      {formData.discountType === "percentage"
                        ? `${formData.discountValue || 0}% OFF`
                        : `₹${formData.discountValue || 0} OFF`}
                    </div>

                    {formData.minOrderAmount > 0 && (
                      <p className="mt-4 text-xs text-[#8A7B72]">
                        Min order: ₹{formData.minOrderAmount}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-[#E8DED3] bg-[#FFF9F1] shadow-sm">
                <CardContent className="p-6">
                  <h3 className="mb-3 text-sm font-semibold text-[#2A1416]">
                    Update Tips
                  </h3>

                  <ul className="space-y-2 text-xs leading-5 text-[#7A6A62]">
                    <li>• Coupon code cannot be edited</li>
                    <li>• Toggle active status anytime</li>
                    <li>• Monitor usage before increasing limit</li>
                    <li>• Update expiry date for campaigns</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#2A1416]">Delete Offer</DialogTitle>

            <DialogDescription>
              Are you sure you want to delete "{offer.code}"? This action cannot
              be undone.
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
