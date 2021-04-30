import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import SnackBar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  cross: {
    color: theme.palette.defaultColor.main
  }
}));

export const Toast = ({ message, codeStatus = null }) => {
  const classes = useStyles();
  
  const history = useHistory();

  const [open, setOpen] = useState(true);
  const closeHandler = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }

    if (codeStatus === 201 && message === 'The user has been created successfully!') {
      history.push("/signIn");
    }
    
    setOpen(false);
  }
  return (
    <div>
      <SnackBar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={open}
        autoHideDuration={2000}
        onClose={closeHandler}
        variant="warning"
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={message}
        action={[
          <IconButton 
            key="close" 
            onClick={closeHandler}
            className={classes.cross}
          >
            <CloseIcon />
          </IconButton>
        ]}
        style={{zIndex: 9999}}
      />
    </div>
  );
}