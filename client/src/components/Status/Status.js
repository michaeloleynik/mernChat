import React from 'react';
// import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { red, green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

// const dialogData = state => state.dialog.currentDialogData;
// const userData = state => state.auth.userData;

// const isOnline = false;

// console.log(statusColor);

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    padding: '10px'
  },

  statusSpan: {
    display: 'inline-block',
    position: 'relative',
    
    '&::before': {
      backgroundColor: props => props.backgroundColor,
      position: 'absolute',
      top: '8px',
      left: '-11px',
      content: "''",
      borderRadius: '50%',
      width: '6px',
      height: '6px',
    }
  }, 
}));

export const Status = ({dialogId, partnerName, userName, isOnline}) => {
  if (!dialogId) isOnline = true;
  const statusColor = isOnline ? green['A700'] : red['A700'];
  const props = {backgroundColor: statusColor}
  // console.log(statusColor);
  const classes = useStyles(props);
  
  return (
    <div className={classes.root}>
      <Typography variant="h6">
        {dialogId ? partnerName : userName}
      </Typography>

      <div className={classes.status}>
        <span className={classes.statusSpan}>
          {isOnline ? <Typography variant="body1">Online</Typography> : <Typography variant="body1">Offline</Typography>}
        </span>
      </div>
    </div>
  )
}