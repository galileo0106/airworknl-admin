import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import {
  Avatar,
  Badge,
  Card,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Stack,
  alpha,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Logout } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { store } from "../redux/store";
import { LOGOUT } from "../redux/actionTypes";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { socket } from "../apis/socket";
import { getNotificationCounts } from "../redux/actions/commonActions";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const Header = () => {
  const { notificationCount } = useSelector((state) => state.common);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const theme = useTheme();
  const { logout } = useAuth();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.common);
  const navigate = useNavigate();

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    store.dispatch({ type: LOGOUT });
    enqueueSnackbar({ variant: "default", message: "You have logged out." });
  };

  React.useEffect(() => {
    socket.on("NEW_REVIEW_NOTIFICATION", () => {
      getNotificationCounts();
      enqueueSnackbar({
        variant: "info",
        message: "A new review arrived!",
      });
    });
    socket.on("NEW_PLATFORM_REVIEW_NOTIFICATION", () => {
      getNotificationCounts();
      enqueueSnackbar({
        variant: "info",
        message: "A new platform review arrived!",
      });
    });
    socket.on("NEW_INFO_REQUEST", () => {
      getNotificationCounts();
      enqueueSnackbar({
        variant: "info",
        message: "A new information request arrived!",
      });
    });
    socket.on("NEW_CONTACT_REQUEST", () => {
      getNotificationCounts();
      enqueueSnackbar({
        variant: "info",
        message: "A new contact request arrived!",
      });
    });
    socket.on("NEW_PREMIUM_REQUEST", () => {
      getNotificationCounts();
      enqueueSnackbar({
        variant: "info",
        message: "A new premium request arrived!",
      });
    });
  }, []);

  React.useEffect(() => {
    getNotificationCounts();
  }, []);

  return (
    <Box
      sx={{
        p: 2,
        pb: 0,
        position: "sticky",
        top: 0,
        left: 0,
        backgroundColor: theme.palette.background.default,
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Card>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {isLoading && (
            <LinearProgress
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
              }}
            />
          )}
          <Stack direction="row" alignItems="center">
            <img src={logo} alt="logo" width={140} />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={4}>
            {/* <ThemeToggleButton /> */}

            <IconButton
              color="primary"
              onClick={() => navigate("/admin_notification")}
            >
              <Badge badgeContent={notificationCount} color="success">
                <NotificationsIcon sx={{ fontSize: 30 }} />
              </Badge>
            </IconButton>

            <IconButton onClick={handleOpenMenu}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                {user?.name[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
          </Stack>

          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                navigate("/profile");
              }}
              disableRipple
              disabled
            >
              <AccountCircleIcon />
              Profile
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleLogout} disableRipple>
              <Logout />
              Logout
            </MenuItem>
          </StyledMenu>
        </Toolbar>
      </Card>
    </Box>
  );
};

export default Header;
