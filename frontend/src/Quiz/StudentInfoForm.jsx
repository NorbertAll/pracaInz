import React from 'react';
import { Form } from 'react-bootstrap';

import Button from 'react-bootstrap/Button';

const StudentInfoForm = ({ topic, required_score_to_pass, number_of_questions, time, formData, handleChange, onNext, anuluj }) => (

    <Form className="mx-auto" style={{ maxWidth: "300px" }}>
        <br />
        <h3>{topic}</h3><br />
        <p>Próg zdania: {required_score_to_pass}%</p>
        <p>Liczba pytań: {number_of_questions}</p>
        <p>Czas na rzowiązanie testu: {time / 60}min</p>
        <br />
        <h3>Podaj dane</h3>
        <Form.Group className="mb-3">
            <Form.Label>Imię:</Form.Label>
            <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>Nazwisko:</Form.Label>
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

        <Button variant="primary" onClick={onNext}>Przejdź do testu</Button>&nbsp; &nbsp;

        <Button variant="danger" onClick={anuluj}>Anuluj</Button>
    </Form>
);

export default StudentInfoForm;
