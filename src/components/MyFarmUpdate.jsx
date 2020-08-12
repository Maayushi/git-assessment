import React, {Component} from "react";
import {Textfield} from "react-mdc-web";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Select from "react-select";
import {dictToOptions} from "../public/utils";

class MyFarmUpdate extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const {elementType, firstField, secondField, defaultValue} = this.props;
		const options = (elementType !== "select" || Array.isArray(this.props.options)) ? this.props.options : dictToOptions(this.props.options);
		// const defaultValue = cropobj[cropyear][firstField][secondField];
		let divClasses = "update-box";
		if (this.props.isLeft) divClasses += " update-box-left";

		return (
			<div>
			{defaultValue && <div className={divClasses}>
				<p  className={this.props.elementType}>{this.props.title}</p>

				{(() => {
					switch (elementType) {
							case "select":
								return (<Select
									name={this.props.title}
									value={defaultValue}
									options={options}
									onChange={selectedOption => this.props.handler(secondField, selectedOption.value)}
								/>);

							case "date":
								return (<DatePicker className="date-picker-cc"
													showYearDropdown
													selected={moment((defaultValue))}
													onChange={moment =>
														this.props.handler(secondField, moment.toISOString())
													}
								/>);
							case "input":
								return (<Textfield
									min="0"
									type="number"
									step="1"
									value={defaultValue}
									onChange={({target: {value: updateValue}}) => {
										this.props.handler(secondField, updateValue === "" ? 1: updateValue);
									}}
								/>);
							default :
								null;
						}
					})()}

			</div>}
			</div>

		);
	}
}

export default MyFarmUpdate;

