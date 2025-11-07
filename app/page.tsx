"use client";
import AddProductForm from "@/components/add-products/AddProductsForm";
import AnalyticsPage from "@/components/home/AnalysisPage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productsSlice";
import { useEffect } from "react";
export default function Home() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  console.log(products);

  return (
    <div>
      <AnalyticsPage />
    </div>
  );
}
