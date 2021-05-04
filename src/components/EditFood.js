import React, { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Tooltip from '@material-ui/core/Tooltip'

function EditFood(props) {
  const [info, setInfo] = useState({ open: false,
    name: '', calories: '', fat: '', carbohydrates: '', protein: '',
    quantity: '' })

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

  const updateFood = () => {
    const newFood = {
      name: info.name ,
      calories: Number(info.calories) ,
      fat: Number(info.fat) ,
      carbohydrates: Number(info.carbohydrates) ,
      protein: Number(info.protein) ,
      quantity: Number(info.quantity) ,
    }
    props.updateFood(props.link, newFood)
    handleClose()
  }
  return (
    <div>
      <Dialog
        open={info.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Food Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit the details of the food and press Save when you are done. Press Cancel otherwise.
          </DialogContentText>
          <TextField onChange={inputChanged} autoFocus margin="dense" value={info.name} name="name" label="Name" fullWidth />
          <TextField onChange={inputChanged} margin="dense" value={info.calories} name="calories" label="Calories" fullWidth />
          <TextField onChange={inputChanged} margin="dense" value={info.fat} name="fat" label="Fat ammount" fullWidth />
          <TextField onChange={inputChanged} margin="dense" value={info.carbohydrates} name="carbohydrates" label="Carbohydrate ammount" fullWidth />
          <TextField onChange={inputChanged} margin="dense" value={info.protein} name="protein" label="Protein ammount" fullWidth />
          <TextField onChange={inputChanged} margin="dense" value={info.quantity} name="quantity" label="Quantity" fullWidth />
        </DialogContent>
        <DialogActions>
          <Tooltip title="Save" placement="top">
            <IconButton aria-label="save" color="primary" onClick={updateFood}>
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
      <IconButton aria-label="edit" color="primary" onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>
    </div>
  )
}

export default EditFood
