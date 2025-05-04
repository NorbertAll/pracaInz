import React from 'react';
import { Typography, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const QuizForm = ({ quiz, odp, handleAnswerChange, sendAnswers }) => (
    <>
        <h1>{quiz.title}</h1>
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
    </>
);

export default QuizForm;
