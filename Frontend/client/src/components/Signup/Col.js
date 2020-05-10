import React from "react";
import EmailInput from "../Signup/EmailInput";
import PasswordInput from "../Signup/PasswordInput";
import UserNameInput from "../Signup/UserNameInput";
import "./stylesheet.css";

function Col() {
    return(
        <div className="col text-center">
            <h1>Welcome to Tee-Time!</h1>
                <form>
                    <UserNameInput />
                    <EmailInput/>
                    <PasswordInput />
                    <button type="submit" id='login-btn' className="btn btn-default">Sign Up</button>
                </form>
                <div>
                <p>Already have an account? Log in <a href="/">here</a></p>
            </div>
        </div>
    )
};

export default Col;