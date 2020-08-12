import React, {Component} from "react";
import {
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	Textfield
} from "react-mdc-web";
import config from "../app.config";
import {deletefail, expfail, expsuccess} from "../app.messages";
import {uploadDatasetToDataWolf, getKeycloakHeader} from "../public/utils";
import {handleExptxtGet} from "../actions/user";
import {connect} from "react-redux";

class UploadFieldSummary extends Component {
	constructor(props) {
		super(props);
		this.state ={
			file:null,
			isOpen: false,
			message: ""
		};
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	async onFormSubmit(e){
		e.preventDefault();
		let id = await uploadDatasetToDataWolf(this.state.file);
		console.log("Uploaded File Changed:" + id);

		let updatedUserCLU = Object.assign({}, this.props.selectedCLU);
		updatedUserCLU.expfile = id;
		let headers = {
			"Content-Type": "application/json",
			"Authorization": getKeycloakHeader(),
			"Cache-Control": "no-cache"
		};

		const CLUapi = config.CLUapi + "/userfield";
		let that = this;
		fetch(CLUapi,{
			method: "POST",
			headers: headers,
			body: JSON.stringify(updatedUserCLU)
		}).then(response => response.json())
			.then((responseJson) => {
				if(responseJson.status_code !== 200){
					this.setState({file:null, message: expfail, isOpen: true });
					console.log("set experiment file failed: " + responseJson.message);
				} else {
					this.setState({file:null, isOpen: true, message: expsuccess });
					console.log(responseJson);
				}
				this.fileInput.value = "";
			}).catch(function(e) {
			that.setState({file:null, message: expfail, isOpen: true});
			console.log("set experiment file failed: " + e);
			that.fileInput.value = "";
		});
	}

	onChange(e) {
		this.setState({file:e.target.files[0]});
	}

	async handleDelete(e) {
		e.preventDefault();
		const CLUapi = config.CLUapi + "/userfield?userid="+ this.props.email + "&clu=" + this.props.selectedCLU.clu;
		let headers = {
			"Authorization": getKeycloakHeader(),
			"Cache-Control": "no-cache"
		};
		let that = this;
		fetch(CLUapi,{
			method: "DELETE",
			headers: headers
		}).then(response => response.json())
			.then((responseJson) => {
				if(responseJson.status_code !== 200){
					this.setState({file:null, message: deletefail, isOpen: true });
					console.log("set experiment file failed: " + responseJson.message);
				} else {
					window.location.reload();
				}
			}).catch(function(e) {
			that.setState({file:null, message: deletefail, isOpen: true});
		});

	}

	componentDidUpdate(prevProps){
		// clear the input when clu is changed
		if(this.props.selectedCLUName !== prevProps.selectedCLUName){
			this.fileInput.value = "";
		}
	}

	render() {
		return (
			<div className="border-top summary-div">
				<div className="black-bottom-crop">
					<form onSubmit={this.onFormSubmit}>
						<h1>Upload Experiment File JSON for {this.props.selectedCLUName}</h1>
						<br />
						<input ref={ref=> this.fileInput = ref} type="file"
										onChange={this.onChange} />
						<button type="submit">Upload</button>
					</form>
					<Dialog
						open={this.state.isOpen}
						onClose={() => {this.setState({isOpen:false});}}
						className="unlogin"
					>
						<DialogBody>
							<p className="bold-text" key="keyword"> {this.state.message}</p>
						</DialogBody>
						<DialogFooter>
							<Button compact onClick={()=> { this.setState({isOpen: false}); }}>Close</Button>
						</DialogFooter>
					</Dialog>
				</div>
				<div className="myfarm-input summary-div">
					<h2>Name and Location</h2>
					<div className="update-box-div">
						<div className="update-box update-box-left">

							<p  className="input">FIELD NAME</p>
							<Textfield
								disabled
								value={this.props.selectedCLUName}
							/>
						</div>
						<div className="update-box update-box-left">
							<p  className="input">LOCATION</p>
							<Textfield
								disabled
								value={this.props.lat.toFixed(2)+"N " + this.props.lon.toFixed(2) +"E"}
							/>
						</div>
						<div className="update-box-left delete-field">
							<Button  onClick={this.handleDelete}>DELETE FIELD</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		email: state.user.email
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleExptxtGet: (exptxt) => {
			dispatch(handleExptxtGet(exptxt));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadFieldSummary);

