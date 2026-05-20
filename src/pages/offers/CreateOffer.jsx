import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateOffer } from "@/hooks/useOffers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateOffer() {
  const navigate = useNavigate();
  const createMutation = useCreateOffer();

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    endDate: "",
    usageLimit: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.code.trim()) newErrors.code = "Coupon code is required";
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
      code: formData.code.toUpperCase(),
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
      await createMutation.mutateAsync(offerData);
      navigate("/offers");
    } catch (error) {
      console.error("Failed to create offer:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <div className="top-0 z-30 border-b border-[#E8DED3] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="mb-2 inline-flex rounded-full bg-[#C9A06C]/10 px-3 py-1 text-xs font-semibold text-[#9B743F]">
              Offer Management
            </div>

            <h1 className="text-2xl font-bold text-[#2A1416] sm:text-3xl">
              Add New Offer
            </h1>

            <p className="mt-1 text-sm text-[#7A6A62]">
              Create coupon codes, discounts and validity rules.
            </p>
          </div>

          <div className="flex gap-3">
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
              disabled={createMutation.isLoading}
              className="rounded-xl bg-[#C9A06C] px-6 text-white hover:bg-[#B88D57]"
            >
              {createMutation.isLoading ? "Creating..." : "Add Offer"}
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
                        placeholder="e.g. Summer Sale 2026"
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
                        Coupon Code <span className="text-red-500">*</span>
                      </Label>

                      <Input
                        name="code"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            code: e.target.value.toUpperCase(),
                          }))
                        }
                        placeholder="e.g. SUMMER50"
                        className={`h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] font-mono uppercase focus:border-[#C9A06C] ${
                          errors.code ? "border-red-500" : ""
                        }`}
                      />

                      {errors.code && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.code}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-[#8A7B72]">
                        Code will be automatically converted to uppercase.
                      </p>
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
                        Discount Type <span className="text-red-500">*</span>
                      </Label>

                      <select
                        name="discountType"
                        value={formData.discountType}
                        onChange={handleChange}
                        className="h-12 w-full rounded-xl border border-[#E2D5C5] bg-[#FCFAF7] px-3 text-sm outline-none focus:border-[#C9A06C]"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₹)</option>
                      </select>
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
                          placeholder={
                            formData.discountType === "percentage"
                              ? "10"
                              : "100"
                          }
                          min="0"
                          step={
                            formData.discountType === "percentage"
                              ? "1"
                              : "0.01"
                          }
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
                            placeholder="500"
                            min="0"
                            className="h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C]"
                          />

                          <p className="mt-2 text-xs text-[#8A7B72]">
                            Optional discount cap.
                          </p>
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
                        placeholder="0"
                        min="0"
                        className="h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C]"
                      />

                      <p className="mt-2 text-xs text-[#8A7B72]">
                        Leave 0 for no minimum order value.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-[#E8DED3] bg-white shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="mb-6 text-lg font-semibold text-[#2A1416]">
                    Usage & Validity
                  </h3>

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
                        min={new Date().toISOString().split("T")[0]}
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
                        placeholder="Unlimited"
                        min="1"
                        className="h-12 rounded-xl border-[#E2D5C5] bg-[#FCFAF7] focus:border-[#C9A06C]"
                      />

                      <p className="mt-2 text-xs text-[#8A7B72]">
                        Leave empty for unlimited usage.
                      </p>
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
                      {formData.code || "COUPON"}
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
                    Offer Tips
                  </h3>

                  <ul className="space-y-2 text-xs leading-5 text-[#7A6A62]">
                    <li>• Use unique and memorable coupon codes</li>
                    <li>• Add minimum order amount for better margin</li>
                    <li>• Cap percentage discounts if needed</li>
                    <li>• Use expiry date for urgency</li>
                    <li>• Limit usage for exclusive offers</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
