import React, { useState, useEffect } from 'react';
import axios from "axios";
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';

export function UserPanel() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [quizes, setQuizes] = useState([]);
    const [searchTopic, setSearchTopic] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortAscending, setSortAscending] = useState(true);
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    setLoggedIn(false);
                    setUsername("");
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const userResponse = await axios.get("http://127.0.0.1:8000/api/accounts/user/", config);
                const { username, id } = userResponse.data;
                setLoggedIn(true);
                setUsername(username);
                setUserId(id);

                const quizResponse = await axios.get("http://localhost:8000/api/quizes/");
                const userQuizes = quizResponse.data.filter((quiz) => quiz.creator === id);
                setQuizes(userQuizes);

                const resultResponse = await axios.get("http://localhost:8000/api/results/");
                const userResults = resultResponse.data.filter((result) => result.creator === id);
                setResults(userResults);

            } catch (error) {
                console.error("Błąd podczas pobierania danych:", error);
                setLoggedIn(false);
                setUsername("");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);
    const sortByTopic = () => {
        const sorted = [...results].sort((a, b) => {
            const topicA = a.quiz?.topic?.toLowerCase() || '';
            const topicB = b.quiz?.topic?.toLowerCase() || '';
            return sortAscending
                ? topicA.localeCompare(topicB)
                : topicB.localeCompare(topicA);
        });
        setResults(sorted);
        setSortAscending(!sortAscending);
    };
    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");

            if (accessToken && refreshToken) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                };

                await axios.post("http://127.0.0.1:8000/api/accounts/logout/", { refresh: refreshToken }, config);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setLoggedIn(false);
                setUsername("");
                window.location.href = '/login';
            }
        } catch (error) {
            console.error("Błąd podczas wylogowywania:", error.response?.data || error.message);
        }
    };

    const deleteQuiz = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/quizes/${id}/`);
            alert("Test został usunięty");
            setQuizes(prev => prev.filter(q => q.id !== id));
        } catch (error) {
            console.error("Błąd usuwania testu:", error);
        }
    };

    const deleteResult = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/results/${id}/`);
            alert("Wynik został usunięty");
            setResults(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error("Błąd usuwania wyniku:", error);
        }
    };

    const editQuiz = (id) => navigate(`/userpanel/editquiz/${id}`);
    const showQuestions = (id) => navigate(`/userpanel/questions/${id}`);
    const createTest = () => navigate(`/userpanel/createnewtest/${userId}`);
    const sendTestToStudent = (id) => navigate(`/userpanel/sendtesttostudent/${id}`);

    return (
        <div>
            <h1>Panel użytkownika</h1>
            <br /><br />
            <Nav justify variant="tabs" defaultActiveKey="/userpanel">
                <Nav.Item>
                    <Nav.Link href="#testy">Panel użytkownika</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="#testy">Testy</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="#wyniki">Wyniki</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Button variant="danger" size="sm" onClick={handleLogout} className="ms-2">Wyloguj</Button>
                </Nav.Item>
            </Nav>
            <br /><br /><br /><br />
            <h3 className="mb-3" id="testy">Lista dostępnych testów</h3>
            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered align-middle shadow">
                    <thead className="table-primary">
                        <tr>
                            <th>#</th>
                            <th>Nazwa testu</th>
                            <th>Temat</th>
                            <th>Code</th>
                            <th>Liczba pytań</th>
                            <th>Próg zaliczenia</th>
                            <th>Czas</th>
                            <th>Akcja</th>
                        </tr>
                    </thead>
                    {loading ? (
                        <tbody><tr><td colSpan="7">Ładowanie testów...</td></tr></tbody>
                    ) : (
                        <tbody>
                            {quizes.map((quiz, index) => (
                                <tr key={quiz.id}>
                                    <td>{index + 1}</td>
                                    <td>{quiz.name}</td>
                                    <td>{quiz.topic}</td>
                                    <td>{quiz.code}</td>
                                    <td>{quiz.number_of_questions}</td>
                                    <td>{quiz.required_score_to_pass}</td>
                                    <td>{quiz.time}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-warning" onClick={() => showQuestions(quiz.id)}>Pytania</button>&nbsp;
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => editQuiz(quiz.id)}>Edytuj</button>&nbsp;
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteQuiz(quiz.id)}>Usuń</button>&nbsp;
                                        <button className="btn btn-sm btn-outline-success" onClick={() => sendTestToStudent(quiz.id)}>Wyślij test</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>

            <br />
            <Button variant="warning" onClick={createTest}>Stwórz nowy test</Button>
            <br /><br /><br /><br />
            <div className="mb-3">
                <label htmlFor="searchTopic" className="form-label">Wyszukaj testy po temacie:</label>
                <input
                    id="searchTopic"
                    type="text"
                    className="form-control"
                    placeholder="Podaj temat"
                    value={searchTopic}
                    onChange={(e) => setSearchTopic(e.target.value)}
                />
            </div>
            <Button variant="secondary" size="sm" onClick={() => setSearchTopic("")}>
                Wyczyść
            </Button>
            <h3 className="mb-3 mt-4" id="wyniki">Lista wyników</h3>
            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered align-middle shadow">
                    <thead className="table-primary">
                        <tr>
                            <th>#</th>
                            <th>Imię</th>
                            <th>Nazwisko</th>
                            <th>Indeks</th>
                            <th onClick={sortByTopic} style={{ cursor: "pointer" }}>
                                Temat testu {sortAscending ? "↑" : "↓"}
                            </th>
                            <th>Wynik</th>
                            <th>Zdane</th>
                            <th>Akcja</th>
                        </tr>
                    </thead>
                    {loading ? (
                        <tbody><tr><td colSpan="6">Ładowanie wyników...</td></tr></tbody>
                    ) : (
                        <tbody>
                            {console.log(results)
                            }
                            {results
                                .filter(result =>
                                    result.quiz?.topic?.toLowerCase().includes(searchTopic.toLowerCase())
                                )

                                .map((result, index) => {
                                    const rowClass = result.passed ? 'table-success' : 'table-danger';
                                    return (
                                        <tr key={result.id} className={rowClass}>
                                            <td>{index + 1}</td>
                                            <td>{result.name}</td>
                                            <td>{result.last_name}</td>
                                            <td>{result.indeks}</td>
                                            <td>{result.quiz?.topic || "Brak danych"}</td>
                                            <td>{result.score}</td>
                                            <td>{result.passed ? 'Tak' : 'Nie'}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteResult(result.id)}>Usuń</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    )}
                </table>
                <br /><br /><br /><br />
            </div>
        </div>
    );
}
