import  {LOGIN,LOGOUT,CREATEJOURNEY,CLEANCREATEJOURNEY}  from "../ActionType/ActionTypes";
// Action to add article to store
export const login = data => ({
    type: LOGIN,
    payload: data
});

export const onLogOut=data=>({
    type:LOGOUT,
    payload:data

})

export const onEditInspection=data=>({
    type:CREATEJOURNEY,
    payload:data
})


export const onCleanCreateJourney=data=>({
    type:CLEANCREATEJOURNEY,
    payload:''
})
