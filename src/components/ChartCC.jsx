import React, {Component} from "react";
import { connect } from "react-redux";
import {Line} from "react-chartjs-2";

class ChartCC extends Component {

	constructor(props) {
		super(props);
		this.generateCharts = this.generateCharts.bind(this);
		this.generateChartsHTML = this.generateChartsHTML.bind(this);
		this.generateColors = this.generateColors.bind(this);
		this.colorsWithAlpha = [];
		this.colorsWithoutAlpha = [];

		this.generateColors();
	}

	generateColors() {

		const colorPalette = require("nice-color-palettes");
		const hexToRgba = require("hex-to-rgba");
		const colorPaletteIndex = 42; // Specific palette to choose

		for (let colorIndex = 0; colorIndex < colorPalette[colorPaletteIndex]["length"]; colorIndex++) {
			this.colorsWithAlpha.push(hexToRgba(colorPalette[colorPaletteIndex][colorIndex].toString(), 0.4));
			this.colorsWithoutAlpha.push(hexToRgba(colorPalette[colorPaletteIndex][colorIndex].toString()));
		}
	}

	// Based on crop name obtained from the dataset label, return the color index from the current palette
	static chooseColorIndexByCropName(datasetLabel) {

		if (datasetLabel.toLowerCase().indexOf("corn") !== -1) {

			return 3; // similar to yellow
		}
		else if (datasetLabel.toLowerCase().indexOf("soybean") !== -1) {

			return 4; // similar to green
		}
		else if (datasetLabel.toLowerCase().indexOf("rye") !== -1) {

			return 1; // similar to red
		}
		else {

			return 0;
		}

	}

	// Based on crop type obtained from the dataset label, return the color index from the current palette
	static chooseColorIndexByCropType(datasetLabel) {

		if (datasetLabel.toLowerCase().indexOf("w/ cover crop") !== -1) {

			return 1; // similar to black
		}
		else if (datasetLabel.toLowerCase().indexOf("w/o cover crop") !== -1) {

			return 2; // similar to red
		}
		else {

			return 0;
		}
	}


	// Generates charts array object containing individual charts and datasets
	generateCharts(chartArrayTypeName, chartDataArray, plantingDate, harvestDate) {
		let colorIndex = 0;
		let minTime = plantingDate.getTime();
		let maxTime = harvestDate.getTime();

		if (this.props.hasOwnProperty(chartArrayTypeName) && this.props[chartArrayTypeName] !== null) {
			if(this.props[chartArrayTypeName].hasOwnProperty("charts")){
				// Iterate over each chart
				let charts =  this.props[chartArrayTypeName].charts;
				for (let dataIndex = 0; dataIndex < charts.length; dataIndex++) {
					let chartRawData = charts[dataIndex];

					// Set chart options
					let chartOptions = {
						title: {
							text: chartRawData.title,
							display: true,
							fontSize: 14
						},
						scales: {
							xAxes: [{
								scaleLabel: {
									display: true,
									labelString: chartRawData.xAxis
								},
								gridLines: {
									lineWidth: 2
								},
								type: "time",
								time: {
									unit: chartRawData.xAxisUnit.toLowerCase(),
									unitStepSize: 4,
									displayFormats: {
										month: "YYYY MMM",
									},
									tooltipFormat: "MM/DD/YYYY",
									min: minTime, // TODO: Check what needs to be the default value
									max: maxTime // TODO: Check what needs to be the default value
								}
							}],
							yAxes: [{
								scaleLabel: {
									display: true,
									labelString: chartRawData.yAxis + " (" + chartRawData.yAxisUnit + ")"
								}
							}],
						}
					};

					let rawDatasets = chartRawData.datasets;
					let parsedDatasets = [];

					// Iterate over each dataset in the chart
					for (let datasetIndex = 0; datasetIndex < rawDatasets.length; datasetIndex++) {

						let rawData = rawDatasets[datasetIndex].data;
						let parsedData = [];

						// Generate data to be added to the dataset
						for (let dataIndex = 0; dataIndex < rawData.length; dataIndex++) {
							// TODO: Remove the if condition. Temporary fix till server-side bug is fixed.
							if (!(chartRawData.title === "Carbon : Nitrogen" && dataIndex === 0)) {
								parsedData.push({
									x: new Date(rawData[dataIndex].YEAR, 0, rawData[dataIndex].DOY),
									y: rawData[dataIndex].value
								});
							}
						}

						// Create dataset object with appropriate options and data
						colorIndex = ChartCC.chooseColorIndexByCropType(rawDatasets[datasetIndex].dataset_label);
						let datasetColor = this.colorsWithoutAlpha[colorIndex];
						let datasetLabel = (chartArrayTypeName === "withCoverCropChartDataArray") ? "w/ Cover Crop" : "w/o Cover Crop";
						let dataset = {
							label: datasetLabel,
							fill: false,
							lineTension: 0.1,
							backgroundColor: datasetColor,
							borderColor: datasetColor,
							borderCapStyle: "butt",
							borderDash: [],
							borderDashOffset: 0.0,
							borderJoinStyle: "miter",
							borderWidth: 1,
							pointBorderColor: datasetColor,
							pointBackgroundColor: "#fff",
							pointBorderWidth: 1,
							pointHoverRadius: 3,
							pointHoverBackgroundColor: datasetColor,
							pointHoverBorderColor: datasetColor,
							pointHoverBorderWidth: 2,
							pointRadius: 1,
							pointHitRadius: 10,
							data: parsedData
						};

						parsedDatasets.push(dataset);
					}

					let chartData = {
						// TODO: Check with team on this. Having fixed labels vs dynamic labels selected by chart.js based on input data
						// labels: labelArray,
						datasets: parsedDatasets
					};

					// Chart for this variable has been already created
					if (chartDataArray.hasOwnProperty(chartRawData.variable)) {
						chartDataArray[chartRawData.variable].chartData.datasets = chartDataArray[chartRawData.variable].chartData.datasets.concat(parsedDatasets);
					}
					// Chart for this variable has to be created
					else {
						chartDataArray[chartRawData.variable] = {
							chartData: chartData,
							chartOptions: chartOptions
						};
					}
				}
			}
		}
	}

	// Generate and return charts HTML content
	generateChartsHTML() {

		let resultHtml = [];
		let keys = [];
		let chartDataArray = {}; // Associative array to store chart data
		let plantingDate = new Date();
		let harvestDate = new Date();

		if (this.props.hasOwnProperty("userInputJson") && this.props["userInputJson"] !== null && this.props["userInputJson"] !== undefined) {

			let plantingYear = this.props["userInputJson"]["year_planting"];
			let harvestYear = plantingYear + 1;
			let plantingDOY = this.props["userInputJson"]["doy_planting"];
			let harvestDOY = this.props["userInputJson"]["doy_harvest"];
			plantingDate = new Date(plantingYear, 0, plantingDOY);
			harvestDate = new Date(harvestYear, 0, harvestDOY);

			this.generateCharts("withCoverCropChartDataArray", chartDataArray, plantingDate, harvestDate); // generate charts for with cover crop case
			this.generateCharts("withoutCoverCropChartDataArray", chartDataArray, plantingDate, harvestDate); // generate charts for without cover crop case

			console.log("Charts array: ");
			console.log(chartDataArray);

			let chartIndex = 0;
			for (let key in chartDataArray) {

				let chartData = chartDataArray[key].chartData;
				let chartOptions = chartDataArray[key].chartOptions;

				resultHtml.push(
					<div key={"div-" + chartIndex} className="line-chart-div">
						<Line key={"line-" + chartIndex} data={chartData} options={chartOptions}/>
					</div>);

				chartIndex++;
			}
		}

		return resultHtml;
	}

	render() {
		return (
				<div className="line-chart-parent-div">{this.generateChartsHTML()}</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		withCoverCropChartDataArray: state.analysis.withCoverCropResultJson,
		withoutCoverCropChartDataArray: state.analysis.withoutCoverCropResultJson,
		userInputJson: state.analysis.userInputJson
	};
};

export default connect(mapStateToProps, null)(ChartCC);
