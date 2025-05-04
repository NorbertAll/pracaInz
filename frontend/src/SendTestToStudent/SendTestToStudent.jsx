import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function SendTestToStudent() {
    const { quizId } = useParams();
    const [students, setStudents] = useState([]);
    const [form, setForm] = useState({ name: '', surname: '', email: '' });
    const [isSending, setIsSending] = useState(false);
    const [quizCode, setQuizCode] = useState('');

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await axios.get(`http://127.0.0.1:8000/api/quizes/${quizId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setQuizCode(res.data.code);
            } catch (err) {
                console.error("Błąd podczas pobierania quizu:", err);
            }
        };
        if (quizId) fetchQuiz();
    }, [quizId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addStudent = () => {
        if (!form.name || !form.surname || !form.email) {
            alert("Wypełnij wszystkie pola");
            return;
        }
        setStudents([...students, form]);
        setForm({ name: '', surname: '', email: '' });
    };

    const removeStudent = (index) => {
        const updated = [...students];
        updated.splice(index, 1);
        setStudents(updated);
    };

    const sendEmails = async () => {
        if (students.length === 0) {
            alert("Lista studentów jest pusta");
            return;
        }

        if (!quizCode) {
            alert("Nie udało się pobrać kodu quizu");
            return;
        }

        setIsSending(true);
        try {
            const token = localStorage.getItem("accessToken");

            await axios.post("http://127.0.0.1:8000/api/send-mails/", {
                students,
                code: quizCode
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            alert("Maile zostały wysłane!");
            setStudents([]);
        } catch (error) {
            console.error("Błąd wysyłki maili:", error);
            alert("Wystąpił błąd podczas wysyłania wiadomości");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Wysyłanie testu studentom</h2>

            <div className="row g-2 align-items-end mb-3">
                <div className="col">
                    <label>Imię:</label>
                    <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} />
                </div>
                <div className="col">
                    <label>Nazwisko:</label>
                    <input type="text" className="form-control" name="surname" value={form.surname} onChange={handleChange} />
                </div>
                <div className="col">
                    <label>Email:</label>
                    <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} />
                </div>
                <div className="col-auto">
                    <button className="btn btn-primary" onClick={addStudent}>Dodaj</button>
                </div>
            </div>

            <h4>Lista studentów:</h4>
            <ul className="list-group mb-3">
                {students.map((s, i) => (
                    <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{s.name} {s.surname} — {s.email}</span>
                        <button className="btn btn-sm btn-danger" onClick={() => removeStudent(i)}>Usuń</button>
                    </li>
                ))}
            </ul>

            <button className="btn btn-success" onClick={sendEmails} disabled={isSending || !quizCode}>
                {isSending ? "Wysyłanie..." : "Wyślij maile"}
            </button>

            {!quizCode && (
                <div className="text-danger mt-3">
                    Nie udało się załadować kodu quizu. Upewnij się, że quiz istnieje.
                </div>
            )}
        </div>
    );
}

export default SendTestToStudent;