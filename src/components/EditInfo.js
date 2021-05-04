import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
    minWidth: '10vh',
  }
}))

function EditInfo(props) {
  const classes = useStyles()
  const [info, setInfo] = useState({ open: false,
    age: '', height: '', weight: '', gender: 'm', activity: 'sedentary', goal: 'lose weight' })

  const handleClickOpen = () => {
    setInfo({
      open: true,
      age: props.info.age,
      height: props.info.height,
      weight: props.info.weight,
      gender: props.info.gender,
      activity: props.info.activity,
      goal: props.info.goal,
    })
  }

  const handleClose = () => {
    setInfo({ open: false })
  }

  const inputChanged = (e) => {
    const { name, value } = e.target
    setInfo({ ...info, [name]: value })
  }
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
  const updateInfo = () => {
    const newInfo = {
      age: Number(info.age) ,
      height: Number(info.height) ,
      weight: Number(info.weight) ,
      gender: info.gender,
      activity: info.activity,
      goal: info.goal,
      genderconstant: genVal[info.gender],
      activityconstant: actVal[info.activity],
      goalconstant: goalVal[info.goal]
    }
    props.updateInfo(props.link, newInfo)
    handleClose()
  }
  return (
    <div>
      <Dialog
        open={info.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Personal Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit the personal details and press Save when you are done. Press Cancel otherwise.
          </DialogContentText>
          <TextField onChange={inputChanged} autoFocus margin="dense" value={info.age} name="age" label="Age" fullWidth />
          <TextField onChange={inputChanged} margin="dense" value={info.height} name="height" label="Height" fullWidth />
          <TextField onChange={inputChanged} margin="dense" value={info.weight} name="weight" label="Weight" fullWidth />
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-helper-label">Gender</InputLabel>
            <Select
              labelId="select-gender-label"
              id="select-gender"
              name="gender"
              value={info.gender}
              onChange={inputChanged}
            >
              <MenuItem value={'m'}>Male</MenuItem>
              <MenuItem value={'f'}>Female</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-helper-label">Activity</InputLabel>
            <Select
              labelId="select-activity-label"
              id="select-activity"
              name="activity"
              value={info.activity}
              onChange={inputChanged}
            >
              <MenuItem value={'sedentary'}>Sedentary</MenuItem>
              <MenuItem value={'lightly active'}>Lightly Active</MenuItem>
              <MenuItem value={'moderately active'}>Moderately Active</MenuItem>
              <MenuItem value={'very active'}>Very Active</MenuItem>
              <MenuItem value={'extra active'}>Extra Active</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-helper-label">Goal</InputLabel>
            <Select
              labelId="select-goal-label"
              id="select-goal"
              name="goal"
              value={info.goal}
              onChange={inputChanged}
            >
              <MenuItem value={'lose weight'}>Lose weight</MenuItem>
              <MenuItem value={'gain weight'}>Gain weight</MenuItem>
              <MenuItem value={'keep weight'}>Keep weight</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Tooltip title="Save" placement="top">
            <IconButton aria-label="save" color="primary" onClick={updateInfo}>
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

export default EditInfo
