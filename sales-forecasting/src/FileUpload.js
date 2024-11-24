import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';

function FileUpload({ onFileUpload }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        const rows = data.split('\n').map((row) => row.split(','));
        // You can further process the rows as needed
        onFileUpload(rows);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="shadow p-4 my-5">
      <Card.Body>
        <Card.Title className="text-center mb-4">Upload Sales Data</Card.Title>
        <Form>
          <Form.Group controlId="formFile">
            <Form.Label>Choose a CSV file</Form.Label>
            <Form.Control type="file" accept=".csv" onChange={handleFileChange} />
          </Form.Group>
          <Button variant="primary" className="mt-3 w-100" type="button">
            Upload
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default FileUpload;
