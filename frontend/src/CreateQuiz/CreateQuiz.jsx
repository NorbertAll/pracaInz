import React, { Component, useEffect, useState } from 'react'
import App from '../App'
import Form from 'react-bootstrap/Form';
import axios from "axios"
import Button from 'react-bootstrap/Button';

export const CreateQuiz = props => {

    const [formData, setFormData] = useState({
        name: "",
        topic: "",
        number_of_questions: 0,
        time: 0,
        required_score_to_pass: 0,
        is_public: true,
        creator: 1,
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null)
    const handleSubmit = async (e) => {

        console.log(formData);
        try {
            console.log(formData);

            const response = await axios.post("http://127.0.0.1:8000/api/quizes/", formData)
            console.log("Success", response.data);
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
                <Button variant="warning" type='submit' onClick={handleSubmit}>Zapisz</Button>
            </form>
        </div>


    </>

}
















