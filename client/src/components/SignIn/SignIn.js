import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, fade } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Toast } from '../Toast/Toast';
import { Loader } from '../Loader/Loader';
import { useHttp } from '../../hooks/useHttp';
import { useAuth } from '../../hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(30),
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
  loader: {
    backgroundColor: fade(theme.palette.paperColor.main, 0.7),
  }
}));

export const SignIn = () => {
  const classes = useStyles();

  // const dispatch = useDispatch();

  const { request, loading } = useHttp();
  const { login } = useAuth();

  const [loginForm, setLoginForm] = useState({ email: '', password: '', remember: false });
  const [status, setStatus] = useState({ msg: '', codeStatus: null, key: null });
  // const [status, setStatus] = useState({ msg: '', codeStatus: null, key: null });

  const changeHandler = e => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  }

  const loginHandler = async e => {
    try {
      e.preventDefault();

      const data = await request('/api/auth/login', 'POST', {...loginForm, lastSeen: new Date()});
      console.log(data);
      
      if (data.status === 400) {
        return setStatus({msg: data.message, codeStatus: data.status, key: Math.floor(Math.random() * 10000)});
      }
      
      login(data.token, data.userId, data.avatarColor, data.individualLogin, data.email, data.userLogin);

      return () => setStatus({msg: data.message, codeStatus: data.status, key: Math.floor(Math.random() * 10000)});
    } catch (err) {
      throw err;
    }
  }

  return (
    <>
    {loading && <div className={`loader_popup ${classes.loader}`}><Loader /></div>}

    <Container component="main" maxWidth="xs">
      {status.msg && 
        <Toast message={status.msg} codeStatus={status.codeStatus} key={status.key} />
      }

      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={changeHandler}
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
            onChange={changeHandler}
          />
          <FormControlLabel
            name="remember"
            control={
              <Checkbox 
                value="remember" 
                onChange={() => setLoginForm({...loginForm, remember: !loginForm.remember})} 
                color="primary" 
              />
            }
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={loginHandler}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <RouterLink to="/recover">
                <Link
                  component="button" 
                  variant="body2"
                >
                  Forgot password?
                </Link>
              </RouterLink>
            </Grid>
            <Grid item>
              <RouterLink to="/signup">
                <Link
                  component="button" 
                  variant="body2"
                >
                  Don't have account? Sign Up
                </Link>
              </RouterLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
    </>
  );
}