import React from 'react'
import { useState, useEffect } from 'react'
import axios from "axios"
import { motion } from "framer-motion";


export function MainPage() {

    const [username, setUsername] = useState("")
    const [isLoggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        const checkLoggedInUser = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (token) {
                    const config = {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    };
                    const response = await axios.get("http://127.0.0.1:8000/api/accounts/user/", config)
                    setLoggedIn(true)
                    setUsername(response.data.username)
                }
                else {
                    setLoggedIn(false);
                    setUsername("");
                }
            }
            catch (error) {
                setLoggedIn(false);
                setUsername("");
            }
        };
        checkLoggedInUser()
    }, [])

    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");

            if (accessToken && refreshToken) {
                const config = {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                };
                await axios.post("http://127.0.0.1:8000/api/accounts/logout/", { "refresh": refreshToken }, config)
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setLoggedIn(false);
                setUsername("");
                console.log("Log out successful!")
                window.location.reload();

            }
        }
        catch (error) {
            console.error("Failed to logout", error.response?.data || error.message)
        }
    }
    return (
        <div>
            <section className="text-white bg-gradient bg-primary py-5 text-center">
                <motion.div
                    className="container"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="display-4 fw-bold">Twórz testy. Rozwiązuj quizy. Ucz się skutecznie.</h1>
                    <p className="lead mt-3 mb-4">
                        Patforma Quizowo egzaminacyjna to platforma edukacyjna powstała jako praca inżynierska Norberta Gutkowskiego, która umożliwia tworzenie testów, przesyłanie ich uczniom i analizę wyników.
                    </p>
                    <a href="/exapmplequiz" className="btn btn-warning btn-lg fw-semibold">Rozpocznij naukę</a>
                </motion.div>
            </section>


            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row g-4 text-center">
                        {[
                            {
                                title: "✍️ Tworzenie testów",
                                desc: "Twórz własne quizy i egzaminy, udostępniaj je uczniom jednym kliknięciem."
                            },
                            {
                                title: "🎯 Quizy tematyczne",
                                desc: "Wybieraj spośród różnych kategorii i sprawdzaj swoją wiedzę w czasie rzeczywistym."
                            },
                            {
                                title: "📝 Symulacje egzaminów",
                                desc: "Przygotuj się do prawdziwego egzaminu dzięki realistycznym testom próbnych."
                            },
                            {
                                title: "📊 Statystyki",
                                desc: "Śledź postępy swoich uczniów"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                className="col-md-6 col-lg-3"
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold">{feature.title}</h5>
                                        <p className="card-text">{feature.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}