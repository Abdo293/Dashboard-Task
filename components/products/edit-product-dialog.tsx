"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch } from "@/store/hooks";
import { updateProduct, fetchProducts } from "@/store/slices/productsSlice";
import { useTranslations, useLocale } from "next-intl";
import { EditForm, EditProductDialogProps } from "@/types/EditProductsTypes";
import LocationMapPicker from "./LocationMapPicker";

// Extended EditForm interface to include location (for UI only)
interface ExtendedEditForm extends EditForm {
  location?: { lat: number; lng: number };
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({
  open,
  onOpenChange,
  product,
}) => {
  const dispatch = useAppDispatch();
  const t = useTranslations("productsList");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [editForm, setEditForm] = React.useState<ExtendedEditForm>({
    product_name: "",
    product_name_en: "",
    product_price: "",
    number_of_pieces: "",
    discount: "",
    product_description: "",
    product_description_en: "",
    location: undefined,
  });

  React.useEffect(() => {
    if (product) {
      setEditForm({
        product_name: product.product_name,
        product_name_en: product.product_name_en,
        product_price: product.product_price.toString(),
        number_of_pieces: product.number_of_pieces.toString(),
        discount: product.discount.toString(),
        product_description: product.product_description || "",
        product_description_en: product.product_description_en || "",
        location: undefined, // Reset location each time dialog opens
      });
    }
  }, [product, open]);

  const handleLocationChange = (location: { lat: number; lng: number }) => {
    setEditForm({ ...editForm, location });
  };

  const handleEditSubmit = async () => {
    if (!product) return;

    try {
      const productPrice = Number.parseFloat(editForm.product_price);
      const productDiscount = Number.parseInt(editForm.discount) || 0;
      const priceAfterDiscount = Number.parseFloat(
        (productPrice - (productPrice * productDiscount) / 100).toFixed(2)
      );

      // Location is stored in form state but NOT sent to API
      await dispatch(
        updateProduct({
          product_id: product.product_id!,
          product_name: editForm.product_name,
          product_name_en: editForm.product_name_en,
          product_price: productPrice,
          number_of_pieces: Number.parseInt(editForm.number_of_pieces),
          discount: productDiscount,
          price_after_discount: priceAfterDiscount,
          product_hidden: product.product_hidden ?? false,
          product_description: editForm.product_description,
          product_description_en: editForm.product_description_en,
          // Note: location is NOT included in the API call
        })
      ).unwrap();
      onOpenChange(false);
      dispatch(fetchProducts());
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle>{t("editDialog.title")}</DialogTitle>
          <DialogDescription>{t("editDialog.description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product_name">
                {t("editDialog.productNameAr")}
              </Label>
              <Input
                id="product_name"
                value={editForm.product_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, product_name: e.target.value })
                }
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product_name_en">
                {t("editDialog.productNameEn")}
              </Label>
              <Input
                id="product_name_en"
                value={editForm.product_name_en}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    product_name_en: e.target.value,
                  })
                }
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product_price">{t("editDialog.price")}</Label>
              <Input
                id="product_price"
                type="number"
                step="0.01"
                value={editForm.product_price}
                onChange={(e) =>
                  setEditForm({ ...editForm, product_price: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number_of_pieces">
                {t("editDialog.quantity")}
              </Label>
              <Input
                id="number_of_pieces"
                type="number"
                value={editForm.number_of_pieces}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    number_of_pieces: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">{t("editDialog.discount")}</Label>
              <Input
                id="discount"
                type="number"
                value={editForm.discount}
                onChange={(e) =>
                  setEditForm({ ...editForm, discount: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_description">
              {t("editDialog.descriptionAr")}
            </Label>
            <Textarea
              id="product_description"
              rows={3}
              value={editForm.product_description}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  product_description: e.target.value,
                })
              }
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_description_en">
              {t("editDialog.descriptionEn")}
            </Label>
            <Textarea
              id="product_description_en"
              rows={3}
              value={editForm.product_description_en}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  product_description_en: e.target.value,
                })
              }
              dir="ltr"
            />
          </div>

          {/* Location Picker - for UI display only, not sent to API */}
          <LocationMapPicker
            label={t("editDialog.location") || "Product Location"}
            value={editForm.location}
            onChange={handleLocationChange}
          />
        </div>
        <DialogFooter className={isRTL ? "flex-row-reverse" : ""}>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("editDialog.cancel")}
          </Button>
          <Button
            onClick={handleEditSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {t("editDialog.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
