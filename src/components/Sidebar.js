import * as React from "react";

import MuiDrawer from "@mui/material/Drawer";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import List from "@mui/material/List";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Collapse, Typography } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const drawerWidth = 250;

const StyledButton = styled(ListItemButton)(({ theme }) => ({
  height: 36,
  justifyContent: "space-between",
}));

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} - 8px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} - 8px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  height: 95,
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  boxShadow: "rgba(47, 43, 61, 0.14) 0px 2px 6px 0px",
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Sidebar = () => {
  const navigate = useNavigate();
  const [openList, setOpenList] = useState({
    institute: false,
    airplane: false,
    simulator: false,
    category: false,
    training_form: false,
    institute_type: false,
    info_request_type: false,
    certificate: false,
    admission_selection: false,
    notification: false,
    account: false,
    newsAndBlog: false,
  });
  const paths = window.location.pathname.split("/");
  React.useEffect(() => {
    const {
      location: { pathname },
    } = window;
    const route = pathname.split("/")[1];
    switch (route) {
      case "institute":
        setOpenList({ ...openList, institute: true });
        break;
      case "airplane":
        setOpenList({ ...openList, airplane: true });
        break;
      case "simulator":
        setOpenList({ ...openList, simulator: true });
        break;
      case "category":
        setOpenList({ ...openList, category: true });
        break;
      case "training_form":
        setOpenList({ ...openList, training_form: true });
        break;
      case "institute_type":
        setOpenList({ ...openList, institute_type: true });
        break;
      case "certificate":
        setOpenList({ ...openList, certificate: true });
        break;
      case "admission_selection":
        setOpenList({ ...openList, admission_selection: true });
        break;
      case "news_blog":
        setOpenList({ ...openList, newsAndBlog: true });
        break;
      default:
        setOpenList({ ...openList });
        break;
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Drawer variant="permanent" open={true}>
      <DrawerHeader />
      <Divider />
      <List sx={{ width: "100%", pb: 3 }} disablePadding component="nav">
        <StyledButton
          onClick={() =>
            setOpenList({ ...openList, institute: !openList.institute })
          }
        >
          <Typography variant="body1" fontWeight={600}>
            Institutes
          </Typography>
          {openList.institute ? <ExpandLess /> : <ExpandMore />}
        </StyledButton>
        <Collapse in={openList.institute} timeout="auto" unmountOnExit>
          <StyledButton
            onClick={() => navigate("/institute")}
            selected={paths[1] === "institute" && paths.length === 2}
          >
            <ListItemText primary="All Institutes" sx={{ ml: 2 }} />
          </StyledButton>
          <StyledButton
            onClick={() => navigate("/institute/create")}
            selected={paths[1] === "institute" && paths[2] === "create"}
          >
            <ListItemText primary="Add new" sx={{ ml: 2 }} />
          </StyledButton>
        </Collapse>

        <Divider />
        <StyledButton
          onClick={() =>
            setOpenList({ ...openList, category: !openList.category })
          }
        >
          <Typography variant="body1" fontWeight={600}>
            Categories
          </Typography>
          {openList.category ? <ExpandLess /> : <ExpandMore />}
        </StyledButton>
        <Collapse in={openList.category} timeout="auto" unmountOnExit>
          <StyledButton
            onClick={() => navigate("/category?tab=education")}
            selected={paths[1] === "category" && paths.length === 2}
          >
            <ListItemText primary="All Categories" sx={{ ml: 2 }} />
          </StyledButton>
          <StyledButton
            onClick={() => navigate("/category/create")}
            selected={paths[1] === "category" && paths[2] === "create"}
          >
            <ListItemText primary="Add new" sx={{ ml: 2 }} />
          </StyledButton>
        </Collapse>
        <StyledButton
          onClick={() =>
            setOpenList({ ...openList, training_form: !openList.training_form })
          }
        >
          <Typography variant="body1" fontWeight={600}>
            Training forms
          </Typography>
          {openList.training_form ? <ExpandLess /> : <ExpandMore />}
        </StyledButton>
        <Collapse in={openList.training_form} timeout="auto" unmountOnExit>
          <StyledButton
            onClick={() => navigate("/training_form")}
            selected={paths[1] === "training_form" && paths.length === 2}
          >
            <ListItemText primary="All training forms" sx={{ ml: 2 }} />
          </StyledButton>
          <StyledButton
            onClick={() => navigate("/training_form/create")}
            selected={paths[1] === "training_form" && paths[2] === "create"}
          >
            <ListItemText primary="Add new" sx={{ ml: 2 }} />
          </StyledButton>
        </Collapse>
        <StyledButton
          onClick={() =>
            setOpenList({
              ...openList,
              institute_type: !openList.institute_type,
            })
          }
        >
          <Typography variant="body1" fontWeight={600}>
            Institute types
          </Typography>
          {openList.institute_type ? <ExpandLess /> : <ExpandMore />}
        </StyledButton>
        <Collapse in={openList.institute_type} timeout="auto" unmountOnExit>
          <StyledButton
            onClick={() => navigate("/institute_type")}
            selected={paths[1] === "institute_type" && paths.length === 2}
          >
            <ListItemText primary="All institute types" sx={{ ml: 2 }} />
          </StyledButton>
          <StyledButton
            onClick={() => navigate("/institute_type/create")}
            selected={paths[1] === "institute_type" && paths[2] === "create"}
          >
            <ListItemText primary="Add new" sx={{ ml: 2 }} />
          </StyledButton>
        </Collapse>
        <StyledButton
          onClick={() =>
            setOpenList({
              ...openList,
              info_request_type: !openList.info_request_type,
            })
          }
        >
          <Typography variant="body1" fontWeight={600}>
            Info request types
          </Typography>
          {openList.info_request_type ? <ExpandLess /> : <ExpandMore />}
        </StyledButton>
        <Collapse in={openList.info_request_type} timeout="auto" unmountOnExit>
          <StyledButton
            onClick={() => navigate("/info_request_type")}
            selected={paths[1] === "info_request_type" && paths.length === 2}
          >
            <ListItemText primary="All info request types" sx={{ ml: 2 }} />
          </StyledButton>
          <StyledButton
            onClick={() => navigate("/info_request_type/create")}
            selected={paths[1] === "info_request_type" && paths[2] === "create"}
          >
            <ListItemText primary="Add new" sx={{ ml: 2 }} />
          </StyledButton>
        </Collapse>
        <StyledButton
          onClick={() =>
            setOpenList({ ...openList, certificate: !openList.certificate })
          }
        >
          <Typography variant="body1" fontWeight={600}>
            Certificates
          </Typography>
          {openList.certificate ? <ExpandLess /> : <ExpandMore />}
        </StyledButton>
        <Collapse in={openList.certificate} timeout="auto" unmountOnExit>
          <StyledButton
            onClick={() => navigate("/certificate")}
            selected={paths[1] === "certificate" && paths.length === 2}
          >
            <ListItemText primary="All certificates" sx={{ ml: 2 }} />
          </StyledButton>
          <StyledButton
            onClick={() => navigate("/certificate/create")}
            selected={paths[1] === "certificate" && paths[2] === "create"}
          >
            <ListItemText primary="Add new" sx={{ ml: 2 }} />
          </StyledButton>
        </Collapse>
        <StyledButton
          onClick={() =>
            setOpenList({
              ...openList,
              admission_selection: !openList.admission_selection,
            })
          }
        >
          <Typography variant="body1" fontWeight={600}>
            Admission & selections
          </Typography>
          {openList.admission_selection ? <ExpandLess /> : <ExpandMore />}
        </StyledButton>
        <Collapse
          in={openList.admission_selection}
          timeout="auto"
          unmountOnExit
        >
          <StyledButton
            onClick={() => navigate("/admission_selection")}
            selected={paths[1] === "admission_selection" && paths.length === 2}
          >
            <ListItemText primary="All admission & selections" sx={{ ml: 2 }} />
          </StyledButton>
          <StyledButton
            onClick={() => navigate("/admission_selection/create")}
            selected={
              paths[1] === "admission_selection" && paths[2] === "create"
            }
          >
            <ListItemText primary="Add new" sx={{ ml: 2 }} />
          </StyledButton>
        </Collapse>

        <StyledButton
          onClick={() =>
            setOpenList({ ...openList, airplane: !openList.airplane })
          }
        >
          <Typography variant="body1" fontWeight={600}>
            Airplanes
          </Typography>
          {openList.airplane ? <ExpandLess /> : <ExpandMore />}
        </StyledButton>
        <Collapse in={openList.airplane} timeout="auto" unmountOnExit>
          <StyledButton
            onClick={() => navigate("/airplane")}
            selected={paths[1] === "airplane" && paths.length === 2}
          >
            <ListItemText primary="All airplanes" sx={{ ml: 2 }} />
          </StyledButton>
          <StyledButton
            onClick={() => navigate("/airplane/create")}
            selected={paths[1] === "airplane" && paths[2] === "create"}
          >
            <ListItemText primary="Add new" sx={{ ml: 2 }} />
          </StyledButton>
          <StyledButton
            onClick={() => navigate("/airplane_type")}
            selected={paths[1] === "airplane_type" && paths.length === 2}
          >
            <ListItemText primary="Types" sx={{ ml: 2 }} />
          </StyledButton>
        </Collapse>
        <StyledButton
          onClick={() =>
            setOpenList({ ...openList, simulator: !openList.simulator })
          }
        >
          <Typography variant="body1" fontWeight={600}>
            Simulators
          </Typography>
          {openList.simulator ? <ExpandLess /> : <ExpandMore />}
        </StyledButton>
        <Collapse in={openList.simulator} timeout="auto" unmountOnExit>
          <StyledButton
            onClick={() => navigate("/simulator")}
            selected={paths[1] === "simulator" && paths.length === 2}
          >
            <ListItemText primary="All simulators" sx={{ ml: 2 }} />
          </StyledButton>
          <StyledButton
            onClick={() => navigate("/simulator/create")}
            selected={paths[1] === "simulator" && paths[2] === "create"}
          >
            <ListItemText primary="Add new" sx={{ ml: 2 }} />
          </StyledButton>
          <StyledButton
            onClick={() => navigate("/simulator_type")}
            selected={paths[1] === "simulator_type" && paths.length === 2}
          >
            <ListItemText primary="Types" sx={{ ml: 2 }} />
          </StyledButton>
        </Collapse>
        <StyledButton
          onClick={() =>
            setOpenList({ ...openList, newsAndBlog: !openList.newsAndBlog })
          }
        >
          <Typography variant="body1" fontWeight={600}>
            News and blogs
          </Typography>
          {openList.newsAndBlog ? <ExpandLess /> : <ExpandMore />}
        </StyledButton>
        <Collapse in={openList.newsAndBlog} timeout="auto" unmountOnExit>
          <StyledButton
            onClick={() => navigate("/news_blog")}
            selected={paths[1] === "news_blog" && paths.length === 2}
          >
            <ListItemText primary="All news and blogs" sx={{ ml: 2 }} />
          </StyledButton>
          <StyledButton
            onClick={() => navigate("/news_blog/create")}
            selected={paths[1] === "news_blog" && paths[2] === "create"}
          >
            <ListItemText primary="Add new" sx={{ ml: 2 }} />
          </StyledButton>
        </Collapse>
        <StyledButton onClick={() => navigate("/event")} value="event" disabled>
          <Typography variant="body1" fontWeight={600}>
            Events
          </Typography>
        </StyledButton>
        <StyledButton
          onClick={() => navigate("/review")}
          selected={paths[1] === "review" && paths.length === 2}
        >
          <Typography variant="body1" fontWeight={600}>
            Reviews
          </Typography>
        </StyledButton>
        <StyledButton
          onClick={() => navigate("/platform_review")}
          selected={paths[1] === "platform_review" && paths.length === 2}
        >
          <Typography variant="body1" fontWeight={600}>
            Platform reviews
          </Typography>
        </StyledButton>
        <StyledButton
          onClick={() => navigate("/info_request")}
          selected={paths[1] === "info_request" && paths.length === 2}
        >
          <Typography variant="body1" fontWeight={600}>
            Information requests
          </Typography>
        </StyledButton>
        <StyledButton
          onClick={() => navigate("/contact_request")}
          selected={paths[1] === "contact_request" && paths.length === 2}
        >
          <Typography variant="body1" fontWeight={600}>
            Contact requests
          </Typography>
        </StyledButton>
        <Divider />
        <StyledButton
          onClick={() =>
            setOpenList({ ...openList, notification: !openList.notification })
          }
        >
          <Typography variant="body1" fontWeight={600}>
            Notifications
          </Typography>
          {openList.notification ? <ExpandLess /> : <ExpandMore />}
        </StyledButton>
        <Collapse in={openList.notification} timeout="auto" unmountOnExit>
          <StyledButton
            onClick={() => navigate("/notification/create")}
            selected={paths[1] === "notification" && paths[2] === "create"}
            disabled
          >
            <ListItemText primary="Add new" sx={{ ml: 2 }} />
          </StyledButton>
          <StyledButton
            onClick={() => navigate("/notification")}
            selected={paths[1] === "notification" && paths.length === 2}
            disabled
          >
            <ListItemText primary="All notifications" sx={{ ml: 2 }} />
          </StyledButton>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default Sidebar;
