import React, {Component} from "react";
import Header from "./Header";
import Footer from "./Footer";
import styles from "../styles/main.css";

class RouteMismatch extends Component {
	render() {
		return (
			<div>
				<Header />
				<div className="contentcenter">
					<h3>404 Not Found.</h3>
				</div>
				<Footer />
			</div>
		);
	}
}

export default RouteMismatch;
