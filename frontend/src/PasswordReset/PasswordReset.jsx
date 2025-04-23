import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';

export const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            await axios.post('http://127.0.0.1:8000/api/accounts/password/reset/', { email });
            setSuccessMessage('Link do resetu hasła został wysłany na podany e-mail.');
        } catch (err) {
            console.error(err);
            setError('Nie udało się wysłać maila. Sprawdź adres i spróbuj ponownie.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container fluid className="py-5 d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '85vh' }}>
            <Row className="w-100 justify-content-center">
                <Col xs={10} sm={8} md={5} lg={4} xl={3}>
                    <div className="p-4 rounded shadow-sm bg-white">
                        <h3 className="text-center mb-4">Reset hasła</h3>

                        {error && <Alert variant="danger">{error}</Alert>}
                        {successMessage && <Alert variant="success">{successMessage}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Adres e-mail</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="np. jan@domena.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    size="sm"
                                />
                            </Form.Group>

                            <div className="d-grid">
                                <Button variant="primary" type="submit" disabled={isLoading}>
                                    {isLoading ? 'Wysyłanie...' : 'Wyślij link resetujący'}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};