import React, { useState, useEffect } from "react";
import axios from "axios"
import { useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';

export const SentTestToStudent = props => {
    const { id } = useParams();

    return (
        <>Wyślij pytanie studentom</>
    );
}