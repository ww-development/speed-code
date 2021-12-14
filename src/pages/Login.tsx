import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(emailRef.current!.value, passwordRef.current!.value)
            navigate("/");
        } catch (error) {
            console.log(error);
            setError("Failed to sign in");
        }

        setLoading(false);
    }

    return (
        <div>
            <h1>Login</h1>

            { error && <p>{error}</p> }

            <form onSubmit={handleSubmit}>
                <p>Email</p><br />
                <input type="email" required ref={emailRef} /><br />
                <p>Password</p><br />
                <input type="password" required ref={passwordRef} /><br />
                <button disabled={loading} type="submit">Login</button>
            </form>

            <p>Don't have an account? </p><Link to="/signup">Sign up</Link>
        </div>
    )
}
