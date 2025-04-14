import React, { Component, useEffect, useState } from 'react'
import App from '../App'
import Form from 'react-bootstrap/Form';
import axios from "axios"
import Button from 'react-bootstrap/Button';
import { useParams } from "react-router-dom";

export const EditQuiz = props => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        topic: "",
        number_of_questions: 0,
        time: 0,
        required_score_to_pass: 0,
        is_public: true,
        creator: 1,
        code: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null)


    useEffect(() => {
        console.log(id);

        axios.get(`http://127.0.0.1:8000/api/quizes/`)
            .then(res => {
                const data = res.data
                const quiz = data.find(ob => ob.id == id)
                setFormData({
                    id: quiz.id,
                    name: quiz.name,
                    topic: quiz.topic,
                    number_of_questions: quiz.number_of_questions,
                    time: quiz.time,
                    required_score_to_pass: quiz.required_score_to_pass,
                    is_public: quiz.is_public,
                    creator: quiz.creator,
                    code: quiz.code,

                })
                console.log(formData);


            })
    }, []);
    const handleSubmit = async (e) => {

        try {
            console.log(formData);

            const response = await axios.put(`http://127.0.0.1:8000/api/quizes/${id}/`, formData)
            alert("Test zaktualizowany!");
            setSuccessMessage("Registration Successfull")
        }
        catch (error) {
            console.log(error);

        }

    };


    return <>
        <br />
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            <h2>Dodaj Test:</h2>
            <form >
                <label>Id:{formData.id}</label><br />
                <label>Dziedzina:</label><br />
                <input type='text' name='name' value={formData.name}
                    onChange={handleChange}
                ></input><br />
                <br />
                <label>Temat:</label><br />
                <input type='text' name='topic' value={formData.topic}
                    onChange={handleChange}
                ></input><br />
                <br />
                <label>liczba pytań:</label><br />
                <input type='number' name='number_of_questions' value={formData.number_of_questions}
                    onChange={handleChange}
                ></input>{" "}<br />
                <br />
                <label>Ile minut na test</label><br />
                <input type='number' name='time' value={formData.time}
                    onChange={handleChange}
                ></input>{" "}<br />
                <br />
                <label>Ile procent by zdać</label><br />
                <input type='number' name='required_score_to_pass' value={formData.required_score_to_pass}
                    onChange={handleChange}
                ></input>{" "}<br />
                <br />
                <Button variant="warning" type='submit' onClick={handleSubmit}>Edytuj</Button>
            </form>
        </div>


    </>

}