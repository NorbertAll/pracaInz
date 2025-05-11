import logo from './logo.svg';
import './App.css';
import QuizList from './QuizList/QuizList';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { MainPage } from './MainPage/MainPage';
import { Login } from './Login/Login';
import { Registration } from './Registration/Registration';
import StartQuiz from './StartQuiz/StartQuiz';
import Quiz from './Quiz/Quiz';
import Test from './Test/Test';
import { UserPanel } from './UserPanel/UserPanel'
import { useState } from 'react';
import { Context } from './helpers/Context';
import { useEffect } from 'react'
import axios from "axios"
import { CreateQuiz } from './CreateQuiz/CreateQuiz';
import "bootstrap/dist/css/bootstrap.min.css";
import { EditQuiz } from './EditQuiz/EditQuiz';
import { QuestionsPanel } from './QuestionsPanel/QuestionsPanel';
import { PasswordReset } from './PasswordReset/PasswordReset';
import { ResetPasswordConfirm } from './ResetPasswordConfirm/ResetPasswordConfirm';
import QuizResult from './QuizResult/QuizResult';
import SendTestToStudent from './SendTestToStudent/SendTestToStudent';





function App() {

  const [username, setUsername] = useState("")
  const [isLoggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const checkLoggedInUser = async () => {
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
        }
        else {
          setLoggedIn(false);
          setUsername("");
        }
      }
      catch (error) {
        setLoggedIn(false);
        setUsername("");
      }
    };
    checkLoggedInUser()
  }, [])


  const [visi, setVisi] = useState({ status: true })
  return (
    <div className="App">
      <Context.Provider value={{ visi, setVisi }}>
        <BrowserRouter>

          {visi.status ? <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark" className={`${visi}`} >
            <Container>
              <Navbar.Brand href="/">Platforma Quizowo egzaminacyjna</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="">Stona główna</Nav.Link>
                  <Nav.Link as={Link} to="exapmplequiz">Przykładowe QUIZY</Nav.Link>
                  <Nav.Link as={Link} to="startquiz">Zacznij QUIZ</Nav.Link>
                </Nav>
                <Nav>

                  {isLoggedIn ? (
                    <>
                      <Nav.Link as={Link} to="userpanel">Witaj {username}</Nav.Link>
                      <Nav.Link as={Link} to="userpanel">Panel Użytkownika</Nav.Link>
                    </>
                  ) : (
                    <>
                      <Nav.Link as={Link} to="login">ZALOGUJ</Nav.Link>
                      <Nav.Link as={Link} to="registraion">
                        ZAREJESTRUJ
                      </Nav.Link>
                    </>
                  )}




                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar> : ""}

          <Routes>

            <Route path="" element={<MainPage />} />
            <Route path="exapmplequiz" element={<QuizList />} />
            <Route path="startquiz" element={<StartQuiz />} />
            <Route path="login" element={<Login />} />
            <Route path="registraion" element={<Registration />} />
            <Route path="test/:code" element={<Test />} />
            <Route path="quiz/:code" element={<Quiz />} />
            <Route path="userpanel" element={<UserPanel />} />
            <Route path="userpanel/createquiz" element={<CreateQuiz />} />
            <Route path="userpanel/createnewtest/:id" element={<CreateQuiz />} />
            <Route path="userpanel/editquiz/:id" element={<EditQuiz />} />
            <Route path="userpanel/questions/:id" element={<QuestionsPanel />} />
            <Route path="/userpanel/sendtesttostudent/:quizId" element={<SendTestToStudent />} />
            <Route path="passwordreset" element={<PasswordReset />} />
            <Route path="userpanel/quiz" element={<Quiz />} />
            <Route path="reset/password/confirm/:uid/:token" element={<ResetPasswordConfirm />} />
            <Route path="/results/:code" element={<QuizResult />} />
          </Routes>

        </BrowserRouter>

      </Context.Provider>


      <footer className="bg-primary text-white text-center py-3 mt-auto">
        &copy; 2025 Norbert Gutkowski | Projekt inżynierski
      </footer>
    </div>
  );
}

export default App;
