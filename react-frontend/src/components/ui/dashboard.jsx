import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/v1/product/queries";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

const formatNumber = (value) => Number(value ?? 0).toLocaleString("en-PH");

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => setDashboard(result.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading dashboard...
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="m-6 rounded-xl border border-red-200 bg-white p-6 text-red-600">
        <h2 className="text-xl font-bold">Unable to load dashboard</h2>
        <p className="mt-2 text-sm">{error || "No data received."}</p>
        <p className="mt-1 text-sm text-slate-500">
          Check the API URL, Laravel server, and CORS configuration.
        </p>
      </div>
    );
  }

  const products = dashboard.productsWithCategory ?? [];
  const categoryStats = dashboard.totalPricePerCategory ?? [];

  const maxCategoryTotal = Math.max(
    ...categoryStats.map((item) => Number(item.total_price ?? 0)),
    1,
  );

  const cards = [
    {
      label: "Total Products",
      value: formatNumber(products.length),
      icon: "▦",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Sum of Prices",
      value: formatCurrency(dashboard.totalPrice),
      icon: "₱",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Average Price",
      value: formatCurrency(dashboard.averagePrice),
      icon: "↗",
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Highest Price",
      value: formatCurrency(dashboard.highestPrice),
      icon: "↑",
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Lowest Price",
      value: formatCurrency(dashboard.lowestPrice),
      icon: "↓",
      color: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="flex w-full shrink-0 flex-col bg-slate-900 text-white md:fixed md:inset-y-0 md:left-0 md:w-64">
          <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-xl font-bold">
              P
            </div>
            <div>
              <h2 className="text-lg font-bold">ProductHub</h2>
              <p className="text-xs text-slate-400">Management System</p>
            </div>
          </div>

          <div className="px-4 py-6">
            <p className="mb-3 px-3 text-xs font-semibold tracking-widest text-slate-500">
              MAIN MENU
            </p>

            <nav className="flex gap-2 overflow-x-auto md:flex-col">
              <a
                href="#overview"
                className="flex shrink-0 items-center gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white"
              >
                <span>▤</span> Overview
              </a>
              <a
                href="#products"
                className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <span>▣</span> Products
              </a>
              <a
                href="#categories"
                className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <span>▥</span> Categories
              </a>
            </nav>
          </div>

          <div className="mt-auto hidden border-t border-slate-800 p-5 md:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-bold">
                A
              </div>
              <div>
                <p className="text-sm font-semibold">Administrator</p>
                <p className="text-xs text-slate-400">Dashboard</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Dashboard content */}
        <main
          id="overview"
          className="min-w-0 flex-1 p-4 sm:p-6 lg:ml-64 lg:p-10"
        >
          <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-xs font-bold tracking-widest text-indigo-600">
                OVERVIEW
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Product Dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Monitor product prices and category performance.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Connected to API
            </div>
          </header>

          {/* Summary cards */}
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => (
              <article
                key={card.label}
                className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold ${card.color}`}
                >
                  {card.icon}
                </div>
                <p className="mt-5 text-sm text-slate-500">{card.label}</p>
                <h2 className="mt-2 break-words text-xl font-bold text-slate-900">
                  {card.value}
                </h2>
              </article>
            ))}
          </section>

          {/* Category analytics */}
          <section
            id="categories"
            className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-5"
          >
            <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7 xl:col-span-3">
              <div className="mb-7">
                <h2 className="font-bold text-slate-900">Price by Category</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Total sum of product prices per category
                </p>
              </div>

              {categoryStats.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No category data available.
                </p>
              ) : (
                <div className="space-y-6">
                  {categoryStats.map((category) => {
                    const total = Number(category.total_price ?? 0);
                    const width = (total / maxCategoryTotal) * 100;

                    return (
                      <div key={category.name}>
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                          <span className="font-medium text-slate-600">
                            {category.name}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {formatCurrency(total)}
                          </span>
                        </div>

                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </article>

            {/* Price insights */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7 xl:col-span-2">
              <div className="mb-5">
                <h2 className="font-bold text-slate-900">Price Insights</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Quick statistics from your products
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {[
                  {
                    label: "Highest product price",
                    value: formatCurrency(dashboard.highestPrice),
                  },
                  {
                    label: "Lowest product price",
                    value: formatCurrency(dashboard.lowestPrice),
                  },
                  {
                    label: "Categories represented",
                    value: formatNumber(categoryStats.length),
                  },
                  {
                    label: "Products priced at ₱3 or more",
                    value: formatNumber(
                      (dashboard.priceGreaterThanOrEqual ?? []).length,
                    ),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <span className="text-sm text-slate-500">{item.label}</span>
                    <span className="text-right text-sm font-bold text-slate-800">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </section>

          {/* Product table */}
          <section
            id="products"
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
          >
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-7 sm:py-6">
              <div>
                <h2 className="font-bold text-slate-900">Products by Price</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Products ordered from lowest to highest price
                </p>
              </div>
              <span className="w-fit rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">
                {(dashboard.productsOrderedByPrice ?? []).length} records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Product ID</th>
                    <th className="px-6 py-4 font-semibold">Product Name</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(dashboard.productsOrderedByPrice ?? []).map((product) => (
                    <tr
                      key={product.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 text-slate-500">
                        #{product.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-700">
                        {formatCurrency(product.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(dashboard.productsOrderedByPrice ?? []).length === 0 && (
                <p className="p-8 text-center text-sm text-slate-500">
                  No products available.
                </p>
              )}
            </div>
          </section>

          <footer className="py-6 text-center text-xs text-slate-400">
            ProductHub · Laravel API Dashboard
          </footer>
        </main>
      </div>
    </div>
  );
}
