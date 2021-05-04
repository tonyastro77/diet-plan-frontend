import React , { useState } from 'react'
import AddIcon from '@material-ui/icons/Add'
import IconButton from '@material-ui/core/IconButton'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Tooltip from '@material-ui/core/Tooltip'
import Fab from '@material-ui/core/Fab'
import Notification from './Notification'

function IncludeFood(props) {

  const [info, setInfo] = useState({ open: false,
    name: '', calories: '', fat: '', carbohydrates: '', protein: '',
    quantity: '' })
  const [message, setMessage] = useState('')

  const handleClickOpen = () => {
    setInfo({
      open: true,
      name: props.food.name,
      calories: props.food.calories,
      fat: props.food.fat,
      carbohydrates: props.food.carbohydrates,
      protein: props.food.protein,
      quantity: props.food.quantity,
    })
  }

  const handleClose = () => {
    setInfo({ open: false })
  }

  const inputChanged = (e) => {
    const { name, value } = e.target
    setInfo({ ...info, [name]: value })
  }

  const addCustomer = () => {
    if(info.name === undefined || isNaN(info.calories) || isNaN(info.fat) || isNaN(info.carbohydrates) || isNaN(info.protein) || isNaN(info.quantity)){
      setMessage('invalid input')
      setTimeout(() => {
        setMessage('')
      }, 3000)
    }
    else{
      const newFood = {
        name: info.name ,
        calories: Number(info.calories) ,
        fat: Number(info.fat) ,
        carbohydrates: Number(info.carbohydrates) ,
        protein: Number(info.protein) ,
        quantity: Number(info.quantity) ,
      }
      setMessage('')
      props.saveFood(newFood)
      handleClose()
    }
  }

  return (
    <div>
      <Dialog
        open={info.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" >Add this information to your current day food intake</DialogTitle>
        <DialogContent required={true}>
          <DialogContentText>
            Add the details of the food and press Save when you are done. Press Cancel otherwise.
          </DialogContentText>
          <TextField onChange={inputChanged} autoFocus margin="dense" value={info.name} name="name" label="Name" fullWidth />
          <TextField onChange={inputChanged} margin="dense" value={info.calories} name="calories" label="Calories" fullWidth />
          <TextField onChange={inputChanged} margin="dense" value={info.fat} name="fat" label="Fat ammount" fullWidth />
          <TextField onChange={inputChanged} margin="dense" value={info.carbohydrates} name="carbohydrates" label="Carbohydrate ammount" fullWidth />
          <TextField onChange={inputChanged} margin="dense" value={info.protein} name="protein" label="Protein ammount" fullWidth />
          <TextField onChange={inputChanged} margin="dense" value={info.quantity} name="quantity" label="Quantity" fullWidth />
        </DialogContent>
        <Notification message={message} />
        <DialogActions>
          <Tooltip title="Save" placement="top">
            <IconButton aria-label="save" color="primary" onClick={addCustomer}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel" placement="top">
            <IconButton aria-label="cancel" color="secondary" onClick={handleClose}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </DialogActions>
      </Dialog>
      <Fab color="primary" size="small" onClick={handleClickOpen}><AddIcon /></Fab>
    </div>
  )
}

export default IncludeFood