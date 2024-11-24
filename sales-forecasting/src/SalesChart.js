import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Card } from 'react-bootstrap';

Chart.register(...registerables);

function SalesChart() {
  const chartRef = useRef(null);
  let chartInstance = useRef(null);

  useEffect(() => {
    // Example dataset
    const rawData = [
      { sales_date: "2024-01", product_description: "Product A", quantity_sold: 100 },
      { sales_date: "2024-02", product_description: "Product B", quantity_sold: 350 },
      { sales_date: "2024-03", product_description: "Product A", quantity_sold: 200 },
      { sales_date: "2024-04", product_description: "Product C", quantity_sold: 150 },
      { sales_date: "2024-05", product_description: "Product B", quantity_sold: 300 },
    ];

    // Extract unique products
    const products = [...new Set(rawData.map(item => item.product_description))];

    // Extract labels (sales dates)
    const labels = [...new Set(rawData.map(item => item.sales_date))];

    // Prepare datasets for Chart.js
    const datasets = products.map(product => {
      const productData = labels.map(label => {
        const matchingItem = rawData.find(item => item.sales_date === label && item.product_description === product);
        return matchingItem ? matchingItem.quantity_sold : 0; // Default to 0 if no data exists
      });

      return {
        label: product,
        data: productData,
        borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
        fill: true,
        tension: 0.3,
      };
    });

    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels, // X-axis labels (e.g., sales_date)
        datasets: datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Sales Data by Product",
          },
        },
        scales: {
          x: {
            type: "category",
            title: {
              display: true,
              text: "Sales Date",
            },
          },
          y: {
            title: {
              display: true,
              text: "Quantity Sold",
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <Card className="shadow p-4 my-5">
      <Card.Body>
        <Card.Title className="text-center mb-4">Sales Chart</Card.Title>
        <canvas ref={chartRef} />
      </Card.Body>
    </Card>
  );
}

export default SalesChart;
