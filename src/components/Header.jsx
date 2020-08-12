import React, {Component} from "react";
import {browserHistory, Link} from "react-router";
import styles from "../styles/header.css";
import styles2 from "../styles/main.css";
import {Button, Toolbar, ToolbarRow, ToolbarSection} from "react-mdc-web";
import {connect} from "react-redux";
import {handleUserLogout} from "../actions/user";
import config from "../app.config";
import {
	clearKeycloakStorage,
	checkForTokenExpiry
} from "../public/utils";

const keycloak = config.keycloak;

class Header extends Component {

	constructor(props) {
		super(props);

		this.handleLogout = this.handleLogout.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleRegister = this.handleRegister.bind(this);
	}

	componentDidMount(): void {
		if (localStorage.getItem("isAuthenticated") === "true") {
			// if authenticated flag is set, re-check for token expiry. Reload page if expired
			if (checkForTokenExpiry()) {
				clearKeycloakStorage();
				window.location.reload();
			}
			else { // If token is not expired, set the timer to check for expiry
				let interval = setInterval( function(){
					if (localStorage.getItem("isAuthenticated") === "true") {
						if (checkForTokenExpiry()) {
							clearKeycloakStorage();
							browserHistory.push("/");
						}
					}
					else { // clear timer once isAuthenticated is set to false in storage
						clearInterval(interval);
						// browserHistory.push("/");
					}
				}, 15000);
			}
		}
	}

	handleLogin(){
		browserHistory.push("/login");
	}

	handleRegister(){
		keycloak.init().success(function(){
			keycloak.register({});
		});
	}

	handleLogout(){
		clearKeycloakStorage();
		this.props.handleUserLogout();
		keycloak.init().success(function(){
			keycloak.logout({redirectUri: browserHistory.push("/")});
		});
	}

	render() {
		return(
			<div>
				<Toolbar>
					<ToolbarRow className="banner">
						<ToolbarSection className="cover-crop" align="start">
							<Link to="/">
								<img src={require("../images/logo.png")}/>
								CoverCrop
							</Link>
						</ToolbarSection>
						<ToolbarSection align="end" >
							<span className="email-address">{this.props.email}</span>

							{this.props.isAuthenticated === false ? <span> <Button onClick={this.handleLogin}>Login</Button>
									<Button onClick={this.handleRegister} style={{height: "40px"}}>Register</Button> </span> :
								<Button onClick={this.handleLogout}>Logout</Button>}

						</ToolbarSection>
					</ToolbarRow>
				</Toolbar>
				<div className="header-tab" >
					<div className="rectangle-2">
						<Link to="/analysis" className="cover-crop-analyzer" >CoverCrop Analyzer</Link>

					</div>

					{this.props.selected === "home" && <div className="triangle-bottomright" /> }
					{this.props.selected === "home" ? <div className="rectangle-3-onselect">
							<Link to="/" className="about-the-project-onselect">About the Project</Link>
						</div> :
						<Link to="/" className="about-the-project">About the Project</Link>

					}
				</div>
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
		handleUserLogout: () => {
			dispatch(handleUserLogout());
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
