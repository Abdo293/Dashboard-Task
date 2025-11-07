"use client";

import React, { useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Package, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productsSlice";
import { useTranslations, useLocale } from "next-intl";

const AnalyticsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const t = useTranslations("analytics");
  const locale = useLocale();
  const isRTL = locale === "ar";

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Helper function to truncate long text
  const truncateText = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce(
      (sum, p) => sum + p.product_price * p.number_of_pieces,
      0
    );
    const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;
    const outOfStock = products.filter((p) => p.number_of_pieces === 0).length;

    return { totalProducts, totalValue, averagePrice, outOfStock };
  }, [products]);

  // Top Products with Status
  const topProducts = useMemo(() => {
    return products
      .map((product) => ({
        ...product,
        revenue: product.product_price * product.number_of_pieces,
        status: product.number_of_pieces > 0 ? "Available" : "Not Available",
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [products]);

  // Price Distribution Data
  const priceDistribution = useMemo(() => {
    const ranges = [
      { name: t("priceRanges.under50"), min: 0, max: 50, count: 0 },
      { name: t("priceRanges.range50to100"), min: 50, max: 100, count: 0 },
      { name: t("priceRanges.range100to200"), min: 100, max: 200, count: 0 },
      { name: t("priceRanges.range200to500"), min: 200, max: 500, count: 0 },
      { name: t("priceRanges.above500"), min: 500, max: Infinity, count: 0 },
    ];

    products.forEach((product) => {
      const price = product.product_price;
      const range = ranges.find((r) => price >= r.min && price < r.max);
      if (range) range.count++;
    });

    return ranges;
  }, [products, t]);

  // Stock Status Data
  const stockStatus = useMemo(() => {
    const inStock = products.filter((p) => p.number_of_pieces > 0).length;
    const outOfStock = products.filter((p) => p.number_of_pieces === 0).length;

    return [
      {
        name: t("charts.stockStatus.inStock"),
        value: inStock,
        color: "#10b981",
      },
      {
        name: t("charts.stockStatus.outOfStock"),
        value: outOfStock,
        color: "#f97316",
      },
    ];
  }, [products, t]);

  if (loading) {
    return (
      <div
        className={`min-h-screen bg-[#FAFAFA] dark:bg-[#1a1a1a] flex items-center justify-center`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("loadingAnalytics")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#FAFAFA] dark:bg-[#1a1a1a] p-4 md:p-8`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("title")}
        </h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("stats.totalProducts")}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("stats.totalValue")}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("stats.averagePrice")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.averagePrice.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("stats.outOfStock")}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {stats.outOfStock}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Overview Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Product Overview</CardTitle>
          <CardDescription>
            Top products sorted by revenue with availability status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Product ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Price</th>
                  <th className="text-left py-3 px-4 font-medium">Quantity</th>
                  <th className="text-left py-3 px-4 font-medium">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr
                    key={product.product_id}
                    className="border-b hover:bg-muted/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="font-medium">
                          {truncateText(product.product_name, 30)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      #{product.product_id}
                    </td>
                    <td className="py-3 px-4">
                      ${product.product_price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">{product.number_of_pieces}</td>
                    <td className="py-3 px-4 font-semibold">
                      ${product.revenue.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.status === "Available"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.priceDistribution.title")}</CardTitle>
            <CardDescription>
              {t("charts.priceDistribution.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={isRTL ? 45 : -45}
                  textAnchor={isRTL ? "start" : "end"}
                  height={100}
                  interval={0}
                  style={{ fontSize: "12px" }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Status */}
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.stockStatus.title")}</CardTitle>
            <CardDescription>
              {t("charts.stockStatus.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
