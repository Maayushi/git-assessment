import React, {Component} from "react";
import Header from "./Header";
import {Grid, Cell} from "react-mdc-web";
import UserEvents from "./UserEvents";
import AuthorizedWrap from "./AuthorizedWrap";
import AnalyzerWrap from "./AnalyzerWrap";
import DashboardResults from "./DashboardResults";
import {selectedEventNotSuccessful, noJobsFound} from "../app.messages";
import {connect} from "react-redux";

class Dashboard extends Component {

	constructor(props) {
		super(props);
	}

	render() {

		let dashboardOutput = "";

		if (this.props.isSelectedEventSuccessful === "success"){
			dashboardOutput = <DashboardResults />;
		}
		else if (this.props.isSelectedEventSuccessful === "error"){
			dashboardOutput = <p className="error-message">{selectedEventNotSuccessful}</p>;
		}
		else if (this.props.isSelectedEventSuccessful === "noRuns"){
			dashboardOutput = <p className="error-message">{noJobsFound}</p>;
		}
		return (
			<AuthorizedWrap>
				<div>
					<Header selected="user"/>
					<AnalyzerWrap activeTab={2}/>

					<div className="position-relative border-top" style={{marginLeft: 10}}>
						<Grid className="no-padding-grid">
							<Cell col={2}>
								<UserEvents />
							</Cell>
							<Cell col={10}>
								{dashboardOutput}
							</Cell>
						</Grid>
					</div>

				</div>
			</AuthorizedWrap>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isSelectedEventSuccessful: state.user.isSelectedEventSuccessful
	};
};

export default connect(mapStateToProps, null)(Dashboard);
