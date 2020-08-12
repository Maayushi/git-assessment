import React, {Component} from "react";
import { connect } from "react-redux";
import Select from "react-select";
import {handleLatFieldChange, handleLongFieldChange, handleCardChange, handleCLUChange} from "../actions/analysis";
import styles from "../styles/analysis-page.css";
import {getMyFieldList, wait} from "../public/utils";
import {defaultExpDatasetID} from "../datawolf.config";

class SelectFieldsCC extends Component {

	constructor(props) {
		super(props);
		this.state = {
			clus: [],
			cluname: "",
			fetchError: false,
		};
	}

	componentWillMount() {
		let that = this;
		handleCLUChange(0, "", "");
		getMyFieldList(this.props.email).then(function(clus){
			// console.log(clus)
			that.setState({clus, fetchError: false});
		}, function(err) {
			console.log(err);
			that.setState({fetchError: true});
		});
	}

	handleChange = (selectedOption) => {
		console.log(selectedOption);
		this.setState({ cluname: selectedOption.label });
		this.handleLatFieldChange(selectedOption.value.lat);
		this.handleLongFieldChange(selectedOption.value.lon);
		this.props.handleCLUChange(selectedOption.value.clu, selectedOption.value.cluname,
			selectedOption.value.expfile !== "" ? selectedOption.value.expfile: defaultExpDatasetID
		);
	};

	handleLatFieldChange = (lat) => {
		this.props.handleLatFieldChange(lat);
	};

	handleLongFieldChange = (lon) =>  {
		this.props.handleLongFieldChange(lon);
	};

	handleSubmit = () =>{
		// event.preventDefault();
		if (this.props.longitude !== "" && this.props.latitude !== "") {
			console.log(this.props.longitude + " " + this.props.latitude);
			let cardData = {
				cardTitle: "Selected Fields",
				cardSubtitle: "Latitude: " + this.props.latitude + "° \n" + "Longitude: " + this.props.longitude + "° "
			};
			this.props.handleCardChange(0, 1, cardData);
		}
		else {
			console.log("Choose coordinates.");
		}
	};

	//TODO: add search function.
    //TODO: div is pop up, text is too bottom.
    //TODO: the click on Icon is not working.
	render() {

		let options = this.state.clus.map(w => Object.assign({ value: w, label: w.cluname }));
		const {cluname} = this.state;
		if(this.state.fetchError) {
			return (
				<div className="search-bg-error" >
					<p className="error-message">Failed to get your farm list.</p>
				</div>
			);
		}

		return(

			<div className="search-bg">
				<Select
					className=""
					name="selectclu"
					value={cluname}
					onChange={this.handleChange}
					options={options}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		longitude: state.analysis.longitude,
		latitude: state.analysis.latitude,
		email: state.user.email
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleLatFieldChange: (lat) => {
			dispatch(handleLatFieldChange(lat));
		},
		handleLongFieldChange: (lon) => {
			dispatch(handleLongFieldChange(lon));
		},
		handleCardChange: (oldCardIndex, newCardIndex, oldCardData) => {
			dispatch(handleCardChange(oldCardIndex, newCardIndex, oldCardData));
		},
		handleCLUChange: (clu, cluname, expfile) => {
			dispatch(handleCLUChange(clu, cluname, expfile));
		}

	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectFieldsCC);
