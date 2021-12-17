import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useDatabase } from "../contexts/DatabaseContext";

export default function Home() {
    const [error, setError] = useState("");
    const { logout, currentUser } = useAuth();
    const { programs, problems } = useDatabase();

    async function handleLogout() {
        setError("");
        try {
            await logout();
        } catch (error) {
            console.log(error)
            setError("Error logging out");
        }
    }

    return (
        <div>
            <h1>Home</h1>
    
            { error && <p>Error</p> }
    
            { currentUser && 
                <div>
                    <p>{ currentUser.email }</p>
                    <p>{ currentUser.uid }</p>
                </div>
            }

            {
                problems && problems.map(problem => {
                    return <div>
                        <p>{problem.problemNo}: {problem.title}</p>
                        <p>{problem.body}</p>
                        <p>Solved By: {problem.solvedBy}</p>
                        <p>{problem.id}</p>
                        <Link to="/editor" state={{ problemID: problem.id }}>Code It</Link>
                    </div>
                })
            }
    
            {
                programs && programs.map(program => {
                    return <div>
                        <p>{program.problemID}</p>
                        <p>{program.language}</p>
                        <p>{program.code}</p>
                    </div>
                })
            }
    
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
    
}