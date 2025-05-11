import React, { useState } from 'react';
import axios from "axios";
import { Form, Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export function Registration() {

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password1: "",
        password2: "",
    });

    const [isLoading, setIsLoading] = useState(false);
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
        if (isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/accounts/register/", formData);
            setSuccessMessage("Rejestracja zakończona sukcesem!");
        } catch (error) {
            if (error.response && error.response.data) {
                Object.keys(error.response.data).forEach(field => {
                    const errorMessages = error.response.data[field];
                    if (errorMessages && errorMessages.length > 0) {
                        setError(errorMessages[0]);
                    }
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container fluid className="py-5 d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '85vh' }}>
            <Row className="w-100 justify-content-center">
                <Col xs={10} sm={8} md={6} lg={4} xl={3}>
                    <div className="p-4 rounded shadow-sm bg-white text-center">
                        <h2 className="mb-4">Rejestracja</h2>

                        {error && <Alert variant="danger">{error}</Alert>}
                        {successMessage && <Alert variant="success">{successMessage}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3 text-start">
                                <Form.Label>Nazwa użytkownika:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Nazwa użytkownika"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 text-start">
                                <Form.Label>Email:</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 text-start">
                                <Form.Label>Hasło:</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password1"
                                    value={formData.password1}
                                    onChange={handleChange}
                                    placeholder="Hasło"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4 text-start">
                                <Form.Label>Powtórz hasło:</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password2"
                                    value={formData.password2}
                                    onChange={handleChange}
                                    placeholder="Powtórz hasło"
                                    required
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isLoading}
                                className="w-100"
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        /> Rejestracja...
                                    </>
                                ) : (
                                    "Zarejestruj się"
                                )}
                            </Button>
                            <div className="mt-3 d-flex justify-content-between">

                                <Link to="/login" className="small" style={{ color: "primary", textDecoration: "none" }}> Masz konto: Zaloguj się</Link>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}