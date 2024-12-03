import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h6">404 Not Found Page</Typography>
      {token ? (
        <Button
          variant="contained"
          sx={{ textTransform: "none" }}
          onClick={() => {
            navigate("/");
          }}
        >
          Go to main page
        </Button>
      ) : (
        <Button
          variant="contained"
          sx={{ textTransform: "none" }}
          onClick={() => {
            navigate("/login");
          }}
        >
          Redirect to login page
        </Button>
      )}
    </Stack>
  );
};

export default NotFoundPage;
