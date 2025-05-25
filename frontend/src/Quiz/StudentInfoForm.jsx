import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

const StudentInfoForm = ({ topic, required_score_to_pass, number_of_questions, time, formData, handleChange, onNext, anuluj }) => {
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
            onNext();
        }

        setValidated(true);
    };

    return (
        <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className="mx-auto"
            style={{ maxWidth: "300px" }}
        >
            <br />
            <h3>{topic}</h3><br />
            <p>Próg zdania: {required_score_to_pass}%</p>
            <p>Liczba pytań: {number_of_questions}</p>
            <p>Czas na rozwiązanie testu: {time / 60} min</p>
            <br />
            <h3>Podaj dane</h3>

            <Form.Group className="mb-3" controlId="name">
                <Form.Label>Imię:</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Proszę podać imię.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="last_name">
                <Form.Label>Nazwisko:</Form.Label>
                <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Proszę podać nazwisko.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="indeks">
                <Form.Label>Indeks:</Form.Label>
                <Form.Control
                    type="text"
                    name="indeks"
                    value={formData.indeks}
                    onChange={handleChange}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Proszę podać numer indeksu.
                </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">Przejdź do testu</Button>&nbsp; &nbsp;
            <Button variant="danger" onClick={anuluj}>Anuluj</Button>
        </Form>
    );
};

export default StudentInfoForm;
