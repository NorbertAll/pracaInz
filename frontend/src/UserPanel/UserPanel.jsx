import React from 'react'
import { useState, useEffect } from 'react'
import axios from "axios"
import Nav from 'react-bootstrap/Nav';
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
} from "react-router-dom";
import { CreateQuiz } from '../CreateQuiz/CreateQuiz';
import { MainUserPanel } from '../MainUserPanel/MainUserPanel';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";

import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'

export function UserPanel() {
    let navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [isLoggedIn, setLoggedIn] = useState(false)
    const [userId, setUserId] = useState(0)
    const [quizes, setQuizes] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const allData = [];
        const fetchAll = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (token) {
                    const config = {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    };
                    const response = await axios.get("http://127.0.0.1:8000/api/accounts/user/", config)
                    setLoggedIn(true)
                    setUsername(response.data.username)
                    setUserId(response.data.id)


                }
                else {
                    setLoggedIn(false);
                    setUsername("");
                }



                const tests =
                    await axios.get(`http://localhost:8000/api/quizes/`)
                        .then(res => {
                            const quizes = res.data;


                            const qui = quizes.filter(quizes => quizes.creator === userId)


                            setQuizes(quizes);

                        })
                allData.push(tests.res.data);
                const results =
                    await axios.get(`http://localhost:8000/api/results/`)
                        .then(res => {
                            const results = res.data;





                            setResults(results);

                        })
                allData.push(results.res.data);
            } catch (error) {
                setLoggedIn(false);
                setUsername("");
            } finally {

                setLoading(false);
                console.log(quizes);
                console.log(userId);

                quizes.filter(quizes => quizes.creator === userId)
                console.log(quizes);
            }


        }
        fetchAll();


    }, [])


    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");

            if (accessToken && refreshToken) {
                const config = {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                };
                await axios.post("http://127.0.0.1:8000/api/accounts/logout/", { "refresh": refreshToken }, config)
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setLoggedIn(false);
                setUsername("");
                console.log("Log out successful!")
                window.location.reload();


            }
        }
        catch (error) {
            console.error("Failed to logout", error.response?.data || error.message)
        }
    }
    const deletequiz = async (id) => {

        try {

            console.log(id);

            axios.delete(`http://127.0.0.1:8000/api/quizes/${id}/`)
                .then(() => {
                    alert("Test został usunięty");
                })
                .catch((err) => {
                    console.error("Błąd usuwania:", err);
                });
        }
        catch (error) {
            console.log(error);

        }

    }
    const deleteresult = async (id) => {

        try {

            console.log(id);

            axios.delete(`http://127.0.0.1:8000/api/result/${id}/`)
                .then(() => {
                    alert("Wynik został usunięty");
                })
                .catch((err) => {
                    console.error("Błąd usuwania:", err);
                });
        }
        catch (error) {
            console.log(error);

        }

    }
    const editquiz = (id) => {
        navigate(`/userpanel/editquiz/${id}`)

    }
    const questions = (id) => {
        navigate(`/userpanel/questions/${id}`)

    }
    const createtest = (data) => {
        navigate(`/userpanel/createnewtest`)
    }

    return (
        <div>
            <h1>Panel urzytkownika</h1>

            <Nav justify variant="tabs" defaultActiveKey="/userpanel">
                <Nav.Item>
                    <Nav.Link href="#testy">Panel urzytkonika</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="#studenci">Stwórz test</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-1">Loooonger NavLink</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">Link</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <button onClick={handleLogout}>Logout</button>
                </Nav.Item>
            </Nav>

            <h3 className="mb-3" id="testy">Lista dostępnych testów</h3>
            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered align-middle shadow">

                    <thead className="table-primary">
                        <tr>
                            <th>#</th>
                            <th>Nazwa testu</th>
                            <th>Temat</th>
                            <th>Liczba pytań</th>
                            <th>Próg zaliczenia</th>
                            <th>Czas</th>
                            <th>Akcja</th>

                        </tr>
                    </thead>{loading ? (
                        <p>Brak testów do wyświtelenia</p>
                    ) : (<>
                        <tbody>

                            {quizes.map((quiz) =>
                                quiz.creator === userId ?
                                    (


                                        <tr key={quiz.id}>
                                            <td>{quiz.id}</td>
                                            <td>{quiz.name}</td>
                                            <td>{quiz.topic}</td>
                                            <td>{quiz.number_of_questions}</td>
                                            <td>{quiz.required_score_to_pass}</td>
                                            <td>{quiz.time}</td>

                                            <td>
                                                <button className="btn btn-sm btn-outline-warning" onClick={() => questions(quiz.id)}>
                                                    Pytania
                                                </button>
                                                &nbsp;&nbsp;
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => editquiz(quiz.id)}>
                                                    Edytuj
                                                </button>
                                                &nbsp;&nbsp;
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => deletequiz(quiz.id)}>
                                                    Usuń
                                                </button>
                                            </td>
                                        </tr>
                                    ) : null)}
                        </tbody></>)}
                </table>
            </div>




            <br />
            <Button variant="warning" onClick={createtest}>Stwórz Nowy Test</Button>

            <h3 className="mb-3" id="testy">Lista dostępnych Wyników </h3>
            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered align-middle shadow">

                    <thead className="table-primary">
                        <tr>
                            <th>#</th>
                            <th>Imię</th>
                            <th>Nazwisko</th>
                            <th>Indeks</th>
                            <th>Wynik</th>
                            <th>Akcja</th>

                        </tr>
                    </thead>{loading ? (
                        <p>Brak testów do wyświtelenia</p>
                    ) : (<>
                        <tbody>

                            {results.map((result) =>
                                result.creator === userId ?
                                    (


                                        <tr key={result.id}>
                                            <td>{result.id}</td>
                                            <td>{result.name}</td>
                                            <td>{result.last_name}</td>
                                            <td>{result.indeks}</td>
                                            <td>{result.score}</td>


                                            <td>

                                                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteresult(results.id)}>
                                                    Usuń
                                                </button>
                                            </td>
                                        </tr>
                                    ) : null)}
                        </tbody></>)}
                </table>
            </div>




            <br />
            <Button variant="warning" onClick={createtest}>Stwórz Nowy Test</Button>
        </div >
    )
}