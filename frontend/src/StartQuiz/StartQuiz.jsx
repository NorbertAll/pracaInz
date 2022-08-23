import React from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import Button from 'react-bootstrap/Button';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";
import { useNavigate } from "react-router-dom"
import { Box, Link, TextField, Stack } from '@mui/material';
import './StartQuiz.css'

const StartQuiz= ()=>  {
  const initialValues = {
    code: "",
  }

 
  let navigate=useNavigate();
  
  const validationSchema = Yup.object().shape({
    code: Yup.string().min(10, "za krótki kod").max(10, "za długi kod").required("Kod wymagany"),
   
  });

const onSubmit = (data) => {
  navigate(`/test/${data.code}`)
}
    return (
        

       
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            
        <Form className="formContainer">
         
            <label>Podaj Kod quizu</label> <br/>
            <ErrorMessage name="code" component="span" /><br />
            <Field as={TextField} id="code" label="kod" name="code" placeholder="Kod"/>
            <br/>
          
            <button type='submit'>Zacznij</button>
        </Form>

        </Formik>
        
      
      
         
     
           
  


   
    )
  }

export default StartQuiz

  
