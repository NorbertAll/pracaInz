//old version test.jsx
import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../helpers/Context';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Button, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const Test = () => {
    const [quiz, setQuiz] = useState({});
    const [odp, setOdp] = useState({});
    const { code } = useParams();
    const { setVisi } = useContext(Context);

    useEffect(() => {
        setVisi({ status: false });

        axios.get(`http://localhost:8000/api/quiz/${code}/`)
            .then(res => {
                setQuiz(res.data);
                console.log("dane", res.data);

                const initialAnswers = {};
                res.data.data.forEach((question, idx) => {
                    const questionKey = Object.keys(question)[0];
                    initialAnswers[questionKey] = '';  // Zakładamy, że początkowo odpowiedź to pusty string
                });
                setOdp(initialAnswers);
            });
    }, [code]);

    const handleChange = (questionKey, value) => {
        setOdp(prevOdp => ({
            ...prevOdp,
            [questionKey]: value,  // Ustawiamy odpowiedź na podstawie klucza pytania
        }));
    };

    const sendAnswers = () => {
        console.log("Wysyłam odpowiedzi:", odp);  // Sprawdź dane przed wysłaniem

        axios.post(`http://localhost:8000/api/check/${code}/`, odp)
            .then(response => {
                console.log(response);
                const { resultBool, numberResult } = response.data.data;
                if (resultBool) {
                    alert(`✅ Zdałeś! Wynik: ${numberResult}%`);
                } else {
                    alert(`❌ Nie zdałeś. Wynik: ${numberResult}%`);
                }
            })
            .catch(err => {
                console.error("❌ Błąd wysyłania odpowiedzi:", err);
                if (err.response) {
                    console.error("Odpowiedź serwera:", err.response.data);
                }
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <h1>{quiz.title}</h1>
            {quiz.data && quiz.data.map((answer, idx) => {
                const questionKey = Object.keys(answer)[0];
                const options = Object.values(answer)[0];

                return (
                    <div key={idx}>
                        <Typography component="h1" variant="h5">
                            {questionKey}
                        </Typography>
                        <RadioGroup
                            value={odp[questionKey] || ''}
                            onChange={(e) => handleChange(questionKey, e.target.value)}
                        >
                            {options.map((answerText, id) => (
                                <FormControlLabel
                                    key={id}
                                    value={answerText}
                                    control={<Radio />}
                                    label={answerText}
                                />
                            ))}
                        </RadioGroup>
                    </div>
                );
            })}
            {quiz.data && (
                <Button
                    type="submit"
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={sendAnswers}
                >
                    Submit Answer
                </Button>
            )}
        </Container>
    );
};

export default Test;