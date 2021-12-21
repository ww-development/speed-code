import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const { login, signup } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setError("");
            setLoading(true);
            if (passwordRef.current!.value === confirmPasswordRef.current!.value) {
                await signup(emailRef.current!.value, passwordRef.current!.value);
                await login(emailRef.current!.value, passwordRef.current!.value);
                navigate("/");
            }
            else {
                setError("Passwords do not match");
            }
        } catch (error) {
            console.log(error);
            setError("Failed to sign in");
        }

        setLoading(false);
    }

    return (
        <div>
            <h1>Signup</h1>

            { error && <p>{error}</p> }

            <form onSubmit={handleSubmit}>
                <p>Email</p><br />
                <input type="email" required ref={emailRef} /><br />
                <p>Password</p><br />
                <input type="password" required ref={passwordRef} /><br />
                <p>Confirm Password</p><br />
                <input type="password" required ref={confirmPasswordRef} /><br />
                <button disabled={loading} type="submit">Sign Up</button>
            </form>

            <p>Already have an account? </p><Link to="/login">Login</Link>
        </div>
    )
}
