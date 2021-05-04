import React from 'react'
import { Route, Redirect } from 'react-router-dom'

function PrivateRoute( { component: Component, ...rest }) {

  return (
    <Route
      {...rest}
      render={props => {
        return window.localStorage.getItem ? <Component {...props} /> : <Redirect to="/login" />
      }}
    >
    </Route>
  )
}

export default PrivateRoute
