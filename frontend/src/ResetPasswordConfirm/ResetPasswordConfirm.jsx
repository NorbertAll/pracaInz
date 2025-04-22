import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

export const ResetPasswordConfirm = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        new_password: '',
        confirm_password: ''
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.new_password !== formData.confirm_password) {
            setError('Hasła muszą być takie same.');
            return;
        }

        setIsLoading(true);
        try {
            await axios.post('http://127.0.0.1:8000/api/accounts/password-reset-confirm/', {
                uid,
                token,
                new_password: formData.new_password
            });

            setSuccessMessage('Hasło zostało zmienione. Możesz się teraz zalogować.');
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            console.error(err);
            setError('Nie udało się zresetować hasła. Link może być nieważny.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container fluid className="py-5 d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '85vh' }}>
            <Row className="w-100 justify-content-center">
                <Col xs={10} sm={8} md={5} lg={4} xl={3}>
                    <div className="p-4 rounded shadow-sm bg-white">
                        <h3 className="text-center mb-4">Ustaw nowe hasło</h3>

                        {error && <Alert variant="danger">{error}</Alert>}
                        {successMessage && <Alert variant="success">{successMessage}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nowe hasło</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="new_password"
                                    value={formData.new_password}
                                    onChange={handleChange}
                                    required
                                    size="sm"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Powtórz hasło</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    required
                                    size="sm"
                                />
                            </Form.Group>

                            <div className="d-grid">
                                <Button type="submit" variant="primary" disabled={isLoading}>
                                    {isLoading ? 'Zapisuję...' : 'Ustaw hasło'}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};
