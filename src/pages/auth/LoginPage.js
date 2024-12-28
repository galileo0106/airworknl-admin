import { Box, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { store } from "../../redux/store";
import { LOGIN_FALIED } from "../../redux/actionTypes";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { apis } from "../../apis";
import PasswordField from "../../components/PasswordField";
import { useAuth } from "../../hooks/useAuth";
import { LoadingButton } from "@mui/lab";
import logo from "../../assets/img/logo.png";

const LoginPage = () => {
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "", login_type: "admin_login" },
  });
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    try {
      const res = await apis.login(data);
      login(res.data.tokens.accessToken);
      navigate(location.state?.from || "/institute");
    } catch (err) {
      store.dispatch({ type: LOGIN_FALIED });
    }
  };

  if (token) return <Navigate to="/" />;
  else
    return (
      <Box maxWidth={400} minWidth={400}>
        <Stack
          direction="column"
          spacing={3}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack direction="column" alignItems="center" spacing={0}>
            <Box  width={200}>
              <img src={logo} alt="logo" width="100%" />
            </Box>
            <Typography variant="h4" sx={{ textAlign: "center" }}>
              Welcome to Login!
            </Typography>
          </Stack>
          <TextField
            label="Email"
            helperText={errors.email && errors.email.message}
            error={!!errors.email}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />

          <PasswordField
            label="Password"
            helperText={errors.password && errors.password.message}
            error={!!errors.password}
            register={register("password", {
              minLength: { value: 6, message: "At least 6 characters" },
              required: "Password is required",
            })}
          />

          <LoadingButton
            variant="contained"
            type="submit"
            loading={isSubmitting}
          >
            Login
          </LoadingButton>
          {/* <Stack direction="column" spacing={1}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="p">Don't have an account yet?</Typography>
              <Link
                fontWeight="bold"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
              >
                Sign Up
              </Link>
            </Stack>
            <Link
              fontWeight="bold"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/forgot-password");
              }}
            >
              Forgot password
            </Link>
          </Stack> */}
        </Stack>
      </Box>
    );
};

export default LoginPage;
