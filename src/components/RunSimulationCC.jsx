import React, {Component} from "react";
import { connect } from "react-redux";
import {Button, Subheading2, Title,  Card,  CardTitle, CardText} from "react-mdc-web";
import "react-datepicker/dist/react-datepicker.css";
import "react-select/dist/react-select.css";
import "babel-polyfill";
import DatePicker from "react-datepicker";
import {
	datawolfURL,
	steps,
	resultDatasetId,
	getWithCoverCropExecutionRequest,
	getWithoutCoverCropExecutionRequest,
	weatherPatterns,
	coverCrops,
	userInputJSONDatasetID,
} from "../datawolf.config";
import config from "../app.config";
import {ID, getOutputFileJson, wait, uploadUserInputFile, getKeycloakHeader} from "../public/utils";
import Select from "react-select";
import {handleStartDateChange, handleEndDateChange, handleResults,
	handleWeatherPatternChange, handleCoverCropChange} from "../actions/analysis";
import {getDayOfYear} from "date-fns";


class RunSimulationCC extends Component {

	constructor(props) {
		super(props);
		this.runSimulation = this.runSimulation.bind(this);
		this.handleStartDateChange = this.handleStartDateChange.bind(this);
		this.handleEndDateChange = this.handleEndDateChange.bind(this);
		this.handleCoverCropChange = this.handleCoverCropChange.bind(this);

		this.state = {
			simulationStatus: "",
			runSimulationButtonDisabled: false,
			selectedFutureWeatherEndDate: false // true, if user selects end date for which we do not have weather data
		};
	}

	async runSimulation() {
		let that = this;
		let status = "STARTED";
		let personId = localStorage.getItem("dwPersonId"); // Read person Id from session storage
		this.setState({
			simulationStatus: status,
			runSimulationButtonDisabled: true
		});
		this.props.startShowingModal();

		let headers = {
			"Content-Type": "application/json",
			"Authorization": getKeycloakHeader(),
			"Cache-Control": "no-cache"
		};

		let id = ID();
		let { latitude, longitude, weatherPattern, startDate, endDate, expfile} = this.props;
		let objStartDate = startDate.toDate();
		let objEndDate = endDate.toDate();
		// Calculate cover crop termination date based on the cash crop planting date
		objEndDate.setDate(objEndDate.getDate() + config.coverCropTerminationOffsetDays);
		let plantingYear = objStartDate.getFullYear();
		let plantingDoy = getDayOfYear(objStartDate);
		let harvestDoy = getDayOfYear(objEndDate);

		let withCoverCropDatasetId = await uploadUserInputFile(plantingYear, plantingDoy, harvestDoy, true);
		let withoutCoverCropDatasetId = await uploadUserInputFile(plantingYear, plantingDoy, harvestDoy, false);

		let withCoverCropExecutionRequest = getWithCoverCropExecutionRequest(id, latitude, longitude, personId, weatherPattern, expfile, withCoverCropDatasetId);
		let withoutCoverCropExecutionRequest = getWithoutCoverCropExecutionRequest(id, latitude, longitude, personId, weatherPattern, expfile, withoutCoverCropDatasetId);

		let withCoverCropCreateExecutionResponse = await fetch(datawolfURL + "/executions", {
			method: "POST",
			headers: headers,
			body: JSON.stringify(withCoverCropExecutionRequest)
		});

		let withoutCoverCropCreateExecutionResponse = await fetch(datawolfURL + "/executions", {
			method: "POST",
			headers: headers,
			body: JSON.stringify(withoutCoverCropExecutionRequest)
		});

		const withCoverCropExecutionGUID = await withCoverCropCreateExecutionResponse.text();
		const withoutCoverCropExecutionGUID = await withoutCoverCropCreateExecutionResponse.text();

		console.log("With cover crop execution id = " + withCoverCropExecutionGUID);
		console.log("Without cover crop execution id = " + withoutCoverCropExecutionGUID);

		let withStatus = "";
		let withoutStatus = "";
		let withCoverCropAnalysisResult, withoutCoverCropAnalysisResult;
		// check the status until two progresses are finished
		while( withStatus === "" || withStatus === "WAITING" || withStatus === "RUNNING" || withStatus === "QUEUED"
		|| withoutStatus === "" || withoutStatus === "WAITING" || withoutStatus === "RUNNING" || withoutStatus === "QUEUED"){
			await wait(300);
			// Get Execution Result
			const withCoverCropExecutionResponse = await fetch(datawolfURL + "/executions/" + withCoverCropExecutionGUID, {
				method: "GET",
				headers: headers
			});

			const withoutCoverCropExecutionResponse = await fetch(datawolfURL + "/executions/" + withoutCoverCropExecutionGUID, {
				method: "GET",
				headers: headers
			});
			if(withCoverCropExecutionResponse instanceof Response && withoutCoverCropExecutionResponse instanceof Response){
				withCoverCropAnalysisResult = await withCoverCropExecutionResponse.json();
				withoutCoverCropAnalysisResult = await withoutCoverCropExecutionResponse.json();
				withStatus = withCoverCropAnalysisResult.stepState[steps.Output_Parser];
				withoutStatus = withoutCoverCropAnalysisResult.stepState[steps.Output_Parser];
			}
		}


		const withCoverCropDatasetResultGUID = withCoverCropAnalysisResult.datasets[resultDatasetId];

		const withoutCoverCropDatasetResultGUID = withoutCoverCropAnalysisResult.datasets[resultDatasetId];
		const withCoverCropUserInputJSONDatasetId = withCoverCropAnalysisResult.datasets[userInputJSONDatasetID];
		const outputFilename = "output.json";

		console.log("With cover crop result dataset = " + withCoverCropDatasetResultGUID);
		console.log("Without cover crop result dataset = " + withoutCoverCropDatasetResultGUID);

		if ((withCoverCropDatasetResultGUID !== "ERROR" && withCoverCropDatasetResultGUID !== undefined) &&
			(withoutCoverCropDatasetResultGUID !== "ERROR" && withoutCoverCropDatasetResultGUID !== undefined)) {

			getOutputFileJson(withCoverCropDatasetResultGUID, outputFilename).then(function (withCoverCropResultFile){
				getOutputFileJson(withoutCoverCropDatasetResultGUID, outputFilename).then(function (withoutCoverCropResultFile) {
					getOutputFileJson(withCoverCropUserInputJSONDatasetId).then(function (userInputJson) {

						status = "COMPLETED";
						that.setState({
							simulationStatus: status,
							runSimulationButtonDisabled: false
						});

						if (withCoverCropExecutionGUID !== "" &&
							withoutCoverCropExecutionGUID !== "") {
							that.props.handleResults(
								withCoverCropExecutionGUID,
								withCoverCropResultFile,
								withoutCoverCropExecutionGUID,
								withoutCoverCropResultFile,
								userInputJson
							);
							window.location = "/dashboard";
						} else {
							console.log("Execution ID wasn't generated.");
						}
					});
				});
			});

		}
		else {
			status = "ERROR";
			console.log("Error occurred while running workflow");
			this.setState({
				simulationStatus: status,
				runSimulationButtonDisabled: false
			});

			window.location = "/dashboard";
		}
	}

	handleStartDateChange(date) {
		this.props.handleStartDateChange(date);
	}

	handleEndDateChange(date) {

		// Set selectedFutureWeatherEndDate to true if selected termination date if greater than the latest date for
		// which we have weather data
		let endDateString = date.toDate().toISOString().split("T")[0]; // Get YYYY-MM-DD format date string
		this.setState({selectedFutureWeatherEndDate: new Date(endDateString) > new Date(config.latestWeatherDate)});

		this.props.handleEndDateChange(date);
	}

	handleWeatherPatternChange(weatherPattern){
		this.props.handleWeatherPatternChange(weatherPattern);
	}

	handleCoverCropChange(coverCrop){
		// TODO Selected cover crop should be added to the JSON used for generating the experiment file
		// Right now only one is supported so this selection is ignored
		this.props.handleCoverCropChange(coverCrop);
	}

	toggleDropdown(e) {
		this.setState({ open: !this.state.open });
	}

	render(){
		let isButtonDisabled = this.state.runSimulationButtonDisabled ? "disabled" : "";
		let weatherbuttons = weatherPatterns.map(w =>
			<Button dense raised={this.props.weatherPattern === w}
					onClick={()=>{ this.props.handleWeatherPatternChange(w); }}
					key={w}
			>{w}</Button>);

		return(
			<div className="run-simulate">
				<div className="black-bottom">
					<Title>Field</Title>
					<Card>
						<CardText>
							<CardTitle>{this.props.cluname}</CardTitle>
							{this.props.latitude} {this.props.longitude}
						</CardText>
					</Card>
				</div>
				<div className="black-bottom">
					<Title>Cover Crop</Title>
					<Select
						name="selectccrop"
						value={this.props.coverCrop}
						onChange={this.handleCoverCropChange}
						options={coverCrops}
					/>
				</div>
				<div className="black-bottom select-date">

					<Title>Planting Dates</Title>
					<div className="select-date-div">
						<Subheading2>Cover Crop </Subheading2>
						<DatePicker className="date-picker-cc" selected={this.props.startDate}
									selectsStart
									showYearDropdown
									scrollableYearDropdown
									placeholderText="Select cover crop plant date"
									startDate={this.props.startDate}
									endDate={this.props.endDate}
									onSelect={this.handleStartDateChange}/>
					</div>
					<div className="select-date-div">
						<Subheading2>Cash Crop </Subheading2>
						<DatePicker className="date-picker-cc" selected={this.props.endDate}
									selectsEnd
									showYearDropdown
									scrollableYearDropdown
									placeholderText="Select following cash crop plant date"
									startDate={this.props.startDate}
									endDate={this.props.endDate}
									onChange={this.handleEndDateChange}/>
					</div>
				</div>
				{this.state.selectedFutureWeatherEndDate === false ? null : <div className="black-bottom weather-pattern-div">
					<Title> Weather Pattern</Title>

					{weatherbuttons}
				</div>}
				<div className="run-button">
					<Button disabled={isButtonDisabled} raised onClick={() => this.runSimulation()} >Run Simulation</Button>

				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		startDate: state.analysis.startDate,
		endDate: state.analysis.endDate,
		longitude: state.analysis.longitude,
		latitude: state.analysis.latitude,
		cluname: state.analysis.cluname,
		expfile: state.analysis.expfile,
		weatherPattern: state.analysis.weatherPattern,
		coverCrop: state.analysis.coverCrop
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleStartDateChange: (date) => {
			dispatch(handleStartDateChange(date));
		},
		handleEndDateChange: (date) => {
			dispatch(handleEndDateChange(date));
		},
		handleWeatherPatternChange: (weatherPattern) => {
			dispatch(handleWeatherPatternChange(weatherPattern));
		},
		handleResults: (withCoverCropExecutionId, withCoverCropResultJson, withoutCoverCropExecutionId, withoutCoverCropResultJson) => {
			dispatch(handleResults(withCoverCropExecutionId, withCoverCropResultJson, withoutCoverCropExecutionId, withoutCoverCropResultJson));
		},
		handleCoverCropChange: (coverCrop) => {
			dispatch(handleCoverCropChange(coverCrop));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(RunSimulationCC);
