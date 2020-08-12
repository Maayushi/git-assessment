import React, {Component} from "react";
import {Title} from "react-mdc-web";
import {convertFullDate} from "../public/utils";
import MyFarmUpdate from "./MyFarmUpdate";
import {defaultTillage, TIMPL} from "../experimentFile";
import {connect} from "react-redux";

class Tillage extends Component {

	constructor(props) {
		super(props);
		this.state = {TIMPL: null};
	}

	componentDidMount() {
		this.props.onRef(this);
		let year = this.props.year;
		this.setInitialState(this.props, year);
	}

	componentWillUnmount() {
		this.props.onRef(undefined);
	}

	componentWillReceiveProps(nextProps) {
		let year = nextProps.year;
		this.setInitialState(nextProps, year);
	}

	setInitialState(nextProps, year) {
		if (year) {
			this.setState({TIMPL: "None"});
			let selectcrop = nextProps.cropobj[year] ? nextProps.cropobj[year]["MT"] : {};
			this.setState(selectcrop);
			if (nextProps.cropobj[year] && nextProps.cropobj[year]["MT"]) {
				let tdate = selectcrop["TDATE"];
				this.setState({"TDATE": convertFullDate(tdate)});
			}
		}
	}

	getBodyJson() {
		let jsonBody = {};
		jsonBody["CONTENT"] = [Object.assign({}, this.state)];
		let {email, clu, year} = this.props;
		let requestStatus = false;
		if (jsonBody["CONTENT"][0]["TDATE"]) {

			jsonBody["TNAME"] = year;
			jsonBody["CONTENT"][0]["TDATE"] = jsonBody["CONTENT"][0]["TDATE"].replace(/-/g, "").substring(0, 8);
			jsonBody["EVENT"] = "tillage";
			return jsonBody;

		} else {
			return {
				"EVENT": "tillage",
				"TNAME": year,
				"CONTENT": []
			};
		}

	}

	handler = (field_name, field_value) => {
		this.setState({[field_name]: field_value});
		// add tillage
		if (field_name === "TIMPL" && field_value !== "None" && !this.state.TDATE) {
			let pureyear = this.props.year.split(" ")[0];
			let newTillage = Object.assign({}, defaultTillage);
			newTillage["TIMPL"] = field_value;
			// set default date as 09-22
			newTillage["TDATE"] = new Date(pureyear, 8, 22).toISOString();
			newTillage["TNAME"] = this.props.year;
			this.setState(newTillage);
		}
		// delete tillage
		if (field_name === "TIMPL" && field_value === "None") {
			this.setState({TDATE: undefined});
		}
	}

	render() {
		return (

			(this.state.TIMPL) ?
				<div className="black-top-crop after-fertilizer-div" key="tillage">
					<Title>Tillage </Title>

					<MyFarmUpdate elementType="select" title="IMPLEMENT" cropyear={this.state.year}
												firstField="MT" secondField="TIMPL" options={TIMPL}
												defaultValue={this.state.TIMPL} handler={this.handler}
					/>

					{this.state.TDATE && <div>
						<MyFarmUpdate elementType="date" title="DATE" cropyear={this.state.year}
													firstField="MT" secondField="TDATE"
													defaultValue={this.state.TDATE} handler={this.handler}
						/>
						<MyFarmUpdate elementType="input" title="DEPTH" cropyear={this.state.year}
													firstField="MT" secondField="TDEP"
													defaultValue={this.state.TDEP} handler={this.handler}
						/>

					</div>}

				</div> : <div />

		);
	}
}

const mapStateToProps = (state) => {
	return {
		email: state.user.email,
		clu: state.user.clu,
		cropobj: state.user.cropobj,
	};
};

export default connect(mapStateToProps, null)(Tillage);
