import React from 'react';
import axios from 'axios';

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
        {
          this.state.quizes
            .map(quiz =><div className='quizcard ' key={quiz.id}>
                <p>{quiz.name}</p>
                <p>{quiz.number_of_questions}</p>
                <p>{quiz.required_score_to_pass}</p>
                <p>{quiz.time}</p>
                <p>{quiz.topic}</p>
                </div>
            )
        }
      </>
    )
  }
}