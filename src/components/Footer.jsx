import React, {Component} from "react";
import {Cell, Grid} from "react-mdc-web";

class Footer extends Component {

	render() {
		return (
			<Grid>
				<Cell col={12}>
					<hr/>
					<Grid/>
					<hr/>
				</Cell>
			</Grid>
		);
	}
}

export default Footer;
