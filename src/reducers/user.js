
const defaultState = {
	email: "",
	isAuthenticated: localStorage.getItem("personId") !== null,
	userId: "",
	//used in add field page, not used in my farm page.
	clu: 0,
	//cluname is not used current
	cluname: "",
	// could be removed if not necessary.
	exptxt:"",
	cropobj: {},
	fieldobj: {},
	isSelectedEventSuccessful: "error",
	isExperimentUpdate: false
};

const user = (state = defaultState, action) => {
	switch (action.type) {
		case "CHANGE_USER_CLU":
			return Object.assign({}, state, {
				clu: action.clu,
				cluname: action.cluname
			});
		case "LOGIN":
			return Object.assign({}, state, {
				email: action.email,
				isAuthenticated: action.isAuthenticated,
				userId: action.userId
			});
		case "LOGOUT":
			return Object.assign({}, state, {
				email: "",
				isAuthenticated: false,
				userId: ""
			});
		case "SET_SELECTED_USER_EVENT_STATUS":
			return Object.assign({}, state, {
				isSelectedEventSuccessful: action.isSelectedEventSuccessful
			});
		case "GET_EXPERIMENT_TXT":
			return Object.assign({}, state, {
				isExperimentUpdate: false,
				exptxt: action.exptxt,
				cropobj: action.cropobj,
				fieldobj: action.fieldobj
			});
		case "CHANGE_EXPERIMENT_TXT":
			return Object.assign({}, state, {
				isExperimentUpdate: false,
				exptxt: action.exptxt,
			});
		case "CHANGE_CROP": {
			//TODO: cropobj as input
			let {cropyear, firstField, secondField, updateValue} = action;
			return {
				...state,
				isExperimentUpdate: true,
				cropobj: {
					...state.cropobj,
					[cropyear]: {
						...state.cropobj[cropyear],
						[firstField]: {
							...state.cropobj[cropyear][firstField],
							[secondField]: updateValue
						}
					}
				}
			};
		}
		default:
			return state;
	}
};

export default user;
