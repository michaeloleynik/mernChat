import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DoneIcon from '@material-ui/icons/Done';
import HomeIcon from '@material-ui/icons/Home';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

import { Link } from 'react-router-dom';

import { SwitchTheme } from '../SwitchTheme/SwitchTheme';

import { useAuth } from '../../hooks/useAuth';
import Divider from '@material-ui/core/Divider';


const userData = state => state.auth.userData;

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px'
  },
  homeDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: '10px'
  },

  formControl: {
    margin: theme.spacing(1)
  },

  avatar: {
    backgroundColor: theme.palette.avatarColor.main,
    marginTop: '20px',
    marginBottom: '5px',
    width: theme.spacing(8),
    height: theme.spacing(8),
    fontSize: '30px'
  },

  flex: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }

}));


export const Settings = () => {
  const userDataContent = useSelector(userData);
  const classes = useStyles();

  const { logout } = useAuth();

  const [loginValue, setLoginValue] = useState(userDataContent.userName);
  const [individualLoginValue, setIndividualLoginValue] = useState(userDataContent.userIndividualLogin.split('@')[1]);
  const [emailValue, setEmailValue] = useState(userDataContent.userEmail);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const ChangeButton = () => (
    <IconButton disableRipple>
      <DoneIcon />
    </IconButton>
  )

  const VisibleButton = () => (
    <IconButton disableRipple onClick={visibleHandler}>
      <VisibilityIcon />
    </IconButton>
  )

  const VisibleOffButton = () => (
    <IconButton disableRipple onClick={visibleHandler}>
      <VisibilityOffIcon />
    </IconButton>
  )
  
  const visibleHandler = () => {
    setIsVisible(!isVisible)
    console.log(isVisible);
  }

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Paper elevation={3} className={classes.paper}>
        <div className={classes.homeDiv}>
          <Typography variant="h5">Account Settings</Typography>
          <div>
            <Link to="/">
              <IconButton>
                <HomeIcon />
              </IconButton>
            </Link>

            <IconButton style={{marginLeft: '20px'}} onClick={logout}>
              <ExitToAppIcon />
            </IconButton>
          </div>
        </div>

        <Divider style={{width: '100%'}} />

        <div className={classes.flex}>
          {/* <Avatar className={classes.avatar}>{userName.slice(0, 1).toUpperCase()}</Avatar> */}
          <TextField 
            variant="outlined"
            margin="normal"
            label="New Login"
            value={loginValue}
            fullWidth
            onChange={e => setLoginValue(e.target.value)}
            InputProps={{
              startAdornment: ' ',
              endAdornment: <InputAdornment position="end"><ChangeButton onClick={() => console.log(loginValue)} /></InputAdornment>,
            }}
          />

          <TextField 
            variant="outlined"
            label="New Individual Login"
            margin="normal"
            value={individualLoginValue}
            fullWidth
            onChange={e => setIndividualLoginValue(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">@</InputAdornment>,
              endAdornment: <InputAdornment position="end"><ChangeButton onClick={() => console.log(loginValue)} /></InputAdornment>,
            }}
          />

          <TextField 
            variant="outlined"
            label="New Email"
            margin="normal"
            type="email"
            value={emailValue}
            fullWidth
            onChange={e => setEmailValue(e.target.value)}
            InputProps={{
              startAdornment: ' ',
              endAdornment: <InputAdornment position="end"><ChangeButton onClick={() => console.log(loginValue)} /></InputAdornment>,
            }}
          />

          <TextField 
            variant="outlined"
            label="New Password"
            margin="normal"
            type="password"
            value={newPasswordValue}
            fullWidth
            onChange={e => setNewPasswordValue(e.target.value)}
            InputProps={{
              startAdornment: 
                <InputAdornment position="start">
                  { isVisible ? <VisibleButton onClick={visibleHandler} /> : <VisibleOffButton onClick={visibleHandler} /> }
                </InputAdornment>,
              endAdornment: <InputAdornment position="end"><ChangeButton onClick={() => console.log(loginValue)} /></InputAdornment>,
            }}
          />
          {/* <FormControl className={classes.formControl}>
            <InputLabel variant="outlined" htmlFor="login">Login</InputLabel>
            <OutlinedInput
              id="login"
              value={loginValue}
              onChange={e => setLoginValue(e.target.value)}
              startAdornment={
                <InputAdornment position="start"> </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <ChangeButton onClick={() => console.log(loginValue)} />
                </InputAdornment>
                
              }
            />
          </FormControl> */}
          
        </div>
      </Paper>

      <SwitchTheme />
    </Container>
  )
}