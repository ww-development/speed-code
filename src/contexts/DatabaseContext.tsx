import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { useAuth } from "./AuthContext";
import { query, collection, where, onSnapshot, doc, addDoc, setDoc } from "firebase/firestore";

export interface IProgram {
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

interface IUserData {
    firstName: string;
    familyName: string;
    topProblem: number;
}

interface IDatabaseContext {
    programs: IProgram[] | null;
    problems: IProblem[] | null;
    userData: IUserData | null;
    loading: Boolean;
    createProgram: (problemID: string) => Promise<string | undefined>;
    updateProgramCode: (programID: string, newCode: string) => Promise<void>;
}

const DatabaseContext = React.createContext({} as IDatabaseContext);

export function useDatabase() {
    return React.useContext(DatabaseContext);
}

export function DatabaseProvider({ children }: { children: any }) {
    const [programs, setPrograms] = useState<IProgram[]>([]);
    const [problems, setProblems] = useState<IProblem[]>([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<IUserData | null>(null);
    const { currentUser } = useAuth();

    // Programs:
    useEffect(() => {
        if (currentUser !== null) {
            const programsRef = query(collection(database, "programs"), where("userID", "==", currentUser.uid));
            const unsubscribe = onSnapshot(programsRef, (querySnapshot) => {
                let incomingPrograms:IProgram[] = [];
                querySnapshot.forEach((doc) => {
                    let program = doc.data() as IProgram;
                    program.id = doc.id;
                    incomingPrograms.push(program);
                });
                setPrograms(incomingPrograms);
                setLoading(false);
            })

            return function cleanup() {
                unsubscribe();
            }
        }
    }, [currentUser]);

    // User Data and Problems:
    useEffect(() => {
        if (currentUser !== null) {
            const userDataRef = doc(database, "users", currentUser.uid);
            const unsubscribeUser = onSnapshot(userDataRef, (querySnapshot) => {
                const incomingUserData = querySnapshot.data() as IUserData;
                setUserData(incomingUserData);
            })

            const problemsRef = query(collection(database, "problems"));
            const unsubscribe = onSnapshot(problemsRef, (querySnapshot) => {
                let incomingProblems:IProblem[] = [];
                querySnapshot.forEach((doc) => {
                    let problem = doc.data() as IProblem;
                    problem.id = doc.id;
                    incomingProblems.push(problem);
                });
                setProblems(incomingProblems);
                setLoading(false);
            })

            return function cleanup() {
                unsubscribe();
            }
        }
    }, [currentUser]);

    async function createProgram(problemID: string) {
        setLoading(true);
        if (currentUser !== null) {
            let data = {
                userID: currentUser.uid,
                language: "Python",
                code: `print("Test")`,
                problemID: problemID
            }

            const newProgramRef = await addDoc(collection(database, "programs"), data);
            return newProgramRef.id;
        }
        setLoading(false);
    }

    async function updateProgramCode(programID: string, newCode: string) {
        setLoading(true);
        if (currentUser !== null) {
            const programRef = doc(database, "programs", programID);
            await setDoc(programRef, { code: newCode }, { merge: true });
        }
    }


    const value: IDatabaseContext = {
        programs,
        problems,
        userData,
        loading,
        createProgram,
        updateProgramCode
    }

    return (
        <DatabaseContext.Provider value={value}>
            { children }
        </DatabaseContext.Provider>
    )
}