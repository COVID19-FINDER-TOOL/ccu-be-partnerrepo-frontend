
import { LOGOUT, LOGIN, CREATEJOURNEY, CLEANCREATEJOURNEY, SURVEY } from '../ActionType/ActionTypes'

const survey = (state = {}, action) => {
    switch (action.type) {
        case LOGOUT:
            return state = {}
        case LOGIN:
            return { ...state, LOGIN: action.payload };
        case CREATEJOURNEY:
            let payload = Object.assign({}, state.CREATEJOURNEY, action.payload)
            return { ...state, CREATEJOURNEY: payload }
        case CLEANCREATEJOURNEY:
            return { ...state, CREATEJOURNEY: '' }
        case SURVEY:
            let data = Object.assign({}, state.SURVEY, action.data)
            return { ...state, SURVEY: data }
        default:
            return state;
    }
}

export default survey;