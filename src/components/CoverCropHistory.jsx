import React, {Component} from "react";
import {Button, Dialog, DialogBody, DialogFooter, Icon, Title} from "react-mdc-web";
import Select from "react-select";
import {connect} from "react-redux";
import Planting from "./Planting";
import {getKeycloakHeader, isCoverCrop, getCoverCropForYear} from "../public/utils";
import {handleExptxtGet} from "../actions/user";
import Harvest from "./Harvest";
import {coverCropOptions, cultivars, defaultCropYears} from "../experimentFile";
import config from "../app.config";
import {getExperimentSQX} from "../public/utils";

class CoverCropHistory extends Component {

	constructor(props) {
		super(props);
		this.state = {
			year: this.props.cropobj ? undefined : this.props.cropobj.keys()[0].substr(0, 4),
			isOpen: false,
			covercropSel: this.props.cropobj ? undefined : this.props.cropobj.keys()[0].substr(5),
			yearCrop: this.props.cropobj ? undefined :
					this.props.cropobj.keys()[0].substr(0, 4) + " " +
					this.props.cropobj.keys()[0].substr(5),
			covercropSaved: this.props.cropobj ? undefined : this.props.cropobj.keys()[0].substr(5),

		};
	}

	componentDidUpdate(prevProps) {
		if (this.props.clu !== prevProps.clu) {
			this.setState({year: undefined});
		}
	}

	handleSelectYear = (year) => {
		this.setState({year: year});
		let ccrop = getCoverCropForYear(this.props.cropobj, year);
		if(ccrop === null){
			ccrop = "None";
		}
		this.setState({covercropSaved: ccrop});
		this.setState({covercropSel: ccrop});
		this.setState({yearCrop: year + " " + ccrop});
	};

	handleSelectCoverCrop = (covercropSel) => {
		this.setState({covercropSel});
		this.setState({yearCrop: this.state.year + " " + covercropSel});
	};

	handleClick = () => {

		let jsonBody;
		let {email, clu} = this.props;
		if (this.state.covercropSel === "None") {
			jsonBody = [
				{
					"EVENT": "planting",
					"PLNAME": this.state.year + " " + this.state.covercropSaved,
					"CONTENT": []
				},
				{
					"EVENT": "harvest",
					"HNAME": this.state.year + " " + this.state.covercropSaved,
					"CONTENT": []
				}
			];
		}
		else {
			let plantingJson = this.planting.getBodyJson();
			plantingJson["CONTENT"][0]["CNAME"] = cultivars[this.state.covercropSel]; // Add CNAME field to planting JSON
			let harvestJson = this.harvest.getBodyJson();
			jsonBody = [plantingJson, harvestJson];
		}
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
					this.setState({isOpen: true});
				});
			}
		}).catch(error => console.error("Error:", error));
	};

	render() {

		let options = defaultCropYears.map(function(key){
			return {value: key, label: key};
		});

		let ccOptions = coverCropOptions.map(function (key) {
			return {value: key, label: key};
		});


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
					{this.state.yearCrop && <div className="no-bottom-crop" key="cultivars">
						<Title>Cultivars </Title>
						<div className="update-box-div">
							<div className="update-box update-box-left">
								<p>CROP</p>
								<Select
									name="CROP"
									value={this.state.covercropSel}
									options={ccOptions}
									onChange={selectedOption => this.handleSelectCoverCrop( selectedOption.value)}
								/>
							</div>
						</div>
					</div>}
					{this.state.covercropSel !== "None" &&
					<Planting title="Establishment" year={this.state.yearCrop} onRef={ref => (this.planting = ref)}/> }
					{this.state.covercropSel !== "None" &&
					<Harvest title="Termination" year={this.state.yearCrop} onRef={ref => (this.harvest = ref)}/> }
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

export default connect(mapStateToProps, mapDispatchToProps)(CoverCropHistory);

