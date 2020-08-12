import React, {Component} from "react";
import {Textfield} from "react-mdc-web";
import styles from "../styles/user-page.css";

class CoordinateFieldCC extends Component {

	render() {
		return (
			<div className="coordinate-fieldCC">
				<Textfield
					{...this.props}
					required
					helptextValidation
					/>
			</div>
		);
	}
}

export default CoordinateFieldCC;
