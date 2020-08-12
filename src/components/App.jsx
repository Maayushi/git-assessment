import React, {Component} from "react";
import {Router, Route, browserHistory} from "react-router";
import AnalysisPage from "./AnalysisPage";
import AddFieldPage from "./AddFieldPage";
import HomePage from "./HomePage";
import AboutPage from "./AboutPage";
import UserPage from "./UserPage";
import MyFarmPage from "./MyFarmPage";
import RouteMismatch from "./RouteMismatch";
import "material-components-web/dist/material-components-web.min.css";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import {handleUserLogin} from "../actions/user";
import {connect} from "react-redux";
import Dashboard from "./Dashboard";
import Login from "./Login";

global.__base = __dirname + "/";
const theme = createMuiTheme();

class App extends Component {

	componentWillMount() {
		this.props.handleUserLogin(localStorage.getItem("kcEmail"),
				localStorage.getItem("dwPersonId"), localStorage.getItem("kcEmail") !== null);
	}

	render() {

		return (
			<MuiThemeProvider theme={theme}>
				<Router history={browserHistory}>
					<Route path="/" component={HomePage}/>
					<Route path="/login" component={Login}/>
					<Route path="/analysis" component={AnalysisPage}/>
					<Route path="/addfield" component={AddFieldPage}/>
					<Route path="/profile" component={MyFarmPage}/>
					<Route path="/about" component={AboutPage}/>
					<Route path="/history" component={UserPage}/>
					<Route path="/dashboard" component={Dashboard}/>
					<Route path="*" component={RouteMismatch}/>
				</Router>
			</MuiThemeProvider>
		);
	}
}


const mapDispatchToProps = (dispatch) => {
	return {
		handleUserLogin: (email, userId, isAuthenticated) => {
			dispatch(handleUserLogin(email, userId, isAuthenticated));
		}
	};
};

export default connect(null, mapDispatchToProps)(App);
