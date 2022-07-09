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
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {

    axios.get(`http://localhost:8000/quiz/${this.state.value}`)
    .then(res => {
      const quizes = res.data;
      console.log(quizes)
      this.setState({ quizes });
    })
    alert('Podano następujące imię: ' + this.state.value);
    event.preventDefault();
  }
  render() {
    return (
        
      <>
        <h2>Podaj Kod quizu</h2>
        <form onSubmit={this.handleSubmit}>
        <label>
          Kod
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <br /><br />
        <Button variant="primary" type="submit" value="Start">
          Start
        </Button>
        
      </form>
      
         
     
           
  


      </>
    )
  }
}
  
   
  
