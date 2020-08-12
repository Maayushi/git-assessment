import React, {Component} from "react";
import Header from "./Header";
import Footer from "./Footer";
import {Cell, Grid} from "react-mdc-web";
import LeftPaneCC from "./LeftPaneCC";
import RightPaneCC from "./RightPaneCC";
import AuthorizedWrap from "./AuthorizedWrap";
import AnalyzerWrap from "./AnalyzerWrap";

class AnalysisPage extends Component {

	render() {
		return (
			<AuthorizedWrap>
				<div>
					<Header selected="analysis"/>
					<AnalyzerWrap activeTab={1}/>
					<RightPaneCC/>
				</div>
			</AuthorizedWrap>
		);
	}
}

export default AnalysisPage;
