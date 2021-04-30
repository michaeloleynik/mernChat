import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Toast } from '../Toast/Toast';

import { useHttp } from '../../hooks/useHttp';

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const SignUp = () => {
  const classes = useStyles();

  // const dispatch = useDispatch();

  const { request } = useHttp();

  const [form, setForm] = useState({login: '', individualLogin: '', email: '', password: ''});
  const [status, setStatus] = useState('');
  const colors = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722'
  ];

  const changeHandler = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const registerHandler = async e => {
    try {
      e.preventDefault();

      const randomColor = colors[Math.floor(Math.random() * 15)];

      const data = await request('/api/auth/registration', 'POST', {...form, avatarColor: randomColor});
      
      setStatus({msg: data.message, codeStatus: data.status, key: Math.floor(Math.random() * 10000)});
    } catch (err) {
      throw err;
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      {status && 
        <Toast message={status.msg} codeStatus={status.codeStatus} key={status.key} />
      }

      <CssBaseline />
      
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>

        <form className={classes.form} noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="login"
                name="login"
                variant="outlined"
                required
                fullWidth
                id="Login"
                label="Login"
                onChange={changeHandler}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                autoComplete="individualLogin"
                name="individualLogin"
                variant="outlined"
                required
                fullWidth
                id="IndividualLogin"
                label="Individual Login"
                onChange={changeHandler}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={changeHandler}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={changeHandler}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={registerHandler}
          >
            Sign Up
          </Button>

          <Grid container justify="flex-end">
            <Grid item>
              <RouterLink to="/signin">
                <Link
                  component="button" 
                  variant="body2"
                >
                  Already have an account? Sign in
                </Link>
              </RouterLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}