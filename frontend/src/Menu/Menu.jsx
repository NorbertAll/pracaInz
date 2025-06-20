
import QuizList from '../QuizList/QuizList';
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
import StartQuiz from '../StartQuiz/StartQuiz';
import { Login } from '../Login/Login';
import { Registration } from '../Registration/Registration';
import { MainPage } from '../MainPage/MainPage';

function Menu() {
  return (
    <div className="Menu"> 
    
<BrowserRouter>
<Navbar collapseOnSelect expand="lg" bg="primary" variant="dark" visible={'False'} >
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
            <Nav.Link as={Link} to="login">ZALOGUJ</Nav.Link>
            <Nav.Link eventKey={2} as={Link} to="registraion">
            ZAREJESTRUJ
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
 
</BrowserRouter>

    
      
     
    

    </div>
  );
}

export default Menu;
