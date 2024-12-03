import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "rgb(6, 37, 85)",
    },
    secondary: {
      main: "rgb(236, 147, 16)",
    },
  },
  typography: {
    fontFamily: "Montserrat",
    fontSize: 12
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "standard",
        size: "small",
      },
    },
    MuiChip: {
      defaultProps: {
        size: "small",
        variant: "filled",
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "rgba(47, 43, 61, 0.14) 0px 2px 6px 0px",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          height: 40,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        size: "medium",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: 20,
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "rgb(6, 37, 85)",
    },
    secondary: {
      main: "rgb(236, 147, 16)",
    },
  },
  typography: {
    fontFamily: "Montserrat",
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "standard",
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "rgba(47, 43, 61, 0.14) 0px 2px 6px 0px",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          height: 40,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: 20,
        },
      },
    },
  },
});
