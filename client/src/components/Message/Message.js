import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, fade } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

const dialogData = state => state.dialog.currentDialogData;
const userData = state => state.auth.userData;

const useStyles = makeStyles(theme => ({
  // hyphenate: {
  //   overflowWrap: 'break-word',
  //   wordWrap: 'break-word',
  //   '-webkit-hyphens': 'auto',
  //   '-ms-hyphens': 'auto',
  //   '-moz-hyphens': 'auto',
  //   hyphens: 'auto',
  // },
  message: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    marginBottom: '20px',
    color: '#fff'
  },

  bubbleContainer: {
    maxWidth: '440px'
  },
  bubble: {
    borderRadius: '12px 12px 12px 0',
    backgroundColor: theme.palette.secondary.main,
    boxShadow: `0 5px 5px ${fade(theme.palette.defaultColorReverse.main, 0.15)}`,
    display: 'inline-block',
    padding: '10px 20px',
    wordBreak: 'break-all',
    // whiteSpace: 'normal'
  },
  avatar: {
    marginRight: '13px'
  },
  date: {
    fontSize: '12px',
    opacity: 0.5
  },

  'message--isMe': {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: '20px',
    color: '#fff',
  },

  'avatar--isMe': {
    marginLeft: '13px'
  },

  'bubble--isMe': {
    borderRadius: '12px 12px 0 12px',
    boxShadow: `0 5px 5px ${fade(theme.palette.defaultColorReverse.main, 0.15)}`,
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: theme.palette.primary.main,
    order: 2,
    wordBreak: 'break-all',
  }
}));

export const Message = ({isMe, text}) => {
  const classes = useStyles();

  const {partnerName} = useSelector(dialogData);
  const {userName} = useSelector(userData);
  return (
    <div className={isMe ? classes['message--isMe'] : classes['message']}>
      <Avatar className={isMe ? classes['avatar--isMe'] : classes['avatar']}> 
        {isMe ? userName.toUpperCase().slice(0, 1) : partnerName.toUpperCase().slice(0, 1)}
      </Avatar>

      <div className={classes['bubbleContainer']}>
        <div className={isMe ? classes['bubble--isMe'] : classes['bubble']}>
          {text}
        </div>
      </div>
    </div>
  );
};

