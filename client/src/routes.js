import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { SignUp } from './components/SignUp/SignUp';
import { SignIn } from './components/SignIn/SignIn';
import { Recover } from './components/Recover/Recover';
import { Chat } from './containers/Chat/Chat';
import { Settings } from './components/Settings/Settings';
import { SwitchTheme } from './components/SwitchTheme/SwitchTheme';

// const status = state => state.auth.status;
const auth = state => state.auth.isAuth;
const currentDialogId = state => state.dialog.currentDialogId;

export const useRoutes = () => {
  const isAuth = useSelector(auth);
  const dialogId = useSelector(currentDialogId);
  // console.log(dialogId);
  
  // const whatShow = useSelector(status);
  if (!isAuth) {
    return (
      <Switch>
        <Route path="/signup">
          <SwitchTheme />
          <SignUp />
        </Route>

        <Route path="/signin">
          <SwitchTheme />
          <SignIn />
        </Route>

        <Route path="/recover">
          <SwitchTheme />
          <Recover />
        </Route>

        <Redirect to="/signin" />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route exact path="/dialogs">
        <Chat />        
      </Route>

      <Route path="/dialogs/:dialogId">
        <Chat dialogId={dialogId} />
      </Route>

      <Route path="/settings">
        <Settings />
      </Route>

      <Redirect to="/dialogs" />
    </Switch>
  ) 
}

