import React, {Component} from "react";
import { connect } from "react-redux";
import {browserHistory} from "react-router";

class AuthorizedWrap extends Component {
	render() {
		return (
				<div>
					{ localStorage.getItem("isAuthenticated") === "true" ? this.props.children : browserHistory.push("/login")}
				</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.user.isAuthenticated
	};
};

export default connect(mapStateToProps, null)(AuthorizedWrap);

