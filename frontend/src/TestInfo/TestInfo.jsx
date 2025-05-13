import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import { useParams } from "react-router-dom";
import { Container, Row, Col, Alert } from 'react-bootstrap';

export const TestInfo = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({

        name: "",
        topic: "",
        number_of_questions: 0,
        time: 0,
        required_score_to_pass: 0,
        is_public: true,
        creator: 1,

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
        <>
            <h3 className="text-center mb-4">Dane quizu</h3>







            <p>Dziedzina:{formData.name}</p>
            <p>Temat:{formData.topic}</p>
            <p>Liczba pytań:{formData.number_of_questions}</p>
            <p>Czas trwania: {formData.time} min </p>
            <p>Próg zdania: {formData.required_score_to_pass} min </p>









            <Button type="submit" variant="warning" className="w-100">Cofnij do listy quizów </Button>
            <Button type="submit" variant="primary" className="w-100">Zaczni quiz </Button>

        </>
    );
};
