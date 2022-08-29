import axios from 'axios';
import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Context } from '../helpers/Context'
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {  Alert, AlertTitle, Checkbox, FormControlLabel, Link } from '@mui/material';
import RadioGroup from '@mui/material/RadioGroup';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { areArraysEqual } from "@mui/base"

const Test = () => {
    let [quiz, setQuiz]=useState({})
    const [answer, setAnswer]=useState({});
    const [answerCheck, setAnswerCheck]=useState({});
    const [odp, setOdp]=useState({});
   
    let {code}=useParams();
    const {setVisi}=useContext(Context)
    useEffect(()=>{

        setVisi({status:false})
        axios.get(`http://localhost:8000/quiz/${code}/`)
                .then(res => {
                setQuiz(res.data)
                console.log("dane", res.data);
                const temp =[]
                const ob={}
                for(let i=0; i<Object.keys(res.data.data).length; i++){
                    temp[i]=Object.keys(Object.values(res.data.data)[i]).toString();
                    ob[temp[i]]=[];
                }
                setOdp(ob)
                console.log(odp);



        })      
        
        
        
        


      }, [])

    const zaz= (p, b)=>{

        if(odp[p].indexOf(b)<0){
            odp[p].push(b)
        }
        else{
            odp[p].splice(odp[p].indexOf(b), 1)  
        }

    }
    const send = () =>{
        
        
        axios.post(`http://localhost:8000/check/${code}/`, odp).then(response=>{
            console.log(response);
            if(response.data.data.resultBool){
            alert("Zdałeś z wynikiem: "+ response.data.data.numberResult.toString()+"%")
            }
            else{
                alert("Niezadłeś z wynikiem: "+ response.data.data.numberResult.toString()+"%")
            }
        })
                
    }

  return (
    <div>
       <Container component="main" maxWidth="xs" >
       
       {(quiz.data)?
       quiz.data.map((answer, i)=>(
        <div key={i}>
            <Typography component='h1' variant="h5">
                {Object.keys(answer)}
                {console.log(Object.values(answer))}
            </Typography>
            {Object.values(answer)[0].map((answer_text, id)=>(
                
                                <RadioGroup>
                                    
                                    <FormControlLabel
                                        control={
                                            <Checkbox value={id} color="primary" onClick={()=>{zaz(Object.keys(answer), answer_text)}}/>
                                                
                                        }
                                        label={answer_text}
                                    />
                                </RadioGroup>
                            ))}
                             
        </div>
       )
       
       ):''}
          {(quiz.data)?    <Button type="submit" variant="contained" endIcon={<SendIcon />} onClick={()=>{send()}} >
                                Submit Answer
                            </Button>:""   }
        </Container>
    </div>
  )
}

export default Test
/*

                    {quiz.map(({title, answer}, i)=>(
                        <div key={i}>
                            <Typography component='h1' variant="h5">
                                {title}
                            </Typography>
                            {answer.map(({answer_text, id})=>(
                                <RadioGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox value={id} color="primary" onChange={handleSelection}/>
                                                
                                        }
                                        label={answer_text}
                                    />
                                </RadioGroup>
                            ))}
                            <Button type="submit" variant="contained" endIcon={<SendIcon />}  >
                                Submit Answer
                            </Button>
                            {
                            //<Result/>
                            }
                        </div>
                    ))}
            */