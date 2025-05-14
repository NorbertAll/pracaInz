import React, { useEffect, useState } from 'react';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';

export const TestInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/quizes/`)
            .then(res => {
                const quiz = res.data.find(ob => ob.id == id);
                if (quiz) {
                    setFormData(quiz);
                } else {
                    setError("Nie znaleziono quizu.");
                }
            })
            .catch(() => setError("Błąd podczas pobierania danych quizu."))
            .finally(() => setLoading(false));
    }, [id]);

    const handleBack = () => navigate("/exapmplequiz");
    const handleStart = () => navigate(`/test/${formData.code}`);

    if (loading) {
        return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <Alert variant="danger" className="text-center mt-5">{error}</Alert>;
    }

    return (
        <Container className="mt-5">
            <Card className="shadow">
                <Card.Body>
                    {console.log(formData)}
                    <h3 className="text-center mb-4">Informacje o quizie</h3>

                    <Col><strong>Dziedzina:</strong> {formData.name}</Col>
                    <br />
                    <Col><strong>Temat:</strong> {formData.topic}</Col>
                    <br />

                    <Col><strong>Liczba pytań:</strong> {formData.number_of_questions}</Col>
                    <br />
                    <Col><strong>Czas trwania:</strong> {formData.time} min</Col>
                    <br />
                    <Col><strong>Próg zdania:</strong> {formData.required_score_to_pass}%</Col>

                </Card.Body>
            </Card>

            <Row className="mt-4">
                <Col md={6}>
                    <Button variant="secondary" className="w-100" onClick={handleBack}>
                        Cofnij do listy quizów
                    </Button>
                </Col>
                <Col md={6}>
                    <Button variant="primary" className="w-100" onClick={handleStart}>
                        Zacznij quiz
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};