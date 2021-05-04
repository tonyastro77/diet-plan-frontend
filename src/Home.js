import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import foodService from './services/foods'
import personalService from './services/personalInfo'
import progressService from './services/progress'

import Chart from './components/Chart'
import Copyright from './components/Copyright'
import Dashboard from './Dashboard'
import FoodList from './components/FoodList'
import SignIn from './components/SignIn'
import PersonalInfo from './components/PersonalInfo'
import FoodDB from './components/FoodDB'
import TotalProgress from './components/TotalProgress'

import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}))

export default function Home() {
  const classes = useStyles()
  const [user, setUser] = useState(null)
  const [totalCalories, setTotalCalories] = useState('')

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  useEffect(() => {
    document.title = 'MyDiet - Home'
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      foodService.setToken(user.token)
      personalService.setToken(user.token)
      progressService.setToken(user.token)
    }
  }, [])

  const handleLogin = (username) => {
    setUser(username)
  }

  const getTotal = (calories) => {
    setTotalCalories(calories)
  }

  const logOut = () => {
    setUser(null)
    window.localStorage.clear()
    window.location.reload()
  }

  const MainPage = (username) => {
    return(
      <div className={classes.root}>
        <CssBaseline />
        <Dashboard username={user.name} logOut={logOut}/>
        {HomePage(username)}
      </div>
    )
  }

  const HomePage = (username) => {
    return(
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Chart />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <TotalProgress totalCalories={totalCalories} userName={username} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <FoodList userName={user.username} total={getTotal}/>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <Copyright />
      </main>
    )
  }

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" render={() => user === null ? <SignIn handleLogin={handleLogin} /> : MainPage(user.username)} />
          <Route path={'/PersonalInfo'} render={() => user === null ? <SignIn handleLogin={handleLogin} /> : <PersonalInfo userName={user.username} titleName={user.name} />} />
          <Route path={'/FoodDb'} render={() => user === null ? <SignIn handleLogin={handleLogin} /> : <FoodDB titleName={user.name} userName={user.username} />} />
          <Route render={() => <h1 style={{ marginTop: '100px' }}>404: page not found</h1>} />
        </Switch>
      </div>
    </Router>
  )
}