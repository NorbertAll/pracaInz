import React from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import Button from 'react-bootstrap/Button';

export default class PersonList extends React.Component {
  state = {
    quizes: []
  }

  componentDidMount() {
    axios.get(`http://localhost:8000/quizes/`)
      .then(res => {
        const quizes = res.data;
        console.log(quizes)
        this.setState({ quizes });
      })
  }

  render() {
    return (
        
      <>
        <h1>QUIZY </h1>
      <Row style={{  marginLeft:'1rem'}} className='cartTest'>
         
            {
              this.state.quizes
                .map(quiz =>
                    <Card style={{ width: '18rem', margin:'1rem', fontSize: '20px'}}>
                        
                        <Card.Body>
                          <Card.Title><b>{quiz.name}</b></Card.Title>
                         
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                          <ListGroup.Item>Liczba pytań: <b>{quiz.number_of_questions}</b></ListGroup.Item>
                          <ListGroup.Item>Próg zdania: <b>{quiz.required_score_to_pass}</b>%</ListGroup.Item>
                          <ListGroup.Item>Czas na rozwiązanie: <b>{quiz.time}</b>%</ListGroup.Item>
                          <ListGroup.Item>Temat: <b>{quiz.topic}</b></ListGroup.Item>
                        </ListGroup>
                        <Card.Body>
                          <Card.Link href="#">Card Link</Card.Link>
                          <Card.Link href="#">Another Link</Card.Link>
                        </Card.Body>
                    </Card>


                
                )
            }
           
   </Row>


      </>
    )
  }
}