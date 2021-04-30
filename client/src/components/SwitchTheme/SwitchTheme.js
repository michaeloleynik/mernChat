import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';

const dark = state => state.theme.dark;

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: '40px',
    right: '40px',
    borderRadius: '50%',
    padding: '3px',
    backgroundColor: theme.palette.primary.main
  },
  iconColor: {
    color: '#fff'
  },
}));

export const SwitchTheme = () => {
  const whatTheme = useSelector(dark);
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleThemeChange = () => {
    dispatch({type: 'theme/switch-theme'});
  };

  return (
    <div className={classes.root}>
      {whatTheme ?
        <IconButton className={classes.iconColor} onClick={handleThemeChange}>
        <Brightness7Icon />
        </IconButton> : 

        <IconButton className={classes.iconColor} onClick={handleThemeChange}>
          <Brightness4Icon />
        </IconButton>
      }
    </div>
  );
};

