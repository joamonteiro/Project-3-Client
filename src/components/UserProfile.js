import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { LoggedUserConsumer } from "../context/loggedUser";


function UserProfile() {
    const loggedInUser = useContext(LoggedUserConsumer);
    return (
        <>
        <div className="row">
            <div className="col-md-3">
                <img src={loggedInUser.imageUrl} alt="user profile pic"/>
            </div>
            <div className="col-md-9">
            <span>
                <h1>{`${loggedInUser.firstName} ${loggedInUser.lastName}`}</h1>
                {loggedInUser.isFarmer ? (<h3>Farmer</h3>) : (<h3>Consumer</h3>)}
                <NavLink exact to={`/user/${loggedInUser._id}/edit`}>Edit</NavLink>
                <p>{`${loggedInUser.username}`}</p>
            </span>
            </div>
        </div>
        </>
    );
}

export default UserProfile;