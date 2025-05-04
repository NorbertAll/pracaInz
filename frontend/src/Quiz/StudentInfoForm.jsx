import React from 'react';
import { Form } from 'react-bootstrap';
import { Button } from '@mui/material';

const StudentInfoForm = ({ formData, handleChange, onNext }) => (
    <Form className="mx-auto" style={{ maxWidth: "300px" }}>
        <Form.Group className="mb-3">
            <Form.Label>Name:</Form.Label>
            <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>Last Name:</Form.Label>
            <Form.Control
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>Indeks:</Form.Label>
            <Form.Control
                type="text"
                name="indeks"
                value={formData.indeks}
                onChange={handleChange}
                required
            />
        </Form.Group>

        <Button variant="contained" onClick={onNext}>Przejdź do testu</Button>
    </Form>
);

export default StudentInfoForm;
