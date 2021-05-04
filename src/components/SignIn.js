import React, { useState, useEffect } from 'react'
import loginService from '../services/login'
import personalInfo from '../services/personalInfo'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import foodService from '../services/foods'
import Notification from './Notification'
import Copyright from './Copyright'
import SignUp from './SignUp'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function SignIn(props) {
  const classes = useStyles()
  const [page, setPage] = useState('SignIn')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()
    if(username.length > 5 && username){
      console.log('logging in with', username, password)

      try {
        const user = await loginService.login({
          username, password,
        })
        window.localStorage.setItem(
          'loggedNoteappUser', JSON.stringify(user)
        )
        foodService.setToken(user.token)
        personalInfo.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
        window.location.reload()
      } catch (exception) {
        setUser(null)
        setMessage('wrong credentials!')
        setTimeout(() => {
          setMessage('')
        }, 5000)
      }
      props.handleLogin(user)
    }
    else{
      setMessage('The user name you entered isn’t connected to an account.')
    }
  }

  useEffect(() => {
    document.title = 'Log into MyDiet'
  }, [])

  const toPage = (page) => (event) => {
    event.preventDefault()
    setPage(page)
  }

  if (page === 'SignIn'){
    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Sign in
            </Typography>
            <Notification message={message} />
            <form className={classes.form} noValidate onSubmit={handleLogin}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="User name"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
              Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Button onClick={() => alert('email sent')}>
                  Forgot Password?
                  </Button>
                </Grid>
                <Grid item>
                  <Button onClick={toPage('SignUp')}>
                  Don&apos;t you have an account? Sign Up
                  </Button>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
    )
  }
  else if(page === 'SignUp'){
    return(<SignUp />)
  }
}