import React from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import Button from 'react-bootstrap/Button';
import './StartQuiz.css'
export default class StartQuiz extends React.Component {
  state = {
    quizes: []
  }

  componentDidMount() {
    axios.get(`http://localhost:8000/quiz/PS9CWOMXUX`)
      .then(res => {
        const quizes = res.data;
        console.log(quizes)
        this.setState({ quizes });
      })
  }

  render() {
    return (
        
      <>
        <h1 className='titlePage'>x</h1>
       {console.log(this.state)}
      
         
     
           
  


      </>
    )
  }
}