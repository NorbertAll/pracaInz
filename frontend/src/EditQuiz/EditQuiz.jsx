import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import { useParams } from "react-router-dom";
import { Container, Row, Col, Alert } from 'react-bootstrap';

export const EditQuiz = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        topic: "",
        number_of_questions: 0,
        time: 0,
        required_score_to_pass: 0,
        is_public: true,
        creator: 1,
        code: "",
    });

    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/quizes/`)
            .then(res => {
                const quiz = res.data.find(ob => ob.id == id);
                if (quiz) {
                    setFormData({
                        id: quiz.id,
                        name: quiz.name,
                        topic: quiz.topic,
                        number_of_questions: quiz.number_of_questions,
                        time: quiz.time,
                        required_score_to_pass: quiz.required_score_to_pass,
                        is_public: quiz.is_public,
                        creator: quiz.creator,
                        code: quiz.code,
                    });
                }
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8000/api/quizes/${id}/`, formData);
            setSuccessMessage("Test zaktualizowany!");
        } catch (error) {
            setError("Wystąpił błąd podczas aktualizacji.");
        }
    };

    return (
        <Container fluid className="py-5 d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '85vh' }}>
            <Row className="w-100 justify-content-center">
                <Col xs={10} sm={8} md={6} lg={5}>
                    <div className="p-4 rounded shadow-sm bg-white">
                        <h3 className="text-center mb-4">Edytuj Test</h3>

                        {error && <Alert variant="danger">{error}</Alert>}
                        {successMessage && <Alert variant="success">{successMessage}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Id:</Form.Label>
                                <Form.Control type="text" value={formData.id} disabled readOnly />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Dziedzina:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Temat:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="topic"
                                    value={formData.topic}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Liczba pytań:</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="number_of_questions"
                                    value={formData.number_of_questions}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Czas trwania (minuty):</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Próg zdania (%):</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="required_score_to_pass"
                                    value={formData.required_score_to_pass}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Quiz publiczny"
                                    name="is_public"
                                    checked={formData.is_public}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Button type="submit" variant="warning" className="w-100">Zapisz zmiany</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};
