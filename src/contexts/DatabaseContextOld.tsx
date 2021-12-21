import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { useAuth } from "./AuthContext"
import { query, collection, where } from "firebase/firestore";
import { collectionData } from "rxfire/firestore";

interface IProgram {
    id: string;
    userID: string;
    language: string;
    code: string;
    problemID: string;
}

interface IProblem {
    id: string;
    title: string;
    body: string;
    problemNo: number;
    solvedBy: number;
}

interface IDatabaseContext {
    programs: IProgram[] | null;
    problems: IProblem[] | null;
    currentProblem: string;
    changeCurrentProblem: (problemID: string) => void;
}

const DatabaseContext = React.createContext({} as IDatabaseContext);

export function useDatabase() {
    return React.useContext(DatabaseContext);
}

export function DatabaseProvider({ children }: { children: any }) {
    const [programs, setPrograms] = useState<IProgram[]>([]);
    const [problems, setProblems] = useState<IProblem[]>([]);
    const [currentProblem, setCurrentProblem] = useState("");
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            const programsRef = query(collection(database, "programs"), where("userID", "==", currentUser.uid));
            const problemsRef = query(collection(database, "problems"));
            const programsObserver = collectionData(programsRef, { idField: "id" }).subscribe(receivedPrograms => {
                setPrograms(receivedPrograms as IProgram[]);
            });

            const problemsObserver = collectionData(problemsRef, { idField: "id" }).subscribe(receivedProblems => {
                setProblems(receivedProblems as IProblem[]);
            })

            return function cleanup() {
                programsObserver.unsubscribe();
            }
        }
    }, [currentUser]);

    function changeCurrentProblem(problemID: string) {
        setCurrentProblem(problemID)
    }

    const value: IDatabaseContext = {
        programs,
        problems,
        currentProblem,
        changeCurrentProblem
    }

    return (
        <DatabaseContext.Provider value={value}>
            { children }
        </DatabaseContext.Provider>
    )
}