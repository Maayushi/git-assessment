import React, {Component} from "react";
import {Card, CardText, Icon} from "react-mdc-web";
import {latId, lonId, resultDatasetId, userInputJSONDatasetID, weatherId, weatherDatasetId} from "../datawolf.config";
import {
	convertDateToUSFormat,
	getWeatherName,
	convertDateToUSFormatWithMins,
	getOutputFileJson,
} from "../public/utils";
import {connect} from "react-redux";
import Grid from "@material-ui/core/Grid";
import config from "../app.config";

class EventCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inDate: "",
			outDate: ""
		};

		this.getDates = this.getDates.bind(this);
	}

	componentWillMount() {
		this.getDates(this.props.event[0].datasets[userInputJSONDatasetID]);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.event !== this.props.event) {
			this.getDates(this.props.event[0].datasets[userInputJSONDatasetID]);
		}
	}

	getDates(datasetId){
		getOutputFileJson(datasetId).then(userInputJson => {
			let plantingYear = userInputJson["year_planting"];
			let harvestYear = plantingYear + 1;
			let plantingDOY = userInputJson["doy_planting"];
			let harvestDOY = userInputJson["doy_harvest"] - config.coverCropTerminationOffsetDays;
			let plantingDate = new Date(plantingYear, 0, plantingDOY);
			let harvestDate = new Date(harvestYear, 0, harvestDOY);
			this.setState({inDate: convertDateToUSFormat(plantingDate)});
			this.setState({outDate: convertDateToUSFormat(harvestDate)});
		});
	}

	render() {
		let {event} = this.props;

		return (
			<Card
				className={(event.id === this.props.selectevent? "choose-card":"") + " event-list " +(event.status)}
				key={event[0].id}
				onClick={() => this.props.viewResult(event.id, event.status, event[0].datasets[resultDatasetId],
						event[1].datasets[resultDatasetId], event[0].datasets[userInputJSONDatasetID],
						event[0].datasets[weatherDatasetId])}
			>
				<CardText >

					<Grid container spacing={0}>

						<Grid container item spacing={0}>
							<Grid item xs={10}>
								<h2>{event[0].parameters[latId] + " " +event[0].parameters[lonId]}</h2>
							</Grid>

							<Grid item xs={2}>
								{ event.status === "execution-error" ?	<Icon className="normalIcon" name="warning" />	:
									<Icon className="normalIcon" name="check_circle"/>}
							</Grid>
						</Grid>


						<Grid container item style={{paddingTop: "5px"}}>
							<Grid item>
								<span className="eventCardLabelTitle">Cover Crop</span> <span className="eventCardLabelValue">{this.state.inDate} </span>
							</Grid>
						</Grid>


						<Grid container item style={{paddingTop: "3px"}}>
							<Grid item>
								<span className="eventCardLabelTitle">Cash Crop</span> <span className="eventCardLabelValue">{this.state.outDate} </span>
							</Grid>
						</Grid>

						<Grid container item style={{paddingTop: "3px"}}>
							<Grid item>
								<span className="eventCardLabelTitle">Weather</span> <span className="eventCardLabelValue">{getWeatherName(event[0].parameters[weatherId])}</span>
							</Grid>
						</Grid>

						<Grid container item style={{paddingTop: "3px"}}>
							<Grid item >
								<span className="eventCardLabelTitle">Run Time</span> <span className="eventCardLabelValue">{convertDateToUSFormatWithMins(new Date(event[0].date))} </span>
							</Grid>

						</Grid>

					</Grid>

				</CardText>
			</Card>
		);
	}
}

export default EventCard;
