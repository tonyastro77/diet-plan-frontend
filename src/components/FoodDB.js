import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import foodService from '../services/foods'
import personalInfo from '../services/personalInfo'
import progressService from '../services/progress'

import Copyright from './Copyright'
import Dashboard from '../Dashboard'
import IncludeFood from './IncludeFood'
import Title from './Title'

import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'

import { useHistory } from 'react-router-dom'

const drawerWidth = 240

// eslint-disable-next-line no-undef
const _ = require('lodash')
// eslint-disable-next-line no-undef
const moment = require('moment')

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
  tableHeader: {
    fontWeight: 'bold',
  }
}))

function FoodDB(props) {
  const classes = useStyles()
  const history = useHistory()
  const [keyword, setKeyword] = useState('')
  const [foods, setFoods] = useState([])
  const [foodsFilter, setFoodsFilter] = useState([])
  const [info, setInfo] = useState([])
  const [progress, setProgressi] = useState([])
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const fetchData = () => {
    foodService
      .getFoodDB()
      .then(response => {
        setFoods(response)
        setFoodsFilter(response)
      })
    personalInfo
      .getAll()
      .then(response => {
        let newArray = onlyValuesFromToday(response)
        setInfo(info.concat(newArray))
      })
    progressService
      .getAll()
      .then(response => {
        let newArray = onlyValuesFromToday(response)
        setProgressi(progress.concat(newArray))
        console.log(newArray)
      })
  }
  useEffect(() => {
    document.title = 'MyDiet - Food Database'
    fetchData()
  }, [])

  const findText = (e) => {
    e.preventDefault()
    setKeyword(e.target.value)
    setFoodsFilter([])
    setFoodsFilter(foods)
    onlyValuesFromUser
  }
  const totalSuggestedCalories = _.map(info, function(o) {
    return Math.ceil(((o.weight * 10) + (625 * o.height) - (5 * o.age) + o.genderconstant) * o.activityconstant + o.goalconstant)
  })
  const removeDuplicate = _.uniqBy(foodsFilter, function(o){
    return o.name
  })
  const onlyValuesFromUser = _.filter(removeDuplicate, function(o){
    if(o.name.toLowerCase().includes(keyword.toLowerCase())) return o
  })
  const onlyValuesFromToday = (arr) => _.filter(arr, function(o){
    if(moment(o.date).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD')) return o
  })
  const ValuesFromThisUser = _.filter(foods, function(o){
    if(o.user.username === props.userName) return o
  })
  const totalAddedCalories =  _.sumBy(onlyValuesFromToday(ValuesFromThisUser), function(o) {
    return o.calories*o.quantity
  })
  const findByIdToday = _.find(progress, function(o) { return moment(o.date).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD')  })

  const setProgress = (food) => {
    var data = {
      suggestedCalories: totalSuggestedCalories[0],
      totalCalories: totalAddedCalories + (food.quantity * food.calories)
    }
    if(findByIdToday){
      progressService
        .update(findByIdToday.id , data)
    }
    else{
      progressService
        .create(data)
    }
  }
  const saveFood = (food) => {
    foodService
      .create(food)
      .then(returned => {
        setFoods(foods.concat(returned))
        setMessage('Food added to this current day food intake. Check the update at Home')
        setOpen(true)
      })
      .catch(error => console.log(error))
    setProgress(food)
  }
  const logOut = () => {
    history.push('/')
    window.localStorage.clear()
    window.location.reload()
  }
  function handleClose(){
    setOpen(false)
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Dashboard username={props.titleName} logOut={logOut}/>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Title>Food Stored</Title>
                <Table size="small">
                  <TableHead>
                    <TableRow >
                      <TableCell align="left" className={classes.tableHeader}>Food Name</TableCell>
                      <TableCell align="center" className={classes.tableHeader}>Calories (Kcal)</TableCell>
                      <TableCell align="center" className={classes.tableHeader}>Fat (g)</TableCell>
                      <TableCell align="center" className={classes.tableHeader}>Carbohydrates (g)</TableCell>
                      <TableCell align="center" className={classes.tableHeader}>Protein (g)</TableCell>
                      <TableCell align="center" className={classes.tableHeader}>Quantity (units/servings)</TableCell>
                      <TableCell align="center" className={classes.tableHeader}><TextField placeholder="Search" value={keyword} onChange={findText}/></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {onlyValuesFromUser.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="center">{row.calories}</TableCell>
                        <TableCell align="center">{row.fat}</TableCell>
                        <TableCell align="center">{row.carbohydrates}</TableCell>
                        <TableCell align="center">{row.protein}</TableCell>
                        <TableCell align="center">{row.quantity}</TableCell>
                        <Tooltip title="Add" placement="top"><TableCell align="center"><IncludeFood saveFood={saveFood} link={row.id} food={row}/></TableCell></Tooltip>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <Copyright />
      </main>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={open}
        autoHideDuration={7000}
        onClose={handleClose}
        message={message}
      />
    </div>
  )
}

export default FoodDB