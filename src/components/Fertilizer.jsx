import React, {Component} from "react";
import {convertFullDate,
	convertLbPerAcreToKgPerHa,
	convertKgPerHaToLbPerAcre} from "../public/utils";
import MyFarmUpdate from "./MyFarmUpdate";
import {defaultFertilizer, FACD, FMCD} from "../experimentFile";
import {connect} from "react-redux";
import {handleExptxtGet} from "../actions/user";

class Fertilizer extends Component {

	constructor(props) {
		super(props);
		// set to null not "none", for not showing this component if user has not select a year
		this.state ={FMCD: null};
	}

	componentDidMount() {
		this.props.onRef(this);
		this.setState({FMCD: "None"});
		this.setState(this.props.crop);
		let fdate = this.props.crop["FDATE"];
		this.setState({"FDATE":convertFullDate(fdate)});
		if(this.props.crop["FAMN"]){
			this.setState({"FAMN" :
						convertKgPerHaToLbPerAcre(this.props.crop["FAMN"]).toString()});
		}
	}

	componentWillUnmount() {
		this.props.onRef(undefined);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({FMCD: "None"});
		this.setState(nextProps.crop);
		let fdate = nextProps.crop["FDATE"];
		this.setState({"FDATE": convertFullDate(fdate)});
		this.setState({"FAMN" : convertKgPerHaToLbPerAcre(nextProps.crop["FAMN"]).toString()});
	}

	getBodyJson(){
		let jsonBody = Object.assign({}, this.state);

		if(jsonBody["FMCD"] !== "None"){
			jsonBody["FDATE"] = jsonBody["FDATE"].replace(/-/g, "").substring(0, 8);
		}

		if(jsonBody["FAMN"] !== undefined && jsonBody["FAMN"]){
			jsonBody["FAMN"] = convertLbPerAcreToKgPerHa(jsonBody["FAMN"]).toString();
		}
		return jsonBody;
	}

	handler = (field_name, field_value) => {
		this.setState({[field_name] : field_value});
		// add fertilizer
		if(field_name === "FMCD" && field_value !=="None" && !this.state.FDATE){
			let pureyear = this.props.year.split(" ")[0];
			let newFertilizer = Object.assign({}, defaultFertilizer);
			newFertilizer["FMCD"] = field_value;
			// set default date as 04-02
			newFertilizer["FDATE"] = new Date(pureyear, 3, 2).toISOString();
			newFertilizer["FERNAME"] = this.props.year;
			if(this.state.addnew){
				this.props.addFertilizer(newFertilizer);
			}
			this.setState(newFertilizer);
			this.setState({addnew:false});

		}
		// delete fertilizer
		if(field_name === "FMCD" && field_value ==="None"){
			this.setState({FDATE:undefined});
		}
	}

	render() {
		return (
			(this.state.FMCD) ?
			<div className="fertilizer-box-left">
				<MyFarmUpdate elementType="select" title="MATERIAL" cropyear={this.state.year}
											firstField="MF" secondField="FMCD" options={FMCD}
											defaultValue={this.state.FMCD} handler = {this.handler}
				/>
				{this.state.FDATE? <div>
					<MyFarmUpdate elementType="select" title="APPLICATION" cropyear={this.state.year}
												firstField="MF" secondField="FACD" options={FACD}
												defaultValue={this.state.FACD} handler={this.handler}
					/>

						< MyFarmUpdate elementType="input" title="AMOUNT, lb/acre" cropyear={this.state.year}
												firstField="MF" secondField="FAMN"
												defaultValue={this.state.FAMN} handler = {this.handler}
						/>
						<MyFarmUpdate elementType="input" title="DEPTH, in" cropyear={this.state.year}
													firstField="MF" secondField="FDEP"
													defaultValue={this.state.FDEP} handler = {this.handler}
						/>

					<MyFarmUpdate elementType="date" title="DATE APPLIED" cropyear={this.state.year}
												firstField="MF" secondField="FDATE"
												defaultValue={this.state.FDATE} handler = {this.handler}
					/>

				</div>: null}
			</div>:<div />
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		handleExptxtGet: (exptxt) => {
			dispatch(handleExptxtGet(exptxt));
		}
	};
};

export default connect(null, mapDispatchToProps)(Fertilizer);

