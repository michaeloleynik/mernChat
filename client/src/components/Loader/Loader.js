import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  
    lds: {
      '& div': {
        backgroundColor: theme.palette.primary.main,
      }
    }
  
}));

export const Loader = () => {
  const classes = useStyles();
  return (
    <div className={`lds-ellipsis ${classes.lds}`}><div /><div /><div /><div /></div>
  );
};