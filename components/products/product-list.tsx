"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productsSlice";
import type { Product } from "@/types/productTypes.ts";
import { useTranslations, useLocale } from "next-intl";
import AddProductDialog from "./add-product-dialog";
import ProductTable from "./product-table";
import ProductCard from "./product-card";
import EditProductDialog from "./edit-product-dialog";
import DeleteProductDialog from "./delete-product-dialog";

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );
  const [searchTerm, setSearchTerm] = useState("");
  const t = useTranslations("productsList");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (productId: number) => {
    setDeletingProductId(productId);
    setDeleteDialogOpen(true);
  };

  const handleProductAdded = () => {
    dispatch(fetchProducts());
  };

  const filteredProducts = products.filter(
    (product) =>
      product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      product.product_name_en
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      false
  );

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#1a1a1a]`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("loadingProducts")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen dark:bg-[#1a1a1a] bg-[#FAFAFA] p-4 md:p-8`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <AddProductDialog onProductAdded={handleProductAdded} />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md bg-card border-border"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <ProductTable
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden grid gap-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center text-muted-foreground p-12">
            {t("noProductsFound")}
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))
        )}
      </div>

      {/* Products Count */}
      <div className="mt-4 text-sm text-muted-foreground">
        {t("showingProducts", {
          filtered: filteredProducts.length,
          total: products.length,
        })}
      </div>

      {/* Dialogs */}
      <EditProductDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        product={editingProduct}
      />
      <DeleteProductDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        productId={deletingProductId}
      />
    </div>
  );
};

export default ProductList;
