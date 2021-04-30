import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { format, isToday, parseISO } from 'date-fns';
import orderBy from "lodash/orderBy";

import {io} from 'socket.io-client';

import { makeStyles, fade } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';

import sadDarkSvg from '../../assets/images/sadDark.svg';
import sadLightSvg from '../../assets/images/sadLight.svg';
import { Loader } from '../Loader/Loader';

const socket = io();


const useStyles = makeStyles((theme) => ({
  mainDiv: {
    height: 'calc(100vh - 215px)',
    [theme.breakpoints.down('md')]: {
      height: 'calc(100% - 145px)'
    }
  },

  div: {
    width: '285px',
    
    padding: '10px'
  },
  root: {
    width: '100%',
    maxWidth: '36ch',
    height: 'calc(100% - 70px)',
    [theme.breakpoints.down('md')]: {
      height: '100%',
      paddingBottom: 0
    },
    overflowY: 'auto',
    paddingTop: 0,
    

    '&::-webkit-scrollbar': {
      width: '0.25rem'
    },

    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.paperColor.main
    },

    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.secondary.main
    }
  },

  inline: {
    display: 'inline',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.defaultColorReverse.main, 0.15),
    marginLeft: 0,
    width: '100%',
  },
  searchInput: {
    flexGrow: 1,
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  seacrhIcon: {
    height: '100%',
    position: 'absolute',
    top: 0,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: '0 12px'
    }
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 300px)'
  },
  listItem: {
    backgroundColor: theme.palette.paperColor.main,
    '&:hover': {
      backgroundColor: fade(theme.palette.defaultColor.main, 0.4)
    }
  },

  'listItem--selected': {
    backgroundColor: fade(theme.palette.defaultColor.main, 0.4)
  }
}));

export const UserList = ({dialogs, whatTheme, loading, myId, selectedDialogId}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [filtredDialogs, setFiltredDialogs] = useState([]);
  // console.log(selectedDialogId);

  const onChangeInput = e => {
    setFiltredDialogs(
      dialogs.filter(
        dialog => dialog.partner.login.toLowerCase().indexOf(e.target.value.toLowerCase()) >= 0
      )    
    );
    setInputValue(e.target.value);
  };

  const isMe = userId => {
    return myId === userId;
  }

  const setCurrentDialog = (id, partnerName, avatarColor, lastSeen) => {
    dispatch({type: 'dialog/currentDialogId', payload: id});
    dispatch({type: 'dialog/currentDialogData', payload: {partnerName, avatarColor, lastSeen}});
  }

  const getMessageTime = createdAt => {
    if (isToday(createdAt)) {
      return format(createdAt, 'HH:mm');
    } else {
      return format(createdAt, 'dd.MM.yyyy');
    }
  };

  useEffect(() => {
    setFiltredDialogs([...dialogs]);
  }, [dialogs]);
  // const selectedDialogId = '606de52bab0b9f26980bb93e';
  return (
    <div className={classes.mainDiv}>
      <div className={classes.div}>
        <div className={classes.search}>
          <InputBase 
            className={classes.searchInput}
            type="search"
            placeholder="Search Diologs..."
            value={inputValue}
            onChange={onChangeInput}
          />
          
          <div className={classes.seacrhIcon}>
            <SearchIcon />
          </div>
        </div>
      </div>

      <Divider />

      {loading ? <div className={classes.loader}><Loader /></div> : 
  
      filtredDialogs.length ? 
        <List className={classes.root}>
          {orderBy(filtredDialogs, ['updatedAt'], ['desc']).map(dialog => (
            <React.Fragment key={dialog.id}>
              <Link onClick={() => {
                  socket.emit('DIALOGS:JOIN', {dialogId: dialog.id});
                  setCurrentDialog(dialog.id, dialog.partner.login, dialog.partner.avatarColor, dialog.lastSeen)
                }} 
                to={`/dialogs/${dialog.id}`}>
                <ListItem className={dialog.id === selectedDialogId ? classes['listItem--selected'] : classes.listItem} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar style={{backgroundColor: `${dialog.partner.avatarColor}`}}>
                      {dialog.partner.login.toUpperCase().slice(0, 1)}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      (
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                          <Typography component="span" color="textPrimary">{dialog.partner.login}</Typography>

                          <Typography
                            component="span" 
                            color="textPrimary" 
                            variant="body2"
                            style={{margin: '3px 0'}}
                          >
                            {getMessageTime(parseISO(dialog.lastMessage.createdAt))}
                          </Typography>
                        </div>
                      )
                    }
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {
                          isMe(dialog.lastMessage.user) && dialog.lastMessage.text.length > 16 && `You: ${dialog.lastMessage.text.split('').slice(0, 16).join('')}...`
                        }

                        {
                          isMe(dialog.lastMessage.user) && dialog.lastMessage.text.length <= 16 && `You: ${dialog.lastMessage.text}`
                        }

                        {
                          !isMe(dialog.lastMessage.user) && dialog.lastMessage.text.length > 19 && `${dialog.lastMessage.text.split('').slice(0, 19).join('')}...` 
                        }

                        {
                          !isMe(dialog.lastMessage.user) && dialog.lastMessage.text.length <= 19 && dialog.lastMessage.text
                        }
                      </Typography> 
                    }
                  />
                </ListItem>
              </Link>
              
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List> 

        : 

        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: 'calc(100vh - 285px)'}}>
          <Typography variant="h6">Nothing hasn't found!</Typography>

          {whatTheme ? <img src={sadDarkSvg} alt="sad face" /> : <img src={sadLightSvg} alt="sad face" />}
        </div>
      }
    </div>
  );
};
