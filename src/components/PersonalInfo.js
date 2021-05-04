import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import personalInfo from '../services/personalInfo'

import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import Snackbar from '@material-ui/core/Snackbar'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'

import Copyright from './Copyright'
import EditInfo from './EditInfo'
import Dashboard from '../Dashboard'
import Title from './Title'

import { useHistory } from 'react-router-dom'

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
    paddingBottom: theme.spacing(2),
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
  tableHeader: {
    fontWeight: 'bold',
  }
}))

function PersonalInfo(props) {
  const classes = useStyles()
  const history = useHistory()
  const [info, setInfo] = useState([])
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [gender, setGender] = useState('m')
  const [activity, setActivity] = useState('sedentary')
  const [goal, setGoal] = useState('lose weight')
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(false)

  const fetchData = () => {
    personalInfo
      .getAll()
      .then(response => {
        setInfo(response)
      })
  }

  useEffect(() => {
    document.title = 'MyDiet - User Information'
    fetchData()
  }, [])

  const genVal = {
    'm': 5,
    'f': -161
  }
  const actVal= {
    'sedentary': 1.2,
    'lightly active': 1.375,
    'moderately active': 1.55,
    'very active': 1.725,
    'extra active': 1.9,
  }
  const goalVal = {
    'lose weight': -500,
    'keep weight': 0,
    'gain weight': +500,
  }
  const saveInfo = () => {
    if(isNaN(age) || isNaN(height) || isNaN(weight)){
      alert('Not valid input, they have to be numbers')
    }
    else{
      const newInfo = {
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        gender: gender,
        activity: activity,
        goal: goal,
        genderconstant: genVal[gender],
        activityconstant: actVal[activity],
        goalconstant: goalVal[goal]
      }

      personalInfo
        .create(newInfo)
        .then(x => {
          setInfo(info.concat(x))
          window.location.reload()
        })
        .catch(error => alert(error))
    }
  }

  const updateInfo = (id, updatedFood) => {
    personalInfo
      .update(id, updatedFood)
      .then(x => {
        setInfo(info.map(y => y.id !== id ? y : x))
        setMessage('Changes saved successfully')
        setOpen(true)
      })
      .catch(error => console.log(error))
  }

  function handleClose(){
    setOpen(false)
  }
  const logOut = () => {
    history.push('/')
    window.localStorage.clear()
    window.location.reload()
  }
  const MainPage = () => {
    return(
      <Table size="small">
        <TableHead>
          <TableRow >
            <TableCell align="left" className={classes.tableHeader}>Name</TableCell>
            <TableCell align="center" className={classes.tableHeader}>Age</TableCell>
            <TableCell align="center" className={classes.tableHeader}>Height (m)</TableCell>
            <TableCell align="center" className={classes.tableHeader}>Weight (kg)</TableCell>
            <TableCell align="center" className={classes.tableHeader}>Gender</TableCell>
            <TableCell align="center" className={classes.tableHeader}>Activity</TableCell>
            <TableCell align="center" className={classes.tableHeader}>Goal</TableCell>
            <TableCell align="center" className={classes.tableHeader}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="left">{info[0].user.name}</TableCell>
            <TableCell align="center">{info[0].age}</TableCell>
            <TableCell align="center">{info[0].height}</TableCell>
            <TableCell align="center">{info[0].weight}</TableCell>
            <TableCell align="center">{info[0].gender}</TableCell>
            <TableCell align="center">{info[0].activity}</TableCell>
            <TableCell align="center">{info[0].goal}</TableCell>
            <TableCell align="center"><EditInfo updateInfo={updateInfo} link={info[0].id} info={info[0]}/></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  const Form = () => {
    return(
      <>
        <Title>Please fill in the missing information and press Add</Title>
        <Table size="small">
          <TableHead>
            <TableRow >
              <TableCell align="center" className={classes.tableHeader}>Age</TableCell>
              <TableCell align="center" className={classes.tableHeader}>Height (m)</TableCell>
              <TableCell align="center" className={classes.tableHeader}>Weight (kg)</TableCell>
              <TableCell align="center" className={classes.tableHeader}>Gender</TableCell>
              <TableCell align="center" className={classes.tableHeader}>Activity</TableCell>
              <TableCell align="center" className={classes.tableHeader}>Goal</TableCell>
              <TableCell align="center" className={classes.tableHeader}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">
                <TextField onChange={({ target }) => setAge(target.value)} autoFocus margin="dense" value={age} name="age" fullWidth />
              </TableCell>
              <TableCell align="center">
                <TextField onChange={({ target }) => setHeight(target.value)} margin="dense" value={height} name="height"  fullWidth />
              </TableCell>
              <TableCell align="center">
                <TextField onChange={({ target }) => setWeight(target.value)} margin="dense" value={weight} name="weight" fullWidth />
              </TableCell>
              <TableCell align="center">
                <Select
                  labelId="select-gender-label"
                  id="select-gender"
                  name="gender"
                  value={gender}
                  onChange={({ target }) => setGender(target.value)}
                >
                  <MenuItem value={'m'}>Male</MenuItem>
                  <MenuItem value={'f'}>Female</MenuItem>
                </Select>
              </TableCell>
              <TableCell align="center">
                <Select
                  labelId="select-activity-label"
                  id="select-activity"
                  name="activity"
                  value={activity}
                  onChange={({ target }) => setActivity(target.value)}
                >
                  <MenuItem value={'sedentary'}>Sedentary</MenuItem>
                  <MenuItem value={'lightly active'}>Lightly Active</MenuItem>
                  <MenuItem value={'moderately active'}>Moderately Active</MenuItem>
                  <MenuItem value={'very active'}>Very Active</MenuItem>
                  <MenuItem value={'extra active'}>Extra Active</MenuItem>
                </Select>
              </TableCell>
              <TableCell align="center">
                <Select
                  labelId="select-goal-label"
                  id="select-goal"
                  name="goal"
                  value={goal}
                  onChange={({ target }) => setGoal(target.value)}
                >
                  <MenuItem value={'lose weight'}>Lose weight</MenuItem>
                  <MenuItem value={'gain weight'}>Gain weight</MenuItem>
                  <MenuItem value={'keep weight'}>Keep weight</MenuItem>
                </Select>
              </TableCell>
              <TableCell align="center">
                <Button variant="contained" color="primary" onClick={() => saveInfo()}>
                  Add
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>
    )
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Dashboard username={props.titleName} logOut={logOut} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container direction="column" justify="center" alignItems="center">
            <Paper className={classes.paper}>
              {info.length === 0 ?
                Form() :
                MainPage()
              }
            </Paper>
          </Grid>
        </Container>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
          message={message}
        />
        <Copyright />
      </main>
    </div>
  )
}

export default PersonalInfo
