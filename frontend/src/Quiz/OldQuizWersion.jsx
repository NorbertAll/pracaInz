import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../helpers/Context';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Form, Alert, Spinner, Row, Col } from 'react-bootstrap';

const Quiz = () => {
    const [formData, setFormData] = useState({

        name: "",
        last_name: "",
        indeks: "",
        quiz_id: 0,
        odpo: {}
    });
    const [result, setResult] = useState(null);
    const [quiz, setQuiz] = useState({});
    const [odp, setOdp] = useState({});

    const [parseOdp, setParseOdp] = useState({});
    const { code } = useParams();
    const { setVisi } = useContext(Context);
    const navigate = useNavigate();
    useEffect(() => {
        setVisi({ status: false });
        axios.get(`http://localhost:8000/api/quiz/${code}/`)
            .then(res => {
                setQuiz(res.data);
                const initialAnswers = {};
                res.data.data.forEach((question) => {
                    const questionKey = Object.keys(question)[0];
                    initialAnswers[questionKey] = []; // zachowujemy jako tablica
                });
                setOdp(initialAnswers);
                console.log("Dane");

                console.log(res.data);

            });
    }, [code]);

    const handleAnswerChange = (questionKey, answerText) => {
        setOdp(prevOdp => ({
            ...prevOdp,
            [questionKey]: [answerText] // tylko jedna odpowiedź jako element w tablicy
        }));
    };
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const sendAnswers = () => {
        console.log("wyśli");

        const allAnswered = Object.values(odp).every(ans => ans.length > 0);
        if (!allAnswered) {
            alert("Odpowiedz na wszystkie pytania przed wysłaniem.");
            return;
        }
        const payload = {
            name: formData.name,
            last_name: formData.last_name,
            indeks: formData.indeks,
            quiz_id: quiz.id,
            answers: odp
        };
        console.log(typeof odp);



        //
        axios.post(`http://localhost:8000/api/check/${code}/`, payload)
            .then(res => {
                setResult(res.data);
            })
            .catch(err => {
                console.error("Błąd pobierania wyników:", err);
            });

        //
    };

    return (
        <Container component="main" maxWidth="xs">

            <h1>{quiz.title}</h1>
            <Form className="mx-auto" style={{ maxWidth: "300px" }}>
                <Form.Group className="mb-3">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label>Last Name:</Form.Label>
                    <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Last Name"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Label>Indeks:</Form.Label>
                    <Form.Control
                        type="text"
                        name="indeks"
                        value={formData.indeks}
                        onChange={handleChange}
                        placeholder="Indeks"
                        required
                    />
                </Form.Group>
            </Form>
            {quiz.data && quiz.data.map((questionData, i) => {
                const questionKey = Object.keys(questionData)[0];
                const answers = questionData[questionKey];

                return (
                    <div key={i}>
                        <Typography component='h1' variant="h6" sx={{ mt: 3 }}>
                            {questionKey}
                        </Typography>
                        <RadioGroup>
                            {answers.map((answerText, id) => (
                                <FormControlLabel
                                    key={id}
                                    control={
                                        <Radio
                                            value={answerText}
                                            color="primary"
                                            checked={odp[questionKey]?.[0] === answerText}
                                            onChange={() => handleAnswerChange(questionKey, answerText)}
                                        />
                                    }
                                    label={answerText}
                                />
                            ))}
                        </RadioGroup>
                    </div>
                );
            })}
            <Button
                variant="contained"
                endIcon={<SendIcon />}
                type="submit"
                onClick={sendAnswers}
                sx={{ mt: 4 }}
            >
                Zatwierdź odpowiedzi
            </Button>
        </Container>
    );
};

export default Quiz;