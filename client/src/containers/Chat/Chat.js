import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';

import { SideBar } from '../SideBar/SideBar';
import { Dialog } from '../Dialog/Dialog';
import { Paper } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import { Footer } from '../../components/Footer/Footer';

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.paperColor.main,
    minHeight: '100vh'
  },
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: 'calc(100vh - 70px)',
  }
}));

export const Chat = ({dialogId}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const addMessage = useCallback(message => {
    dispatch({type: 'message/addMessage', payload: message });
  }, [dispatch]);



  return (
    <Paper elevation={2} className={classes.paper}>
      <Grid className={classes.root}>
        <SideBar dialogId={dialogId} />

        <Dialog dialogId={dialogId} addMessage={addMessage} />
      </Grid>

      <Divider />

      <Footer />
    </Paper>
  )
}