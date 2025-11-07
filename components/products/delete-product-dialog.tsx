"use client";

import type React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppDispatch } from "@/store/hooks";
import { deleteProduct, fetchProducts } from "@/store/slices/productsSlice";
import { useTranslations, useLocale } from "next-intl";

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number | null;
}

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  open,
  onOpenChange,
  productId,
}) => {
  const dispatch = useAppDispatch();
  const t = useTranslations("productsList");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const handleDeleteConfirm = async () => {
    if (productId === null) return;

    try {
      await dispatch(deleteProduct(productId)).unwrap();
      onOpenChange(false);
      dispatch(fetchProducts());
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteDialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
          <AlertDialogCancel>{t("deleteDialog.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteConfirm}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {t("deleteDialog.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProductDialog;
