import  {SURVEY}  from "../ActionType/ActionTypes";

// Action to add article to store
export const surveyData = survey => ({
    type: SURVEY,
    payload: survey
});