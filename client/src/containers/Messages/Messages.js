import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import orderBy from "lodash/orderBy";
import { useHttp } from '../../hooks/useHttp';

import InfiniteScroll from "react-infinite-scroll-component";

import {io} from 'socket.io-client';

import AES from 'crypto-js/aes';
import enc_utf8 from 'crypto-js/enc-utf8';

import { Message } from '../../components/Message/Message';

import { makeStyles } from '@material-ui/core/styles';
import { Loader } from '../../components/Loader/Loader';

const userData = state => state.auth.userData;
const dialogData = state => state.dialog.currentDialogData;
const currentDialogIdData = state => state.dialog.currentDialogId;

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
  const {secretKey} = useSelector(dialogData);
  const currentId = useSelector(currentDialogIdData);

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const messagesRef = useRef(null);

  let typingTimeoutId = useRef(null);

  const toggleIsTyping = ({userId, currentDialogId}) => {
    if (id !== userId && dialogId === currentDialogId) {
      setIsTyping(true);
      clearInterval(typingTimeoutId);
      typingTimeoutId = setTimeout(() => {
      setIsTyping(false);
      }, 3000);
    }
  };

  const fetchMessages = useCallback(async () => {
    const data = await request(`/api/dialog/getCurrentDialogMessages?query=${dialogId}&page=${page}`);
    if (!data.length) {
      setHasMore(false);
      return;
    }
    data.forEach(d => {
      d.text = AES.decrypt(d.text, secretKey).toString(enc_utf8);
    });
    setMessages(data);
    setPage(page + 1);
  }, [dialogId, request, secretKey]);

  const onNewMessage = useCallback(newMessage => {
    if(newMessage.dialogId === currentId) {
      const decryptedMessage = {...newMessage, text: AES.decrypt(newMessage.text, secretKey).toString(enc_utf8)};
    // console.log(newMessage);
      if (!decryptedMessage.attachments) {
        decryptedMessage.attachments = [];
      }
      if (decryptedMessage.dialogId === dialogId) {
        setMessages([...messages, decryptedMessage]);
      }
    }
  }, [messages, dialogId, secretKey, currentId]);

  // const handleScroll = useCallback(
  //   () => {
  //     console.log(messagesRef.current.clientHeight);
  //     if (Math.ceil(messagesRef.current.innerHeight + messagesRef.current.scrollBottom) !== messagesRef.current.offsetHeight) return;
  //     fetchMessages();
  //   },
  //   [fetchMessages]);

  useEffect(() => {
    fetchMessages();
    // console.log(messagesRef.current.offsetHeight);
    // messagesRef.current.addEventListener('scroll', handleScroll);
  }, [fetchMessages]);

  
  useEffect(() => {
    socket.on('NEW_MESSAGE', onNewMessage);
    return () => {
      socket.removeListener('NEW_MESSAGE', onNewMessage);
    }
  }, [messages, onNewMessage]);

  useEffect(() => {
    messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight);
  }, [messages]);

  useEffect(() => {
    socket.on('DIALOGS:TYPING', toggleIsTyping);
    return () => {
      socket.removeListener('DIALOGS:TYPING', toggleIsTyping);
    }
  });
  

  // socket.on('NEW_MESSAGE', newMessage => {
  //   console.log(newMessage);
  //   setMessages([...messages, newMessage]);
  // });

  return (
    <div className={classes.root} id="scrollableDiv" ref={messagesRef}>
      {/* <InfiniteScroll
        dataLength={messages.length}
        next={fetchMessages}
        hasMore={hasMore}
        inverse={true}
        scrollableTarget="scrollableDiv"
      > */}
        { 
          loading ? <div className={classes.loader}><Loader /></div> : 
          <div>
            {orderBy(messages, ['createdAt'], ['asc']).map(message => (
              <Message key={message._id} isMe={message.user === id} text={message.text} attachments={message.attachments} />
            ))}

            {isTyping && <Message key="typing" isMe={false} text="Typing..." attachments={[]} />}
          </div>
        }
      {/* </InfiniteScroll> */}
      
    </div>
  );
};

