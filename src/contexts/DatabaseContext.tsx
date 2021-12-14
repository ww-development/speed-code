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
}

interface IDatabaseContext {
    programs: IProgram[] | null;
}

const DatabaseContext = React.createContext({} as IDatabaseContext);

export function useDatabase() {
    return React.useContext(DatabaseContext);
}

export function DatabaseProvider({ children }: { children: any }) {
    const [programs, setPrograms] = useState<IProgram[] | null>(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            const programsRef = query(collection(database, "programs"), where("userID", "==", currentUser.uid));
            const programsObserver = collectionData(programsRef, { idField: "id" }).subscribe(receivedPrograms => {
                setPrograms(receivedPrograms as IProgram[]);
            });

            return function cleanup() {
                programsObserver.unsubscribe();
            }
        }
    }, [currentUser]);

    const value: IDatabaseContext = {
        programs,
    }

    return (
        <DatabaseContext.Provider value={value}>
            { children }
        </DatabaseContext.Provider>
    )
}