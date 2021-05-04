import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import PersonIcon from '@material-ui/icons/Person'
import FoodIcon from '@material-ui/icons/Restaurant'
import {
  BrowserRouter as Router, Link, useHistory
} from 'react-router-dom'
import { Typography } from '@material-ui/core'

const MainListItems = () => {
  const history = useHistory()

  const homeClick = () => {
    history.push('/')
    document.title = 'MyDiet - Home'
  }
  const personalInfoClick = () => {
    history.push('/PersonalInfo')
    document.title = 'MyDiet - User Information'
  }
  const foodDBClick = () => {
    history.push('/FoodDb')
    document.title = 'MyDiet - Food Database'
  }
  return(
    <div>
      <Router>
        <Link to="/" style={{ textDecoration: 'none' } } >
          <ListItem button onClick={homeClick}>
            <ListItemIcon >
              <HomeIcon />
            </ListItemIcon>
            <ListItemText disableTypography primary={<Typography type="body2" color='primary'>Home</Typography>}/>
          </ListItem>
        </Link>
        <Link to="/PersonalInfo" style={{ textDecoration: 'none' } }>
          <ListItem button onClick={personalInfoClick}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText disableTypography primary={<Typography type="body2" color='primary'>Personal Information</Typography>}/>
          </ListItem>
        </Link>
        <Link to="/FoodDb" style={{ textDecoration: 'none' } }>
          <ListItem button onClick={foodDBClick}>
            <ListItemIcon>
              <FoodIcon />
            </ListItemIcon>
            <ListItemText disableTypography primary={<Typography type="body2" color='primary'>Food Database</Typography>}/>
          </ListItem>
        </Link>
      </Router>
    </div>
  )
}

export default MainListItems