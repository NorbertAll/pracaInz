import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';

const QuizResult = () => {
    const { code } = useParams();
    const [result, setResult] = useState(null);

    useEffect(() => {
        axios.post(
            `http://localhost:8000/api/check_feedback/${code}/`,
            JSON.parse(localStorage.getItem("answers") || "{}")
        )
            .then(res => {
                setResult(res.data);
            })
            .catch(err => {
                console.error("Błąd pobierania wyników:", err);
            });
    }, [code]);

    if (!result) return <div>Ładowanie wyników...</div>;

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>Wynik: {result.result.score}%</Typography>
            <Typography variant="h6" gutterBottom>
                {result.result.passed ? "✅ Zdałeś test!" : "❌ Nie zdałeś testu."}
            </Typography>

            {result.questions
                .filter(q => q.user_answers && q.user_answers.length > 0)
                .map((q, index) => {
                    const hasAnswer = q.user_answers && q.user_answers.length > 0 && q.user_answers[0] !== "brak odpowiedzi";

                    return (
                        <Box key={index} my={4}>
                            <Typography variant="h6">{q.question}</Typography>
                            <List>
                                {q.answers.map((ans, i) => {
                                    const isCorrect = q.correct_answers.includes(ans);
                                    const isUserAnswer = q.user_answers.includes(ans);

                                    let color = "inherit";
                                    if (isCorrect && isUserAnswer) color = "green";
                                    else if (!isCorrect && isUserAnswer) color = "red";
                                    else if (isCorrect) color = "green";

                                    return (
                                        <ListItem key={i} dense>
                                            <ListItemText
                                                primary={ans}
                                                primaryTypographyProps={{ style: { color } }}
                                            />
                                        </ListItem>
                                    );
                                })}

                                {!hasAnswer && (
                                    <ListItem dense>
                                        <ListItemText
                                            primary="Brak odpowiedzi"
                                            primaryTypographyProps={{
                                                style: { fontStyle: "italic", color: "gray" }
                                            }}
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </Box>
                    );
                })}
            <Box mt={4}>
                <Button variant="contained" color="primary" onClick={() => window.location.href = '/exapmplequiz'}>
                    ← Powrót do listy quizów
                </Button>
            </Box>
        </Container>
    );
};

export default QuizResult;
