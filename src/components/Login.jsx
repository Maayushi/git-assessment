import React, {Component} from "react";
import "../styles/main.css";
import "../styles/home-page.css";
import {connect} from "react-redux";
import {handleUserLogin} from "../actions/user";
import {browserHistory} from "react-router";
import config from "../app.config";
import {checkIfDatawolfUserExists, createDatawolfUser} from "../public/utils";

const keycloak = config.keycloak;

class Login extends Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		let that = this;
		keycloak.init({onLoad: "login-required"}).success(function(){

			localStorage.setItem("kcToken", keycloak.token);
			localStorage.setItem("kcRefreshToken", keycloak.refreshToken);
			localStorage.setItem("kcTokenExpiry", keycloak.tokenParsed.exp);
			// localStorage.setItem("kcTokenExpiry", Date.now() / 1000 + 30);

			keycloak.loadUserProfile().success(function(profile) {
				// console.log(JSON.stringify(profile, null, "  "));

				localStorage.setItem("isAuthenticated", "true");
				localStorage.setItem("kcEmail", profile["username"]); // Store email ID in local storage for future use

				checkIfDatawolfUserExists(profile["username"]).then(function(response){
					if (response.status === 200){
						return response.json();
					}
					else {
						localStorage.removeItem("dwPersonId");
						console.log("Datawolf API call failed. Most likely the token expired");
						//Bad response. Most likely token expired TODO: how to handle?
					}
				}).then(function(users){
					let createUser = false;
					if (users.length === 0){
						createUser = true;
						console.log("no users found..create user");
					}
					else if (users.length === 1){
						if (users[0] !== null){
							localStorage.setItem("dwPersonId", users[0].id);
						}
						else {
							createUser = true;
							console.log("no users found..create user");
						}
					}
					else {
						console.log("Unexpected output: More than one user found");
					}

					if (createUser){
						createDatawolfUser(profile["username"], profile["firstName"], profile["lastName"]).then(function(response) {
							if (response.status === 200){
								return response.text();
							}
							else {
								localStorage.removeItem("dwPersonId");
								console.log("Datawolf API call failed. Most likely the token expired");
								//Bad response. Most likely token expired TODO: how to handle?
							}
						}).then(function(personId){
							localStorage.setItem("dwPersonId", personId);
						});
					}
				}).catch(error => {
					localStorage.removeItem("dwPersonId");
					console.log(error);
					console.log("Error in making the api call. Most likely due to network or service being down");
				});

				that.props.handleUserLogin(profile["username"], profile["username"], true);
				browserHistory.push("/");

			}).error(function() {
				console.log("Failed to load user profile");
			});

		});
	}

	render() {
		return (
				<div>
					Redirecting to keycloak...
				</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		email: state.user.email,
		isAuthenticated: state.user.isAuthenticated
	};
};


const mapDispatchToProps = (dispatch) => {
	return {
		handleUserLogin: (email, userId, isAuthenticated) => {
			dispatch(handleUserLogin(email, userId, isAuthenticated));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

