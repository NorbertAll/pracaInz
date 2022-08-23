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
import { Quiz } from './Quiz/Quiz';
import Test from './Test/Test';
import { useState } from 'react';
import { Context } from './helpers/Context';
function App() {
  const [visi, setVisi]=useState({status:true})
  return (
    <div className="App"> 
<Context.Provider value={{visi, setVisi}}> 
<BrowserRouter>

    {visi.status?<Navbar collapseOnSelect expand="lg" bg="primary" variant="dark" className={`${visi}`} >
      <Container>
        <Navbar.Brand href="/">Platforma Quizowo egzaminacyjna</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="">Stona główna</Nav.Link>
            <Nav.Link as={Link}  to="exapmplequiz">Przykładowe QUIZY</Nav.Link>
            <Nav.Link as={Link} to="startquiz">Zacznij QUIZ</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="login">ZALOGUJ</Nav.Link>
            <Nav.Link eventKey={2} as={Link} to="registraion">
            ZAREJESTRUJ
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>:""}

    <Routes>
      <Route path="quiz" element={<Quiz/>}/>
      <Route path="" element={<MainPage/>}/>
      <Route path="exapmplequiz" element={<QuizList/>}/>
      <Route path="startquiz" element={<StartQuiz/>}/>
      <Route path="login" element={<Login/>}/>
      <Route path="registraion" element={<Registration/>}/>
      <Route path="test/:code" element={<Test />}/>
    </Routes>
    
</BrowserRouter>
    
  </Context.Provider>    
     
    

    </div>
  );
}

export default App;
