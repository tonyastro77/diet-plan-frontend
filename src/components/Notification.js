import React from 'react'
import Alert from '@material-ui/lab/Alert'

const Notification = ({ message, messageType }) => {
  if(message === '') {
    return null
  }

  else {
    return (
      <Alert severity={messageType}>
        {message}
      </Alert>
    )}
}

export default Notification