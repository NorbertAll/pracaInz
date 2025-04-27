import React, { useState } from 'react';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { useParams } from "react-router-dom";


export const CreateQuiz = props => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        topic: "",
        number_of_questions: 0,
        time: 0,
        required_score_to_pass: 0,
        is_public: true,
        creator: id,
    });

    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/quizes/", formData);
            console.log("Success", response.data);
            setSuccessMessage("Test został pomyślnie zapisany!");
            setError(null);
        } catch (error) {
            console.log(error);
            setError("Wystąpił błąd przy zapisie testu.");
            setSuccessMessage(null);
        }
    };

    return (
        <Container className="mt-4">
            <Card className="p-4 shadow rounded">
                <h2 className="mb-4">Dodaj Test</h2>

                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Dziedzina</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="np. Medycyna, Informatyka"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Temat</Form.Label>
                        <Form.Control
                            type="text"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            placeholder="np. Neuroobrazowanie"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Liczba pytań</Form.Label>
                        <Form.Control
                            type="number"
                            name="number_of_questions"
                            value={formData.number_of_questions}
                            onChange={handleChange}
                            min={1}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Ile minut na test</Form.Label>
                        <Form.Control
                            type="number"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            min={1}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Procent wymagany do zaliczenia</Form.Label>
                        <Form.Control
                            type="number"
                            name="required_score_to_pass"
                            value={formData.required_score_to_pass}
                            onChange={handleChange}
                            min={0}
                            max={100}
                        />
                    </Form.Group>

                    <Button variant="warning" type="submit" className="w-100 mt-3">
                        Zapisz
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};