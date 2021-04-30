import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Avatar from '@material-ui/core/Avatar';
import MoreIcon from '@material-ui/icons/MoreVert';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const dark = state => state.theme.dark;
const auth = state => state.auth.isAuth;
const userName = state => state.auth.userName;

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    color: theme.palette.defaultColor.main
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: theme.palette.defaultColor.main
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },

  iconColor: {
    color: theme.palette.defaultColor.main
  },
  iconColorReverse: {
    color: theme.palette.defaultColorReverse.main
  },
  avatarColor : {
    backgroundColor: theme.palette.secondary.main,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  }
}));

export const NavBar = () => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const whatTheme = useSelector(dark);
  const isAuth = useSelector(auth);
  const avatarContent = useSelector(userName);
  const dispatch = useDispatch();
  const { logout } = useAuth();  

  // const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleThemeChange = () => {
    dispatch({type: 'theme/switch-theme'});
  };

  const logoutHandler = () => {
    logout();
  }

  const menuId = 'primary-search-account-menu';
  // const renderMenu = (
  //   <Menu
  //     anchorEl={anchorEl}
  //     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  //     id={menuId}
  //     keepMounted
  //     transformOrigin={{ vertical: 'top', horizontal: 'right' }}
  //     open={isMenuOpen}
  //     onClose={handleMenuClose}
  //   >
      
  //     <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
  //   </Menu>
  // );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleThemeChange}>
        {whatTheme ?
          <IconButton >
          <Brightness7Icon className={classes.iconColorReverse} />
          </IconButton> : 

          <IconButton>
            <Brightness4Icon className={classes.iconColorReverse} />
          </IconButton>
        }

        <p>Switch Theme</p>
      </MenuItem>

      {
        isAuth &&

        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            aria-label="switch theme"
            aria-controls="primary-switch-theme"
            color="inherit"
          >
            <Avatar className={`${classes.small} ${classes.iconColor}`}>{avatarContent && avatarContent.slice(0, 1).toUpperCase()}</Avatar>
          </IconButton>

          <p>Profile</p>
        </MenuItem>
      }
      
      {
        isAuth &&

        <MenuItem onClick={logoutHandler}>
          <IconButton
            aria-label="logout"
            aria-controls="primary-logout"
            color="inherit"
          >
            <ExitToAppIcon />
          </IconButton>

          <p>Logout</p>
        </MenuItem>
      }
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            MERN Chat
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon className={classes.iconColor} />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {whatTheme ?
              <IconButton onClick={handleThemeChange}>
              <Brightness7Icon className={classes.iconColor} />
              </IconButton> : 

              <IconButton onClick={handleThemeChange}>
                <Brightness4Icon className={classes.iconColor} />
              </IconButton>
            }

            {
              isAuth &&
              <IconButton
                
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Link to="/profile">
                <Avatar className={`${classes.small} ${classes.avatarColor}`}>{avatarContent && avatarContent.slice(0, 1).toUpperCase()}</Avatar>
                </Link>
              </IconButton>
            }

            {
              isAuth &&
              <IconButton
                aria-label="logout"
                aria-controls="primary-logout"
                color="inherit"
                onClick={logoutHandler}
              >
                <ExitToAppIcon className={classes.iconColor} />
              </IconButton>
            }
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon className={classes.iconColor} />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {/* {renderMenu} */}
    </div>
  );
}