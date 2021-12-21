import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DatabaseProvider } from "./contexts/DatabaseContext";
import Home from "./pages/Home";
import Editor from "./pages/Editor";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./PrivateRoute";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <DatabaseProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/" element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        } />
                        <Route path="/editor" element={
                            <PrivateRoute>
                                <Editor />
                            </PrivateRoute>
                        } />
                    </Routes>
                </DatabaseProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}