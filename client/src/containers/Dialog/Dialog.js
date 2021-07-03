import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHttp } from '../../hooks/useHttp';

import {io} from 'socket.io-client';

import AES from 'crypto-js/aes';

import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import { makeStyles, fade } from '@material-ui/core/styles';
import { Status } from '../../components/Status/Status';
import Divider from '@material-ui/core/Divider';
import { Messages } from '../Messages/Messages';
import { ClickAwayListener, Typography } from '@material-ui/core';
import Dropzone from 'react-dropzone';
 
const dark = state => state.theme.dark;
const dialogData = state => state.dialog.currentDialogData;
const userData = state => state.auth.userData;

const socket = io();

const useStyles = makeStyles((theme) => ({
  div: {
    padding: '15px 10px'
  },

  text: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.defaultColorReverse.main, 0.15),
    marginLeft: 0,
    width: '100%',
  },
  textInput: {
    flexGrow: 1,
    padding: theme.spacing(1, 0, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(6)}px)`,
    paddingRight: `calc(1em + ${theme.spacing(12)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    },
  },

  icon: {
    height: '100%',
    position: 'absolute',
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  emojiIcon: {
    left: '5px'
  },

  emojiPicker: {
    position: 'absolute',
    bottom: '4rem',
    '& .emoji-mart-scroll::-webkit-scrollbar': {
      width: '0.25rem'
    },

    '& .emoji-mart-scroll::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.paperColor.main
    },

    '& .emoji-mart-scroll::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.primary.main
    },

    '& .emoji-mart-anchor-selected': {
      color: `${theme.palette.primary.main} !important`,

      '& .emoji-mart-anchor-bar': {
        backgroundColor: `${theme.palette.primary.main} !important`
      }
    },
    '& .emoji-mart': {
      maxWidth: '355px',
      width: 'auto !important'
    }
  },

  sendIcon: {
    right: '5px'
  },

  attachmentIcon: {
    right: '55px'
  },

  dialogAttachment: {
    '& .MuiDialogContent': {
      overflow: 'hidden'
    }
    // overflow: 'hidden'
  }
}));
export const Dialog = ({ dialogId, addMessage }) => {
  const classes = useStyles();
  const { request } = useHttp();
  const [showEmoji, setShowEmoji] = useState(false);
  const [value, setValue] = useState('');
  const [isAttachOpen, setIsAttachOpen] = useState(false);

  const whatTheme = useSelector(dark);
  const {partnerName, isOnline, secretKey} = useSelector(dialogData);
  const {userName, id} = useSelector(userData);

  const addEmoji = ({ native }) => {
    setValue((`${value}${native}`).trim());
  }

  const addFiles = (file) => {
    const selectedFile = file[0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
      const data = await request('/api/upload/uploadFile', 'POST', {userId: id, file: reader.result});
      socket.emit('NEW_MESSAGE', { text: value, dialogId, user: id, attachments: [data.image] });
    }
  }

  const sendMessage = async () => {
    const secureValue = AES.encrypt(value, secretKey).toString();
    addMessage({ text: secureValue, dialogId, user: id });
    // console.log(secureValue);
    
    socket.emit('NEW_MESSAGE', { text: secureValue, dialogId, user: id });

    setValue('');
    
  }

  return (
    <Grid container direction="column" justify="space-between">
      <div>
        <Status dialogId={dialogId} partnerName={partnerName} userName={userName} isOnline={isOnline} />
        <Divider />
      </div>
      {
        dialogId ? 
        <>
          <Messages dialogId={dialogId} partnerName={partnerName} userName={userName} />

          <div className={classes.div}>
            <div className={classes.text}>
              <InputBase 
                className={classes.textInput}
                type="text"
                placeholder="Put your message..."
                value={value}
                onKeyUp={e => {
                  socket.emit('DIALOGS:TYPING', {currentDialogId: dialogId, userId: id});
                  if(e.code === 'Enter' && value !== '') {
                    sendMessage();
                  }
                }}
                onChange={e => setValue(e.target.value)}
              >

              </InputBase>

              <IconButton className={`${classes.icon} ${classes.emojiIcon}`} onClick={() => setShowEmoji(!showEmoji)}>
                <EmojiEmotionsIcon />
              </IconButton>

              { showEmoji && 
                <ClickAwayListener onClickAway={() => setShowEmoji(!showEmoji)}>
                  <div className={classes.emojiPicker}>
                    <Picker 
                      theme={whatTheme ? 'dark' : 'light'} 
                      showPreview={false} 
                      showSkinTones={false} 
                      onSelect={emojiTag => addEmoji(emojiTag)} 
                    />
                  </div> 
                </ClickAwayListener>
              }
              
              <IconButton className={`${classes.icon} ${classes.sendIcon}`} onClick={sendMessage}>
                <SendIcon />
              </IconButton>
              
              <IconButton className={`${classes.icon} ${classes.attachmentIcon}`} onClick={() => setIsAttachOpen(!isAttachOpen)}>
                <AttachFileIcon />
              </IconButton>
              <Dropzone onDrop={files => addFiles(files)}>
                {({getRootProps, getInputProps}) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <IconButton className={`${classes.icon} ${classes.attachmentIcon}`} onClick={() => setIsAttachOpen(!isAttachOpen)}>
                        <AttachFileIcon />
                      </IconButton>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
          </div>   
        </> :
        <Typography variant="h3">Please choose the dialog!</Typography>
      }
    </Grid>
  );
};