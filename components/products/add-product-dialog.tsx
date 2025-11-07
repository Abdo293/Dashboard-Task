"use client";

import type React from "react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddProductForm from "./add-product-form";
import { useTranslations } from "next-intl";

interface AddProductDialogProps {
  onProductAdded?: () => void;
}

const AddProductDialog: React.FC<AddProductDialogProps> = ({
  onProductAdded,
}) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("productsList");

  const handleSuccess = () => {
    setOpen(false);
    onProductAdded?.();
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
      >
        <Plus className="w-4 h-4" />
        {t("addProduct")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("addProduct")}</DialogTitle>
            <DialogDescription>{t("addProductDescription")}</DialogDescription>
          </DialogHeader>
          <AddProductForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddProductDialog;
