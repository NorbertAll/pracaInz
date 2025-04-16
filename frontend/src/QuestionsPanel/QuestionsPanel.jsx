import React, { useState, useEffect } from "react";
import axios from "axios"
import { useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';

export const QuestionsPanel = props => {
    const { id } = useParams();
    const [questions, setQuestions] = useState([]);
    const [textQuestion, setTextQuestions] = useState("");
    const [answers, setAnswers] = useState([
        { id: 0, text: "", correct: false },
        { id: 0, text: "", correct: false }
    ]);
    const [edytowaneId, setEdytowaneId] = useState(null);
    useEffect(() => {

        const downloadAnswerAndQuestions = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/questions_select/${id}`);
                console.log(res.data);

                const answerss = res.data.answers.map(answer => ({

                    id: answer.id,
                    text: answer.text,
                    correct: answer.correct,
                }));
                const question = {
                    id: res.data.question.id,
                    text: res.data.question.text,
                    answers: answerss
                }
                console.log([question]);

                setQuestions([question])



            }
            catch (err) {
                console.error("Błąd pobierania pytań:", err);
            }
        };
        downloadAnswerAndQuestions();

    }, []);
    const zmientaxtOdpowiedzi = (index, text) => {
        const nowe = [...answers];
        nowe[index].text = text;
        setAnswers(nowe);
    };

    const ustawPoprawna = (index) => {
        const nowe = answers.map((o, i) => ({
            ...o,
            correct: i === index
        }));
        setAnswers(nowe);
    };

    const dodajOdpowiedz = () => {
        setAnswers([...answers, { text: "", correct: false }]);
    };

    const usunOdpowiedz = (index) => {
        const nowe = [...answers];
        if (nowe[index].correct && nowe.length > 1) {
            nowe[0].correct = true;
        }
        nowe.splice(index, 1);
        setAnswers(nowe);
    };

    const zapiszPytanie = () => {
        if (!textQuestion.trim()) return;

        if (edytowaneId !== null) {
            // aktualizacja istniejącego questions
            const nowe = questions.map((p) =>
                p.id === edytowaneId
                    ? {
                        ...p,
                        text: textQuestion,
                        answers: [...answers]
                    }
                    : p
            );
            setQuestions(nowe);
        } else {
            // dodanie nowego questions
            const nowePytanie = {
                id: Date.now(),
                text: textQuestion,
                answers: [...answers]
            };
            setQuestions([...questions, nowePytanie]);
        }

        // reset
        setTextQuestions("");
        setAnswers([
            { text: "", correct: false },
            { text: "", correct: false }
        ]);
        setEdytowaneId(null);
    };

    const rozpocznijEdycje = (pytanie) => {
        setEdytowaneId(pytanie.id);
        setTextQuestions(pytanie.text);
        setAnswers([...pytanie.answers]);
    };

    const anulujEdycje = () => {
        setEdytowaneId(null);
        setTextQuestions("");
        setAnswers([
            { text: "", correct: false },
            { text: "", correct: false }
        ]);
    };
    const handleSubmit = async (e) => {
        const question = questions[0];

        if (!question || !question.text || question.answers.length < 2) {
            alert("Brakuje danych pytania lub odpowiedzi.");
            return;
        }

        try {
            let questionId = question.id;

            if (typeof questionId !== "number" || questionId < 1) {
                const res = await axios.post("http://127.0.0.1:8000/api/questions/", {
                    text: question.text,
                    quiz: id
                });
                questionId = res.data.id;
            } else {
                await axios.patch(`http://127.0.0.1:8000/api/questions/${questionId}/`, {
                    text: question.text
                });
            }

            for (const ans of question.answers) {
                if (ans.id) {
                    await axios.patch(`http://127.0.0.1:8000/api/answers/${ans.id}/`, {
                        text: ans.text,
                        correct: ans.correct
                    });
                } else {
                    await axios.post("http://127.0.0.1:8000/api/answers/", {
                        text: ans.text,
                        correct: ans.correct,
                        question: questionId
                    });
                }
            }

            alert("Zapisano pytanie i odpowiedzi!");

        } catch (err) {
            console.error("Błąd przy zapisie:", err);
            alert("Coś poszło nie tak!");
        }
    };
    return (
        <div className="container mt-4">
            <h4>{edytowaneId ? "Edytuj pytanie" : "Dodaj pytanie"}</h4>
            <input
                className="form-control mb-3"
                placeholder="Treść questions"
                value={textQuestion}
                onChange={(e) => setTextQuestions(e.target.value)}
            />

            {answers.map((odp, index) => (
                <div key={index} className="input-group mb-2">
                    <input
                        className="form-control"
                        placeholder={`Odpowiedź ${index + 1}`}
                        value={odp.text}
                        onChange={(e) => zmientaxtOdpowiedzi(index, e.target.value)}
                    />
                    <div className="input-group-text">
                        <input
                            type="radio"
                            name="correct"
                            checked={odp.correct}
                            onChange={() => ustawPoprawna(index)}
                        />
                    </div>
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => usunOdpowiedz(index)}
                        disabled={answers.length <= 2}
                    >
                        −
                    </button>
                </div>
            ))}

            <button className="btn btn-outline-primary me-2" onClick={dodajOdpowiedz}>
                + Dodaj odpowiedź
            </button>

            <div className="mt-3">
                <button className="btn btn-success me-2" onClick={zapiszPytanie}>
                    {edytowaneId ? "Zapisz zmiany" : "Dodaj pytanie"}
                </button>
                {edytowaneId && (
                    <button className="btn btn-secondary" onClick={anulujEdycje}>
                        Anuluj
                    </button>
                )}
            </div>

            <hr />
            <h5 className="mt-4">Lista pytań</h5>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Pytanie</th>
                        <th>Odpowiedzi</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map((p) => (
                        <tr key={p.id}>
                            <td>{p.text}</td>
                            <td>
                                <ul className="mb-0">
                                    {p.answers.map((o, i) => (
                                        <li key={i}>
                                            {o.text}{" "}
                                            {o.correct && (
                                                <strong className="text-success">(Poprawna)</strong>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <button className="btn btn-sm btn-warning" onClick={() => rozpocznijEdycje(p)}>
                                    Edytuj
                                </button>
                            </td>
                        </tr>
                    ))}
                    {questions.length === 0 && (
                        <tr>
                            <td colSpan="3" className="text-center text-muted">
                                Brak pytań
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Button variant="warning" type='submit' onClick={handleSubmit}>Edytuj</Button>
        </div>
    );
}