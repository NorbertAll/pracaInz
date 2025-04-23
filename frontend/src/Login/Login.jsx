import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';

export function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
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
            const response = await axios.post("http://127.0.0.1:8000/api/accounts/login/", formData);
            setSuccessMessage("Logowanie zakończone sukcesem.");
            localStorage.setItem("accessToken", response.data.tokens.access);
            localStorage.setItem("refreshToken", response.data.tokens.refresh);
            navigate("/");
            window.location.reload();
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
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6} className="text-center">
                    <h2 className="mb-4">Logowanie</h2>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}

                    <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "300px" }}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Wprowadź email"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Hasło:</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Wprowadź hasło"
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
                                    /> Logowanie...
                                </>
                            ) : (
                                "Zaloguj się"
                            )}
                        </Button>
                        <div className="mt-3 d-flex justify-content-between">
                            <Link to="/passwordreset" className="small" style={{ color: "primary", textDecoration: "none" }}>Nie pamiętasz hasła?</Link>
                            <Link to="/registraion" className="small" style={{ color: "primary", textDecoration: "none" }}> Nie masz hasła: Zarejestruj się</Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}