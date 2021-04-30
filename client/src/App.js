import React, { useEffect } from "react";
import { BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Container from '@material-ui/core/Container';
import { makeStyles } from "@material-ui/core/styles";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { orange, deepOrange, lightBlue, deepPurple, common, grey } from '@material-ui/core/colors';
import { useRoutes } from './routes';
import { useAuth } from './hooks/useAuth';
import jwt_decode from 'jwt-decode';
import { CssBaseline } from "@material-ui/core";

const dark = state => state.theme.dark;
const color = state => state.auth.userData.color;

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    minHeight: '100vh'

  },
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

export default function App() {
  const classes = useStyles();
  const whatTheme = useSelector(dark);
  const avatarColor = useSelector(color);
  const token = localStorage.getItem(['userData']);
  const routes = useRoutes();
  const { logout } = useAuth();

  const palletType = whatTheme ? "dark" : "light";
  const mainColor = whatTheme ? common['black'] : common['white'];
  const paperColor = whatTheme ? grey[900] : grey[200];
  const mainColorReverse = whatTheme ? common['white'] : common['black'];
  const mainPrimaryColor = whatTheme ? orange[500] : lightBlue[500];
  const mainSecondaryColor = whatTheme ? deepOrange[800] : deepPurple[500];
  const darkTheme = createMuiTheme({
    palette: {
      type: palletType,
      defaultColor: {
        main: mainColor
      },
      defaultColorReverse : {
        main: mainColorReverse
      },
      avatarColor: {
        main: avatarColor
      },
      primary: {
        main: mainPrimaryColor
      },
      secondary: {
        main: mainSecondaryColor
      },
      paperColor: {
        main: paperColor
      }
    },
    breakpoints: {
      tablet: '768px'
    }
  });

  useEffect(() => {
    if (!token) {
      return;
    }
    const decoded = jwt_decode(token);
    if (decoded.exp * 1000 < Date.now()) {
      logout();
    }
  }, [logout, token]);

  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <Container className={classes.container}>
          {/* <NavBar /> */}
          <CssBaseline />

          <div>
            {routes}

            {/* <Footer /> */}
          </div>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}
