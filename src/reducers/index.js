import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import analysis from "./analysis";
import user from "./user";

const rootReducer = combineReducers({
	routing: routerReducer,
	analysis,
	user
});

export default rootReducer;
