import React, { useState, useEffect, useCallback } from 'react';
import { useHttp } from '../../hooks/useHttp';
import { Link } from 'react-router-dom';

import {io} from 'socket.io-client';

import AES from 'crypto-js/aes';
import enc_utf8 from 'crypto-js/enc-utf8';

import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import CreateIcon from '@material-ui/icons/Create';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import { UserList } from '../../components/UserList/UserList';
import { Avatar } from '@material-ui/core';
import { CreateDialog } from '../../components/CreateDiolog/CreateDialog';

const dark = state => state.theme.dark;
const userData = state => state.auth.userData;

const socket = io();

const useStyles = makeStyles((theme) => ({
    root: {
      borderRight: `1px solid ${theme.palette.divider}`,
      '& svg': {
        margin: theme.spacing(1.5)
      },
      width: 'fit-content',
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
      },
    },
    header: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        paddingTop: '10px'
      }
    },
    avatarContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px'
    },
    avatar: {
      backgroundColor: theme.palette.avatarColor.main
    },
    // menuIcon: {
    //   [theme.breakpoints.up('md')]: {
    //     display: 'none'
    //   },
    // }
  }));

export const SideBar = ({dialogId}) => {
  const whatTheme = useSelector(dark);
  const userDataContent = useSelector(userData);
  const dispatch = useDispatch();
  const {request, loading} = useHttp();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dialogs, setDialogs] = useState([]);
  // const [onlineUsers, setOnlineUsers] = useState([]);

  const fetchItems = useCallback(async () => {
    try {
      const data = await request('/api/dialog/getAllDialogs', 'GET', null, {Autharization: `Bearer ${userDataContent.jwtToken}`});
      data.forEach(d => {
        d.lastMessage.text = AES.decrypt(d.lastMessage.text, d.secretKey).toString(enc_utf8);
      });

      setDialogs(data);
    } catch (e) {}
  }, [request, userDataContent.jwtToken]);

  useEffect(() => {
    fetchItems();
    socket.on('SERVER:DIALOG_CREATED', fetchItems);
    // socket.on('NEW_MESSAGE', lastMessage => {
    //   dialogs.forEach(d => {
    //     console.log(d[id]);
    //   })
    // });
    return () => {
      socket.removeListener('SERVER:DIALOG_CREATED', fetchItems);
      // socket.removeListener('NEW_MESSAGE');
    };
  }, [fetchItems]);

  // useEffect(() => {
  //   socket.on('SET_ONLINE', users => {
  //     console.log(users);
  //     setOnlineUsers([...onlineUsers, users[0]]);
  //   });
  //   return () => {
  //     socket.removeListener('SET_ONLINE');
  //     // socket.removeListener('NEW_MESSAGE');
  //   };
  // }, [onlineUsers]);

  useEffect(() => {
    socket.on('NEW_MESSAGE', lastMsg => {
      // console.log(lastMsg);
      
      // console.log(lastMessage.dialogId === dialogs[0].id);
      const currentDialogIdx = dialogs.findIndex(d => d.id === lastMsg.dialogId);
      if(currentDialogIdx !== -1) {
        let newDialogsArr = [...dialogs];
        newDialogsArr[currentDialogIdx] = {
          ...dialogs[currentDialogIdx],
          lastMessage: {...lastMsg, text: AES.decrypt(lastMsg.text, dialogs[currentDialogIdx].secretKey).toString(enc_utf8)},
          updatedAt: lastMsg.createdAt
        };
        // console.log(currentDialogIdx);

        setDialogs([...newDialogsArr]);
      }
      
    // dialogs.forEach(d => {
    //   if(d.id === lastMessage.dialogId) {
    //     console.log(111);
    //     if (userDataContent.id !== lastMessage.user) {
    //       d.partner.isOnline = true;
    //     }
    //     d.lastMessage.text = lastMessage.text;
    //     d.lastMessage.user = lastMessage.user;
    //     d.lastMessage.createdAt = lastMessage.createdAt;
    //   }
    // });
    // console.log(dialogs);
    // setDialogs([...dialogs]);
  });
    return () => {
      socket.removeListener('NEW_MESSAGE');
    }
  }, [dialogs]);

  const handleThemeChange = () => {
    dispatch({type: 'theme/switch-theme'});
  };

  const openHandler = () => {
    setOpen(true);
    // console.log(open);
  }

  const closeHandler = () => {
    setOpen(false);
  }

  const closeMobileHandler = () => {
    setMobileOpen(false);
  }

  const icons = (
    <>
      {whatTheme ?
        <IconButton onClick={handleThemeChange}>
          <Brightness7Icon />
        </IconButton> :  

        <IconButton onClick={handleThemeChange}>
          <Brightness4Icon />
        </IconButton>
      }

      <IconButton onClick={() => openHandler(true)}>
        <CreateIcon />
      </IconButton> 
    </>
  )

  return(
    <>
    <div className={classes.root}>
      <Hidden mdUp>
        <IconButton size="small" className={classes.menuIcon} onClick={() => setMobileOpen(true)}>
          <MenuIcon />
        </IconButton>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={closeMobileHandler}
        >
          <div className={classes.header}>
            <IconButton onClick={closeMobileHandler}>
              <CloseIcon />
            </IconButton>

            <Typography variant="h6">Diologs</Typography>

            <div>
              {icons}
            </div>
          </div>

          <CreateDialog fetchItems={fetchItems} open={open} closeHandler={closeHandler} myId={userDataContent.id} />

          <UserList loading={loading} dialogs={dialogs} whatTheme={whatTheme} myId={userDataContent.id} selectedDialogId={dialogId}/>

        </Drawer>
        <Link to="/settings">
          <Avatar className={classes.avatar}>
            {userDataContent.userName && userDataContent.userName.slice(0, 1).toUpperCase()}
          </Avatar>
        </Link>
      </Hidden>

      <Hidden smDown>
        <div className={classes.header}>

          <Typography variant="h6">Diologs</Typography>

          <div>
            {icons}
          </div>
        </div>

        <CreateDialog fetchItems={fetchItems} open={open} closeHandler={closeHandler} myId={userDataContent.id} />

        <UserList loading={loading} dialogs={dialogs} whatTheme={whatTheme} myId={userDataContent.id} selectedDialogId={dialogId}/>

        <Divider />

        <div className={classes.avatarContainer}>
          <Link to="/settings">
            <Avatar className={classes.avatar}>
              {userDataContent.userName.slice(0, 1).toUpperCase()}
            </Avatar>
          </Link>
          <Typography variant="body1">
            {userDataContent.userIndividualLogin}
          </Typography>
        </div>
      </Hidden>
      </div>
    </>
  );
};