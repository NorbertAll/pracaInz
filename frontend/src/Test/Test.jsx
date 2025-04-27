import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../helpers/Context';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Button, RadioGroup, FormControlLabel, Radio, Checkbox } from '@mui/material';
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
                const initialAnswers = {};
                res.data.data.forEach((question, i) => {
                    const questionKey = Object.keys(question)[0];
                    initialAnswers[questionKey] = []; // Initialize an empty array for answers
                });
                setOdp(initialAnswers);
            });
    }, [code]);

    const handleAnswerChange = (questionKey, answerText) => {
        setOdp(prevOdp => {
            const updatedAnswers = { ...prevOdp };
            const index = updatedAnswers[questionKey].indexOf(answerText);
            if (index > -1) {
                updatedAnswers[questionKey].splice(index, 1); // Remove answer
            } else {
                updatedAnswers[questionKey].push(answerText); // Add answer
            }
            return updatedAnswers;
        });
    };

    const sendAnswers = () => {
        axios.post(`http://localhost:8000/api/check/${code}/`, odp)
            .then(response => {
                const result = response.data.data;
                if (result.resultBool) {
                    alert(`Zdałeś z wynikiem: ${result.numberResult}%`);
                } else {
                    alert(`Niezadłeś z wynikiem: ${result.numberResult}%`);
                }
            })
            .catch(error => {
                console.error('Błąd wysyłania odpowiedzi:', error);
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <h1>{quiz.title}</h1>
            {quiz.data && quiz.data.map((questionData, i) => {
                const questionKey = Object.keys(questionData)[0];
                const answers = questionData[questionKey];

                return (
                    <div key={i}>
                        <Typography component='h1' variant="h5">
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
                                            checked={odp[questionKey]?.includes(answerText)}
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
            <Button variant="contained" endIcon={<SendIcon />} onClick={sendAnswers}>
                Submit Answer
            </Button>
        </Container>
    );
};

export default Test;