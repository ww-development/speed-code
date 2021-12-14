import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useDatabase } from "../contexts/DatabaseContext";
import Editor from "./Editor"

export default function Home() {
    const [error, setError] = useState("");
    const { logout, currentUser } = useAuth();
    const { programs } = useDatabase();

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
        <Editor />
    )
    
}

// return (
//     <div>
//         <h1>Home</h1>

//         { error && <p>Error</p> }

//         { currentUser && 
//             <div>
//                 <p>{ currentUser.email }</p>
//                 <p>{ currentUser.uid }</p>
//             </div>
//         }

//         {
//             programs && programs.map(program => {
//                 return <div>
//                     <p>{program.language}</p>
//                     <p>{program.code}</p>
//                 </div>
//             })
//         }

//         <button onClick={handleLogout}>Logout</button>
//     </div>
// )