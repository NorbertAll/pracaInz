import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";

export const QuestionsPanel = () => {
    const { id } = useParams();
    const [questions, setQuestions] = useState([]);
    const [textQuestion, setTextQuestion] = useState("");
    const [answers, setAnswers] = useState([
        { text: "", correct: false },
        { text: "", correct: false }
    ]);
    const [edytowaneId, setEdytowaneId] = useState(null);

    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/questions_select/${id}/`);
            setQuestions(response.data.questions || []);
        } catch (error) {
            console.error("❌ Błąd pobierania pytań:", error);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const zmienTekstOdpowiedzi = (index, text) => {
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
        if (nowe[index].correct && nowe.length > 2) {
            nowe[0].correct = true;
        }
        nowe.splice(index, 1);
        setAnswers(nowe);
    };

    const resetujFormularz = () => {
        setTextQuestion("");
        setAnswers([
            { text: "", correct: false },
            { text: "", correct: false }
        ]);
        setEdytowaneId(null);
    };

    const zapiszPytanie = async () => {
        if (!textQuestion.trim() || answers.length < 2) {
            alert("Wprowadź treść pytania i co najmniej 2 odpowiedzi.");
            return;
        }

        try {
            let questionId = edytowaneId;

            if (questionId) {
                await axios.patch(`http://127.0.0.1:8000/api/questions/${questionId}/`, {
                    text: textQuestion
                });
            } else {
                const res = await axios.post(`http://127.0.0.1:8000/api/questions/`, {
                    text: textQuestion,
                    quiz: id
                });
                questionId = res.data.id;
            }

            for (const ans of answers) {
                if (ans.id) {
                    await axios.patch(`http://127.0.0.1:8000/api/answers/${ans.id}/`, {
                        text: ans.text,
                        correct: ans.correct
                    });
                } else {
                    await axios.post(`http://127.0.0.1:8000/api/answers/`, {
                        text: ans.text,
                        correct: ans.correct,
                        question: questionId
                    });
                }
            }

            await fetchQuestions();
            resetujFormularz();
            alert("Pytanie zapisane!");
        } catch (err) {
            console.error("❌ Błąd przy zapisie:", err);
            alert("Nie udało się zapisać pytania.");
        }
    };

    const rozpocznijEdycje = (pytanie) => {
        setEdytowaneId(pytanie.id);
        setTextQuestion(pytanie.text);
        setAnswers((pytanie.answers || []).map(ans => ({
            id: ans.id,
            text: ans.text,
            correct: ans.correct
        })));
    };

    const deleteQuestion = async (idQuestion) => {
        if (!window.confirm("Czy na pewno chcesz usunąć to pytanie?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/questions/${idQuestion}/`);
            await fetchQuestions();
            alert("Pytanie usunięte!");
        } catch (err) {
            console.error("❌ Błąd usuwania:", err);
            alert("Nie udało się usunąć pytania.");
        }
    };

    return (
        <div className="container mt-4">
            <h4>{edytowaneId ? "Edytuj pytanie" : "Dodaj pytanie"}</h4>

            <input
                className="form-control mb-3"
                placeholder="Treść pytania"
                value={textQuestion}
                onChange={(e) => setTextQuestion(e.target.value)}
            />

            {answers.map((odp, index) => (
                <div key={index} className="input-group mb-2">
                    <input
                        className="form-control"
                        placeholder={`Odpowiedź ${index + 1}`}
                        value={odp.text}
                        onChange={(e) => zmienTekstOdpowiedzi(index, e.target.value)}
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
                    <button className="btn btn-secondary" onClick={resetujFormularz}>
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
                                    {(p.answers || []).map((o, i) => (
                                        <li key={i}>
                                            {o.text}{" "}
                                            {o.correct && <strong className="text-success">(Poprawna)</strong>}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <button className="btn btn-sm btn-warning me-2" onClick={() => rozpocznijEdycje(p)}>
                                    Edytuj
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => deleteQuestion(p.id)}>
                                    Usuń
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
            <br />
            <button className="btn btn-primary" onClick={() => window.location.href = '/userpanel'}>
                ← Powrót do Panelu Użytkownika
            </button>
            <br />
        </div>
    );
};