"use client";
import AnalyticsPage from "@/components/home/AnalysisPage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productsSlice";
import { useEffect } from "react";
export default function Home() {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div>
      <AnalyticsPage />
    </div>
  );
}
