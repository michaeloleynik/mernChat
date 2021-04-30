import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';


const storageName = 'userData';

const socket = io();

export const useAuth = () => {  
  const dispatch = useDispatch();

  const login = useCallback((jwtToken, id, color, userIndividualLogin, userEmail, userName) => {
    dispatch({type: 'auth/userData', payload: {
      jwtToken,
      id,
      color,
      userIndividualLogin,
      userEmail,
      userName
    }});
    // socket.emit('SET_ONLINE', {userId: id});
    dispatch({type: 'auth/isAuth', payload: true});
    
    // dispatch({type: 'auth/token', payload: jwtToken});
    // dispatch({type: 'auth/avatarColor', payload: color});
    // dispatch({type: 'auth/userName', payload: userName});

    localStorage.setItem(storageName, JSON.stringify({userId: id, token: jwtToken, avatarColor: color, individualLogin: userIndividualLogin, email: userEmail, userLogin: userName}));
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch({type: 'auth/isAuth', payload: false});

    localStorage.removeItem(storageName);
  }, [dispatch]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      return login(data.token, data.userId, data.avatarColor, data.individualLogin, data.email, data.userLogin);
    }
  }, [login]);

  return {login, logout};
}