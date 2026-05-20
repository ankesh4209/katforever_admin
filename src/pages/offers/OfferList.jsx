import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOffers, useDeleteOffer } from "@/hooks/useOffers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Ticket, Percent, IndianRupee } from "lucide-react";

export default function OfferList() {
  const navigate = useNavigate();
  const { data: offers = [], isLoading } = useOffers();
  const deleteMutation = useDeleteOffer();

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    offer: null,
  });

  const handleDelete = async () => {
    if (deleteDialog.offer) {
      await deleteMutation.mutateAsync(deleteDialog.offer._id);
      setDeleteDialog({ open: false, offer: null });
    }
  };

  const isOfferActive = (offer) => {
    const now = new Date();
    const startDate = new Date(offer.startDate);
    const endDate = new Date(offer.endDate);
    return offer.isActive && now >= startDate && now <= endDate;
  };

  const isOfferExpired = (offer) => {
    const now = new Date();
    const endDate = new Date(offer.endDate);
    return now > endDate;
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <div className="border-b border-[#E8DED3] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="mb-2 inline-flex rounded-full bg-[#C9A06C]/10 px-3 py-1 text-xs font-semibold text-[#9B743F]">
              Offer Management
            </div>

            <h1 className="text-2xl font-bold text-[#2A1416] sm:text-3xl">
              Offers & Coupons
            </h1>

            <p className="mt-1 text-sm text-[#7A6A62]">
              {offers.length} {offers.length === 1 ? "offer" : "offers"} found
            </p>
          </div>

          <Button
            onClick={() => navigate("/offers/create")}
            className="rounded-xl bg-[#C9A06C] px-5 text-white hover:bg-[#B88D57]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Offer
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-[#E8DED3] bg-white shadow-sm">
          {offers.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#C9A06C]/10">
                <Ticket className="h-9 w-9 text-[#C9A06C]" />
              </div>

              <p className="mb-1 text-lg font-semibold text-[#2A1416]">
                No offers found
              </p>

              <p className="mb-6 text-sm text-[#7A6A62]">
                Create a discount coupon for your customers.
              </p>

              <Button
                onClick={() => navigate("/offers/create")}
                className="rounded-xl bg-[#C9A06C] text-white hover:bg-[#B88D57]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Offer
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#E8DED3] bg-[#FAF7F2]">
                    <TableHead className="text-xs font-semibold text-[#7A6A62]">
                      Code
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[#7A6A62]">
                      Title
                    </TableHead>
                    <TableHead className="text-center text-xs font-semibold text-[#7A6A62]">
                      Discount
                    </TableHead>
                    <TableHead className="text-center text-xs font-semibold text-[#7A6A62]">
                      Min Order
                    </TableHead>
                    <TableHead className="text-center text-xs font-semibold text-[#7A6A62]">
                      Usage
                    </TableHead>
                    <TableHead className="text-center text-xs font-semibold text-[#7A6A62]">
                      Status
                    </TableHead>
                    <TableHead className="text-center text-xs font-semibold text-[#7A6A62]">
                      Valid Until
                    </TableHead>
                    <TableHead className="text-right text-xs font-semibold text-[#7A6A62]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {offers.map((offer) => (
                    <TableRow
                      key={offer._id}
                      className="border-b border-[#F1E8DD] hover:bg-[#FCFAF7]"
                    >
                      <TableCell>
                        <span className="rounded-xl bg-[#C9A06C]/10 px-3 py-1 font-mono text-sm font-bold text-[#9B743F]">
                          {offer.code}
                        </span>
                      </TableCell>

                      <TableCell className="font-semibold text-[#2A1416]">
                        {offer.title}
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="inline-flex items-center gap-1 rounded-xl bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                          {offer.discountType === "percentage" ? (
                            <>
                              <Percent className="h-3 w-3" />
                              {offer.discountValue}%
                            </>
                          ) : (
                            <>
                              <IndianRupee className="h-3 w-3" />
                              {offer.discountValue}
                            </>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-center text-sm text-[#7A6A62]">
                        ₹{offer.minOrderAmount}
                      </TableCell>

                      <TableCell className="text-center text-sm text-[#7A6A62]">
                        {offer.usedCount}/{offer.usageLimit || "∞"}
                      </TableCell>

                      <TableCell className="text-center">
                        {isOfferExpired(offer) ? (
                          <Badge className="border-0 bg-gray-100 text-gray-600">
                            Expired
                          </Badge>
                        ) : isOfferActive(offer) ? (
                          <Badge className="border-0 bg-green-100 text-green-700">
                            Active
                          </Badge>
                        ) : offer.isActive ? (
                          <Badge className="border-0 bg-blue-100 text-blue-700">
                            Scheduled
                          </Badge>
                        ) : (
                          <Badge className="border-0 bg-red-100 text-red-700">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-center text-xs text-[#7A6A62]">
                        {new Date(offer.endDate).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/offers/edit/${offer._id}`)
                            }
                            className="rounded-xl text-[#7A6A62] hover:bg-[#C9A06C]/10 hover:text-[#C9A06C]"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDeleteDialog({ open: true, offer })
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
        onOpenChange={(open) => setDeleteDialog({ open, offer: null })}
      >
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#2A1416]">Delete Offer</DialogTitle>

            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.offer?.code}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, offer: null })}
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
