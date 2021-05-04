import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import foodService from '../services/foods'
import personalInfo from '../services/personalInfo'
import progressService from '../services/progress'

import AddFood from './AddFood'
import EditFood from './EditFood'
import Title from './Title'

import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Snackbar from '@material-ui/core/Snackbar'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'

// eslint-disable-next-line no-undef
const _ = require('lodash')
// eslint-disable-next-line no-undef
const moment = require('moment')

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  tableHeader: {
    fontWeight: 'bold',
  }
}))

export default function FoodList(props) {
  const classes = useStyles()
  const [foods, setFoods] = useState([])
  const [info, setInfo] = useState([])
  const [progress, setProgressi] = useState([])
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(false)

  const fetchData = () => {
    foodService
      .getAll()
      .then(response => {
        setFoods(response)
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
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onlyValuesFromToday = (arr) => _.filter(arr, function(o){
    if(moment(o.date).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD')) return o
  })

  const totalSuggestedCalories = _.map(info, function(o) {
    return Math.ceil(((o.weight * 10) + (625 * o.height) - (5 * o.age) + o.genderconstant) * o.activityconstant + o.goalconstant)
  })
  const totalAddedCalories =  _.sumBy(onlyValuesFromToday(foods), function(o) {
    return o.calories*o.quantity
  })
  const findByIdToday = _.find(progress, function(o) { return moment(o.date).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD')  })

  const findFoodById = (x) => _.find(onlyValuesFromToday(foods), function(o) { return o.id === x })

  props.total(totalAddedCalories)

  const saveFood = (food) => {
    foodService
      .create(food)
      .then(returned => {
        setFoods(foods.concat(returned))
        setMessage('Food saved successfully')
        setOpen(true)
        console.log(open)
        console.log(message)
      })
      .catch(error => console.log(error))
    setProgress(food, 'plus')
    window.location.reload()
  }
  const setProgress = (food, symbol, id) => {
    var data = {}
    if(symbol === 'plus'){
      data = {
        suggestedCalories: totalSuggestedCalories[0],
        totalCalories: totalAddedCalories + (food.quantity * food.calories)
      }
    }
    else if(symbol === 'edit'){
      data = {
        suggestedCalories: totalSuggestedCalories[0],
        totalCalories: totalAddedCalories - (findFoodById(id).quantity * findFoodById(id).calories) + (food.quantity * food.calories)
      }
    }
    else{
      data = {
        suggestedCalories: totalSuggestedCalories[0],
        totalCalories: totalAddedCalories - (food.quantity * food.calories)
      }
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

  const updateFood = (id, updatedFood) => {
    foodService
      .update(id, updatedFood)
      .then(x => {
        setFoods(foods.map(food => food.id !== id ? food : x))
        setMessage('Changes saved successfully')
        setOpen(true)
      })
      .catch(error => console.log(error))
    setProgress(updatedFood, 'edit', id)
    window.location.reload()
  }

  const deleteFood = (id, deletedFood) => {
    if (window.confirm('Are you sure you want to delete this food?')){
      const newFoodList = foods.filter(n => n.id !== id)
      console.log(newFoodList)

      foodService
        .deleteItem(id, deletedFood)
        .then(() => {
          setFoods(newFoodList)
          setMessage('Food deleted')
          setOpen(true)
        })
        .catch(error => console.log(error))
      setProgress(deletedFood, 'minus')
      window.location.reload()
    }
  }

  function handleClose(){
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Title>Today&apos;s diet</Title>
      <Table size="small">
        <TableHead>
          <TableRow >
            <TableCell align="left" className={classes.tableHeader}>Food Name</TableCell>
            <TableCell align="center" className={classes.tableHeader}>Calories (Kcal)</TableCell>
            <TableCell align="center" className={classes.tableHeader}>Fat (g)</TableCell>
            <TableCell align="center" className={classes.tableHeader}>Carbohydrates (g)</TableCell>
            <TableCell align="center" className={classes.tableHeader}>Protein (g)</TableCell>
            <TableCell align="center" className={classes.tableHeader}>Quantity (units/servings)</TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {onlyValuesFromToday(foods).map((row) => (
            <TableRow key={row.id}>
              <TableCell align="left">{row.name}</TableCell>
              <TableCell align="center">{row.calories}</TableCell>
              <TableCell align="center">{row.fat}</TableCell>
              <TableCell align="center">{row.carbohydrates}</TableCell>
              <TableCell align="center">{row.protein}</TableCell>
              <TableCell align="center">{row.quantity}</TableCell>
              <Tooltip title="Edit"><TableCell align="center"><EditFood updateFood={updateFood} link={row.id} food={row} /></TableCell></Tooltip>
              <Tooltip title="Delete"><TableCell align="center"><IconButton aria-label="delete" color="secondary" onClick={() => deleteFood(row.id, row)}><DeleteIcon /></IconButton></TableCell></Tooltip>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <AddFood saveFood={saveFood}/>
      </div>
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
    </React.Fragment>
  )
}
