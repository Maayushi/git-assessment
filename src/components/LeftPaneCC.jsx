import React, {Component} from "react";
import {connect} from "react-redux";
import CoverCropCard from "./CoverCropCard";
import {handleCardClick} from "../actions/analysis";

class LeftPaneCC extends Component {

	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(selectedCardIndex) {
		this.props.handleCardClick(selectedCardIndex);
	}

	renderCard(cardIndex){

		// Active Card
		if (cardIndex === this.props.activeCardIndex){

			return (<CoverCropCard
				className="cover-crop-card-active"
				cardId={this.props.cards[cardIndex].cardId}
				onClick={this.handleClick.bind(this, cardIndex)}
				cardTitle={this.props.cards[cardIndex].cardTitle}
				cardSubtitle={this.props.cards[cardIndex].cardSubtitle}/>);
		}
		// Previously visited card
		else if (cardIndex < this.props.activeCardIndex){
			return (<CoverCropCard
				className="cover-crop-card-disabled"
				cardId={this.props.cards[cardIndex].cardId}
				onClick={this.handleClick.bind(this, cardIndex)}
				cardTitle={this.props.cards[cardIndex].cardTitle}
				cardSubtitle={this.props.cards[cardIndex].cardSubtitle}/>);
		}
		// Unvisited card
		else {
			return (<CoverCropCard
				className="cover-crop-card"
				cardId={this.props.cards[cardIndex].cardId}
				cardTitle={this.props.cards[cardIndex].cardTitle}
				cardSubtitle={this.props.cards[cardIndex].cardSubtitle}/>);
		}
	}

	render(){

		let cardRows = [];
		for (let i=0; i < this.props.cards.length; i++) {
			cardRows.push(
				<div key={i}>
					{this.renderCard(i)}
					<br/>
					<br/>
				</div>);
		}

		return(
			<div>
				{cardRows}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		activeCardIndex: state.analysis.activeCardIndex,
		cards: state.analysis.cards,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleCardClick: (selectedCardIndex) => {
			dispatch(handleCardClick(selectedCardIndex));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftPaneCC);
