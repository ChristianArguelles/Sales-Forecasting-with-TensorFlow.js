import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Table } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import Papa from "papaparse";
import * as tf from "@tensorflow/tfjs";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const App = () => {
  const [chartData, setChartData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const parsedData = result.data.map((row) => ({
            sales_date: row.sales_date,
            product_description: row.product_description,
            quantity_sold: parseInt(row.quantity_sold, 10),
          }));
          setTableData(parsedData);

          const groupedData = parsedData.reduce((acc, item) => {
            acc[item.sales_date] = (acc[item.sales_date] || 0) + item.quantity_sold;
            return acc;
          }, {});

          const labels = Object.keys(groupedData);
          const quantities = Object.values(groupedData);

          setChartData({
            labels,
            datasets: [
              {
                label: "Quantity Sold",
                data: quantities,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.4,
              },
            ],
          });

          trainAndPredict(labels, quantities);
        },
      });
    }
  };

  const trainAndPredict = async (labels, quantities) => {
    // Prepare the data for TensorFlow.js
    const months = labels.map((label, index) => index + 1); // Convert months to numeric indices
    const inputs = tf.tensor2d(months, [months.length, 1]); // Convert to 2D tensor
    const outputs = tf.tensor2d(quantities, [quantities.length, 1]);

    // Define a simple linear regression model
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

    // Train the model
    await model.fit(inputs, outputs, { epochs: 200 });

    // Predict future values
    const futureMonths = Array.from({ length: 6 }, (_, i) => months.length + i + 1); // Predict next 6 months
    const futureInputs = tf.tensor2d(futureMonths, [futureMonths.length, 1]);
    const predictions = model.predict(futureInputs);

    // Extract predictions
    const predictedValues = Array.from(predictions.dataSync());
    setPredictedData(predictedValues);

    // Update chart with predicted data
    setChartData((prevData) => ({
      ...prevData,
      labels: [...prevData.labels, ...futureMonths.map((m) => `2024-${m}`)],
      datasets: [
        ...prevData.datasets,
        {
          label: "Predicted Quantity",
          data: [...prevData.datasets[0].data, ...predictedValues],
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderDash: [5, 5], // Dashed line for predictions
          tension: 0.4,
        },
      ],
    }));
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h3>Sales Data Visualization with Prediction</h3>
            </Card.Header>
            <Card.Body>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Upload CSV File</Form.Label>
                <Form.Control type="file" accept=".csv" onChange={handleFileUpload} />
              </Form.Group>
              {chartData && (
                <div className="mt-4">
                  <Line data={chartData} options={{ responsive: true }} />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {tableData.length > 0 && (
        <Row className="justify-content-center mt-5">
          <Col md={10}>
            <Card className="shadow">
              <Card.Header className="bg-secondary text-white text-center">
                <h4>Uploaded Data</h4>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Sales Date</th>
                      <th>Product Description</th>
                      <th>Quantity Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.sales_date}</td>
                        <td>{row.product_description}</td>
                        <td>{row.quantity_sold}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default App;
