import { combineReducers } from "redux";
import survey from "./surveyReducer";
// Combine all reducers as root reducer
export default combineReducers({surveyData:survey});