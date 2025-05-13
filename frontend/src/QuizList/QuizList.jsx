import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import './QuizList.css';
import './QuizList.css'
function QuizList() {

  const [quizes, setQuizes] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:8000/api/quizes/`)
      .then(res => {
        const quizes = res.data;
        const qui = quizes.filter(quizes => quizes.is_public === true)


        setQuizes(qui);
      })
  }, []);


  return (

    <>

      <h1 className="text-center mb-4 titlePage">📘 Dostępne Quizy</h1>

      <Row style={{ justifyContent: 'center', width: "100%" }} >

        {
          quizes
            .map(quiz =>
              <Card key={quiz.id} style={{ width: '19rem', margin: '1rem', fontSize: '20px', backgroundColor: "#BAD4F9" }}>

                <Card.Body>
                  <Card.Title><b>{quiz.name}</b></Card.Title>

                </Card.Body>
                <ListGroup className="list-group-flush" style={{ fontSize: '16px' }}>
                  <ListGroup.Item>Liczba pytań: <b>{quiz.number_of_questions}</b></ListGroup.Item>
                  <ListGroup.Item>Próg zdania: <b>{quiz.required_score_to_pass}</b>%</ListGroup.Item>
                  <ListGroup.Item>Czas na rozwiązanie: <b>{quiz.time}</b>min</ListGroup.Item>
                  <ListGroup.Item>Temat: <b>{quiz.topic}</b></ListGroup.Item>
                </ListGroup>
                <Card.Body className="d-flex justify-content-around">
                  <Card.Link className=" btn btn-warning" href={`/test/${quiz.code}`} >Start</Card.Link>
                  <Card.Link className=" btn btn-primary" href={`/test-info/${quiz.id}`}>Szczegóły</Card.Link>
                </Card.Body>
              </Card>

            )
        }
        {quizes.length === 0 && (
          <p className="text-center text-muted">Brak dostępnych quizów.</p>
        )}
      </Row>


    </>
  )
}
export default QuizList