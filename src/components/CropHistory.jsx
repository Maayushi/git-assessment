import React, {Component} from "react";
import {Button, Dialog, DialogBody, DialogFooter, Icon, Title} from "react-mdc-web";
import Select from "react-select";
import {connect} from "react-redux";
import Fertilizer from "./Fertilizer";
import Planting from "./Planting";
import config from "../app.config";
import {
	getExperimentSQX,
	getKeycloakHeader,
	isCashCrop,
} from "../public/utils";
import {handleExptxtGet} from "../actions/user";
import Harvest from "./Harvest";
import Tillage from "./Tillage";
import {cashCropOptions, cultivars, defaultCropYears} from "../experimentFile";

class CropHistory extends Component {

	constructor(props) {
		super(props);
		this.state = {
			year: this.props.cropobj ? undefined : this.props.cropobj.keys()[0],
			isOpen: false,
			flist: [{FMCD: "None", addnew: true}],
			crop: null,
		};
		// this.fertilizer is filter by isDefined, cause the fertilizer number
		// is not all the same, and may get undefined error when switching from
		// a long list to a short list
		this.fertilizer = [];
	}

	componentDidUpdate(prevProps) {
		//change to a new CLU
		if (this.props.clu !== prevProps.clu) {
			this.setState({year: undefined});
		}
		// update for fertilizer, planting and harvest is updated in the child component.
		if (this.props.cropobj !== prevProps.cropobj) {
			let year = this.state.year;
			if(year) {
				let flist = [
					{FMCD: "None", addnew: true}
				];
				if(this.props.cropobj[year]){
					flist = this.props.cropobj[year]["MF"].concat(flist);
				}
				this.setState({flist: flist});
			}
		}
	}

	handleSelectYear = (year) => {
		this.setState({year: year});
		if(this.props.cropobj[year]){
			let flist = [
				...this.props.cropobj[year]["MF"],
				{FMCD: "None", addnew: true}
			];
			this.setState({flist: flist,
				crop: this.props.cropobj[year]["CROP"] !== "Fallow" ? this.props.cropobj[year]["CROP"] : "None"
			});
		} else{
			this.setState({flist: [{FMCD: "None", addnew: true}],
				crop: "None"
			});
		}

	}

	handleSelectCrop = (crop) => {
		if (this.state.crop === "None"){
			// this.planting.setDefault();
			// this.harvest.setDefault();
		}
		this.setState({crop: crop});
	}

	handleClick = () => {

		let jsonBody = [];
		let {email, clu} = this.props;
		let newName = this.state.year;
		if (this.state.crop === "None") {
			newName = this.state.year.slice(0, 5) + "Fallow";
			let oldName = this.state.year;
			let tillageJson = this.tillage.getBodyJson();

			jsonBody = [
				{
					"EVENT": "planting",
					"PLNAME": oldName,
					"CONTENT": []
				},
				{
					"EVENT": "fertilizer",
					"FERNAME": oldName,
					"CONTENT": []
				},

				{
					"EVENT": "harvest",
					"HNAME": oldName,
					"CONTENT": []
				},

				{
					"EVENT": "tillage",
					"TNAME": oldName,
					"CONTENT": []
				},
			];
			if (tillageJson["CONTENT"].length > 0) {
				tillageJson["TNAME"] = newName;
				jsonBody.push(tillageJson);
			}
			let fContent = this.fertilizer.filter(f => f).map(f => f.getBodyJson())
				.filter(jsonBody => jsonBody["FMCD"] !== "None");
			if (fContent.length > 0){

				let fbody = {
						"EVENT": "fertilizer",
						"FERNAME": newName,
						"CONTENT": fContent
					};
				jsonBody.push(fbody);
			}

		} else {
			// crop type is not changed

			let fertilizerJson = {"EVENT": "fertilizer", "FERNAME": this.state.year};
			fertilizerJson["CONTENT"] = this.fertilizer.filter(f => f).map(f => f.getBodyJson())
				.filter(jsonBody => jsonBody["FMCD"] !== "None");
			let plantingJson = this.planting.getBodyJson();
			plantingJson["CONTENT"][0]["CNAME"] = cultivars[this.state.crop]; // Add CNAME field to planting JSON
			let harvestJson = this.harvest.getBodyJson();
			let tillageJson = this.tillage.getBodyJson();

			jsonBody = [fertilizerJson, plantingJson, harvestJson, tillageJson];
			// crop type is changed
			if (this.state.year.indexOf(this.state.crop) < 0) {
				let oldName = this.state.year;
				newName = this.state.year.slice(0, 5) + this.state.crop;
				fertilizerJson["FERNAME"] = newName;
				plantingJson["PLNAME"] = newName;
				harvestJson["HNAME"] = newName;
				tillageJson["TNAME"] = newName;
				jsonBody = [
					{
						"EVENT": "planting",
						"PLNAME": oldName,
						"CONTENT": []
					},
					{
						"EVENT": "fertilizer",
						"FERNAME": oldName,
						"CONTENT": []
					},
					{
						"EVENT": "harvest",
						"HNAME": oldName,
						"CONTENT": []
					},
					{
						"EVENT": "tillage",
						"TNAME": oldName,
						"CONTENT": []
					},
					fertilizerJson, plantingJson, harvestJson, tillageJson
				];
			}
		}

		// console.log(JSON.stringify(jsonBody, null, 2));
		fetch(config.CLUapi + "/users/" + email + "/CLUs/" + clu + "/experiment_file_json", {
			method: "PATCH",
			body: JSON.stringify(jsonBody),
			headers: {
				"Content-Type": "application/json",
				"Authorization": getKeycloakHeader(),
				"Cache-Control": "no-cache"
			}
		}).then(updateResponse => {
			if (updateResponse.status === 200) {
				//to make sure the response is a json. a is not called but should be kept
				let a = updateResponse.json();
				getExperimentSQX(email, clu).then(exptxt => {
					this.props.handleExptxtGet(exptxt);
					this.setState({isOpen: true, year: this.state.year.slice(0, 5) + this.state.crop});
				});
			}
		}).catch(error => console.error("Error:", error));
	}

	addFertilizer = (newFertilizer) => {
		let newObj = {FMCD: "None", addnew: true};
		let that = this;
		this.setState((state) => ({ flist:
				that.fertilizer.filter(f => f).map(f => f.getBodyJson()).slice(0, -1).concat([newFertilizer, newObj])}));

	}

	render() {
		let years =[];
		for(let key in this.props.cropobj){
			if (isCashCrop(this.props.cropobj[key])){
				years.push(key);
			}
		}

		let options = defaultCropYears.map(function(key){
			let yearName = years.find(s => s.includes(key) && (s.includes("Corn") || s.includes("Soybean")));
			if (yearName){
				return {value: yearName, label:key};
			} else {
				return {value: key +" None", label:key};
			}
		});

		let cropOptions = cashCropOptions.map(function (key) {
			return {value: key, label: key};
		});

		let fertilizerUI = this.state.flist.map((crop, index) =>
			<Fertilizer key={index+ "f"} year={this.state.year} crop={crop}
						onRef={ref => (this.fertilizer[index] = ref)}
						addFertilizer={this.addFertilizer}
			/>
		);
		return (
			<div>
				<div className="border-top summary-div myfarm-input">

					<div className="black-bottom-crop" key="selectyear">
						<div className="update-box">
							<p>YEAR</p>
							<Select
								name="year"
								value={this.state.year}
								options={options}
								onChange={selectedOption => this.handleSelectYear(selectedOption.value)}
							/>
						</div>
					</div>

					{this.state.year && <div className="no-bottom-crop" key="cultivars">
						<Title>Cultivars </Title>
						<div className="update-box-div">
							<div className="update-box update-box-left">
								<p>CROP</p>
								<Select
									name="CROP"
									value={this.state.crop}
									options={cropOptions}
									onChange={selectedOption => this.handleSelectCrop( selectedOption.value)}
								/>
							</div>
						</div>
					</div>}
					{this.state.crop !== "None" &&
					<Planting title="Planting" year={this.state.year} onRef={ref => (this.planting = ref)}/>}
					{this.state.crop !== "None" &&
					<Harvest title="Harvest" year={this.state.year} onRef={ref => (this.harvest = ref)}/>}
					{this.state.year && <div className="black-top-crop" key="fertilizer">

						<Title>Fertilizer </Title>
						<div className="fertilizer-box-div">
							{fertilizerUI}
						</div>
					</div>
					}
					<Tillage year={this.state.year} onRef={ref => (this.tillage = ref)}/>
					{this.state.year && <Button raised onClick={() => this.handleClick()}>UPDATE</Button>}
				</div>
				<Dialog
					open={this.state.isOpen}
					onClose={() => {this.setState({isOpen:false});}}
					className="unlogin"
				>
					<DialogBody>
						<Icon  name="done"/>
						<br />
						<p className="bold-text" key="keyword">Experiment file update success.</p>
					</DialogBody>
					<DialogFooter>
						<Button compact onClick={()=> { this.setState({isOpen: false}); }}>Close</Button>
					</DialogFooter>
				</Dialog>
			</div>

		);
	}
}

const mapStateToProps = (state) => {
	return {
		cropobj: state.user.cropobj,
		email: state.user.email,
		clu: state.user.clu,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleExptxtGet: (exptxt) => {
			dispatch(handleExptxtGet(exptxt));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CropHistory);

