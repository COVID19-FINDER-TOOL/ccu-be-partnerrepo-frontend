import React from 'react'
import { Route,Redirect  } from 'react-router-dom';


const ProtectedRoute = ({ component: Comp, ...rest}) => {
    return (
    <Route 
    path={rest.path}
      render={props => (
        rest.isAuthenticated
        ? (
          <Comp {...props} 
            saveDataOnLogout={rest.saveDataOnLogout}
            getAndSetIsDirty = {rest.getAndSetIsDirty} 

          />
        )
        : (<Redirect to={{ pathname: '/', state: { from: props.location} }} />)
      )}
    />
    )
        };


export default ProtectedRoute;