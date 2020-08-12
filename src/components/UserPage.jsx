import React, {Component} from "react";
import Header from "./Header";
import Footer from "./Footer";
import {Button, Content, Textfield, Card, CardText, Body1, Body2, Checkbox, FormField, Grid, Cell} from "react-mdc-web";
import styles from "../styles/main.css";
import UserEvents from "./UserEvents";
import ViewResultsCC from "./ViewResultsCC";
import AuthorizedWrap from "./AuthorizedWrap";
import AnalyzerWrap from "./AnalyzerWrap";

class UserPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isSelectedEventSuccessful: true
		};

		this.handleEventClick = this.handleEventClick.bind(this);
	}

	handleEventClick (isSelectedEventSuccessful) {
		this.setState({isSelectedEventSuccessful: isSelectedEventSuccessful});
	}

	render() {
		return (
			<AuthorizedWrap>
				<div>
					<Header selected="user"/>
					<AnalyzerWrap activeTab={4}/>


					<Grid className="no-padding-grid">
						<Cell col={4}>
							<UserEvents />
						</Cell>
						<Cell col={8}>
							<ViewResultsCC />
						</Cell>
					</Grid>


				</div>
			</AuthorizedWrap>
		);
	}
}

export default UserPage;
