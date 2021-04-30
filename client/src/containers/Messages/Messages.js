import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import orderBy from "lodash/orderBy";
import { useHttp } from '../../hooks/useHttp';

import {io} from 'socket.io-client';

import { Message } from '../../components/Message/Message';

import { makeStyles } from '@material-ui/core/styles';
import { Loader } from '../../components/Loader/Loader';

const userData = state => state.auth.userData;

const socket = io();

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column-reverse',
    padding: '8px 10px', 
    height: 'calc(100vh - 225px)', 
    overflowY: 'auto',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    },

    '&::-webkit-scrollbar': {
      width: '0.25rem'
    }

    // '&::-webkit-scrollbar-track': {
    //   backgroundColor: theme.palette.paperColor.main
    // },

    // '&::-webkit-scrollbar-thumb': {
    //   backgroundColor: theme.palette.secondary.main
    // }
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '660px'
  },
}));

export const Messages = ({dialogId}) => {
  const classes = useStyles();
  const { request, loading } = useHttp();

  const {id} = useSelector(userData);

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesRef = useRef(null);

  let typingTimeoutId = useRef(null);

  const toggleIsTyping = ({userId}) => {
    if (id !== userId) {
      setIsTyping(true);
      clearInterval(typingTimeoutId);
      typingTimeoutId = setTimeout(() => {
      setIsTyping(false);
      }, 3000);
    }
  };

  const fetchMessages = useCallback(async () => {
    const data = await request(`/api/dialog/getCurrentDialogMessages?query=${dialogId}`);
    setMessages(data);
  }, [dialogId, request]);

  const onNewMessage = useCallback(newMessage => {
    if (newMessage.dialogId === dialogId) {
      setMessages([...messages, newMessage]);
    }
  }, [messages, dialogId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);
  
  useEffect(() => {
    socket.on('NEW_MESSAGE', onNewMessage);
    return () => {
      socket.removeListener('NEW_MESSAGE', onNewMessage);
    }
  }, [messages, onNewMessage]);

  useEffect(() => {
    messagesRef.current.scrollTo(0, 999999);
  }, [messages]);

  useEffect(() => {
    socket.on('DIALOGS:TYPING', toggleIsTyping)
  });
  

  // socket.on('NEW_MESSAGE', newMessage => {
  //   console.log(newMessage);
  //   setMessages([...messages, newMessage]);
  // });

  return (
    <div className={classes.root} ref={messagesRef}>
      { 
        loading ? <div className={classes.loader}><Loader /></div> : 
        <div>
          {orderBy(messages, ['created-at'], ['asc']).map(message => (
            <Message key={message._id} isMe={message.user === id} text={message.text} />
          ))}

          {isTyping && <Message key="typing" isMe={false} text="Typing..." />}
        </div>
      }
      
    </div>
  );
};

