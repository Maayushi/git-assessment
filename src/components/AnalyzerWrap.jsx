import React, {Component} from "react";
import {Tabbar, Tab} from "react-mdc-web";
import {connect} from "react-redux";
import {handleUserLogout} from "../actions/user";
import {Link} from "react-router";

class AnalyzerWrap extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const {activeTab} = this.props;
		// Cannot use Link within Tab
		// click tabs will jump to a new page
		return(
			<div>
				<span className="analyzer-line" />
				<div className="analyzer-tab" >
					<Tabbar style={{textTransform: "initial"}}>
						<Tab
							active={activeTab===1}
							component={Link} to="/analysis"
						>
							Start a Job
						</Tab>
						<Tab
							active={activeTab===2}
							component={Link} to="/dashboard"
						>
							Dashboard
						</Tab>

						<Tab
							active={activeTab===3}
							component={Link} to="/profile"
						>
							My Farm
						</Tab>
						<Tab
							style={{display: "none"}}
							active={activeTab===4}
							component={Link} to="/history"
						>
							Job History
						</Tab>

					</Tabbar>

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

export default connect(mapStateToProps, mapDispatchToProps)(AnalyzerWrap);
