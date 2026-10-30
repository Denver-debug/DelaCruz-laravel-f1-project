import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "./styles/dashboard.css";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all dashboard query results from Laravel
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/product/queries");

        setDashboardData(response.data.data);
      } catch (err) {
        console.error("Dashboard API error:", err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 2,
    });
  };

  if (loading) {
    return (
      <div className="dashboard-state">
        <div className="loader"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  if (!dashboardData) {
    return <div className="dashboard-error">No dashboard data available.</div>;
  }

  const data = dashboardData;

  const totalProducts = data.productsWithCategory?.length || 0;
  const electronicsCount = data.electronics?.length || 0;
  const filteredProductsCount = data.priceGreaterThanOrEqual?.length || 0;

  const summaryCards = [
    {
      title: "Total Products",
      value: totalProducts.toLocaleString(),
      description: "Products in the database",
      icon: "📦",
      color: "blue",
    },
    {
      title: "Combined Product Prices",
      value: formatCurrency(data.totalPrice),
      description: "Sum of all product prices",
      icon: "💰",
      color: "green",
    },
    {
      title: "Average Price",
      value: formatCurrency(data.averagePrice),
      description: "Average price per product",
      icon: "📊",
      color: "purple",
    },
    {
      title: "Highest Price",
      value: formatCurrency(data.highestPrice),
      description: "Most expensive product price",
      icon: "📈",
      color: "orange",
    },
    {
      title: "Lowest Price",
      value: formatCurrency(data.lowestPrice),
      description: "Least expensive product price",
      icon: "📉",
      color: "red",
    },
  ];

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Product Analytics</h1>
          <p className="header-description">
            Monitor product prices, categories, and product distribution.
          </p>
        </div>

        <div className="header-status">
          <span className="status-dot"></span>
          Data connected
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <section className="summary-grid">
        {summaryCards.map((card, index) => (
          <div className="summary-card" key={index}>
            <div className={`summary-icon ${card.color}`}>{card.icon}</div>

            <div className="summary-content">
              <p>{card.title}</p>
              <h2>{card.value}</h2>
              <span>{card.description}</span>
            </div>
          </div>
        ))}
      </section>

      {/* CATEGORY CHARTS */}
      <section className="charts-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2>Total Price per Category</h2>
              <p>Combined product prices grouped by category</p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.totalPricePerCategory || []}
                margin={{ top: 15, right: 15, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => `₱${value}`}
                />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar
                  dataKey="total_price"
                  name="Total Price"
                  fill="#4f46e5"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2>Average Price per Category</h2>
              <p>Average product price for each category</p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.averagePriceSorted || []}
                margin={{ top: 15, right: 15, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => `₱${value}`}
                />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar
                  dataKey="avg_price"
                  name="Average Price"
                  fill="#0d9488"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* FILTERED DATA CARDS */}
      <section className="section-block">
        <div className="section-heading">
          <div>
            <h2>Product Insights</h2>
            <p>Results from your filtering queries</p>
          </div>
        </div>

        <div className="insight-grid">
          <div className="insight-card">
            <div className="insight-top">
              <span>Electronics Products</span>
              <span className="insight-icon">💻</span>
            </div>
            <h2>{electronicsCount}</h2>
            <p>Products under Electronics category</p>
          </div>

          <div className="insight-card">
            <div className="insight-top">
              <span>Products Priced at Least ₱3</span>
              <span className="insight-icon">🏷️</span>
            </div>
            <h2>{filteredProductsCount}</h2>
            <p>Products with a price greater than or equal to 3</p>
          </div>

          <div className="insight-card">
            <div className="insight-top">
              <span>Electronics vs Books</span>
              <span className="insight-icon">📚</span>
            </div>

            {data.electronicsAndBooks?.length > 0 ? (
              data.electronicsAndBooks.map((item) => (
                <div className="comparison-row" key={item.name}>
                  <span>{item.name}</span>
                  <strong>{formatCurrency(item.avg_price)}</strong>
                </div>
              ))
            ) : (
              <p>No comparison data available.</p>
            )}
          </div>
        </div>
      </section>

      {/* FIRST FIVE PRODUCTS */}
      <section className="section-block">
        <div className="section-heading">
          <div>
            <h2>First Five Products</h2>
            <p>First five records from the products table</p>
          </div>
          <span className="record-count">
            {data.firstFiveProducts?.length || 0} records
          </span>
        </div>

        <div className="dashboard-panel table-panel">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Price</th>
                </tr>
              </thead>

              <tbody>
                {data.firstFiveProducts?.map((product) => (
                  <tr key={product.id}>
                    <td>#{product.id}</td>
                    <td>{product.name}</td>
                    <td>{formatCurrency(product.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRODUCTS ORDERED BY PRICE */}
      <section className="section-block">
        <div className="section-heading">
          <div>
            <h2>Products by Price</h2>
            <p>Products arranged from lowest to highest price</p>
          </div>
        </div>

        <div className="dashboard-panel table-panel">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Product Name</th>
                  <th>Price</th>
                </tr>
              </thead>

              <tbody>
                {data.productsOrderedByPrice?.map((product, index) => (
                  <tr key={product.id}>
                    <td>
                      <span className="rank-badge">{index + 1}</span>
                    </td>
                    <td>{product.name}</td>
                    <td>{formatCurrency(product.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CATEGORY PRICE DETAILS */}
      <section className="section-block">
        <div className="section-heading">
          <div>
            <h2>Category Price Details</h2>
            <p>Lowest and average prices for each category</p>
          </div>
        </div>

        <div className="dashboard-panel table-panel">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Average Price</th>
                  <th>Lowest Price</th>
                </tr>
              </thead>

              <tbody>
                {(data.averagePricePerCategory || []).map((category) => {
                  const lowest = (data.lowestPricePerCategory || []).find(
                    (item) => item.name === category.name,
                  );

                  return (
                    <tr key={category.name}>
                      <td>{category.name}</td>
                      <td>{formatCurrency(category.avg_price)}</td>
                      <td>{formatCurrency(lowest?.min_price)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ELECTRONICS PRODUCTS */}
      <section className="section-block">
        <div className="section-heading">
          <div>
            <h2>Electronics Products</h2>
            <p>Products filtered under the Electronics category</p>
          </div>
          <span className="record-count">{electronicsCount} records</span>
        </div>

        <div className="dashboard-panel table-panel">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Category</th>
                </tr>
              </thead>

              <tbody>
                {(data.electronics || []).map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.category?.name || "Electronics"}</td>
                  </tr>
                ))}

                {electronicsCount === 0 && (
                  <tr>
                    <td colSpan="3">No Electronics products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
