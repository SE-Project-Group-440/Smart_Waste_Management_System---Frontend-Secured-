import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const OAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            navigate("/user"); // or "/adminhome" depending on your logic
        }
    }, [token, navigate]);

    return <p className="text-center mt-20">Logging in with Google...</p>;
};

export default OAuthSuccess;
