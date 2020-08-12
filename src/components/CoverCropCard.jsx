import React, {Component} from "react";
import {Card, Fab, CardHeader, CardMedia, CardActions, Button, CardTitle, CardSubtitle, CardText, Icon} from "react-mdc-web";

class CoverCropCard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			cardTitle: "",
			cardSubtitle: "",
			cardId: "",
			isStatic: true
		};
	}

	render() {
		return (
			<div>
				<Card onClick={this.props.onClick} id={this.props.cardId} className={this.props.className}>
					<CardHeader>
						<CardTitle>{this.props.cardTitle}<Icon className="rightmap" name="edit"/></CardTitle>
						<CardSubtitle>{this.props.cardSubtitle}</CardSubtitle>
					</CardHeader>
					<CardText/>
					<CardActions />
				</Card>
			</div>
		);
	}
}

export default CoverCropCard;
