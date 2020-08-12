import React, {Component} from "react";
import ChartCC from "./ChartCC";
import { connect } from "react-redux";
import {noJobsFound, selectedEventNotSuccessful} from "../app.messages";

class ViewResultsCC extends Component {

	render() {

		let chartsOutput = "";

		if (this.props.isSelectedEventSuccessful === "success"){
			chartsOutput = <ChartCC />;
		}
		else if (this.props.isSelectedEventSuccessful === "error"){
			chartsOutput = <p className="error-message">{selectedEventNotSuccessful}</p>;
		}
		else if (this.props.isSelectedEventSuccessful === "noRuns"){
			chartsOutput = <p className="error-message">{noJobsFound}</p>;
		}

		return (
			<div>
				<h1>Results</h1>
				<br/>
				{chartsOutput}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isSelectedEventSuccessful: state.user.isSelectedEventSuccessful
	};
};

export default connect(mapStateToProps, null)(ViewResultsCC);
