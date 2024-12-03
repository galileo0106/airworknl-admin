import { Box } from "@mui/material";
import AirworkImg from "../assets/img/airwork.jpg";

const PublicLayout = ({ children }) => {
  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={10}
      padding={4}
    >
      <Box
        display={{ xs: "none", md: "block" }}
        alignContent="center"
        justifyContent="center"
        maxWidth={800}
      >
        <img src={AirworkImg} alt="auth-svg" width="100%" />
      </Box>
      <Box>{children}</Box>
    </Box>
  );
};

export default PublicLayout;
