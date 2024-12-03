import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apis } from "../../apis";
import { useEffect, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ReactQuill from "react-quill";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";

const CreateInfoRequestPage = () => {
  const [infoRequestTypes, setInfoRequestTypes] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const postType = searchParams.get("post_type");
  const postId = searchParams.get("post_id");
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      post: postId,
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      types: [],
      message: "",
      post_type: postType,
    },
  });

  const handleCreate = async (data) => {
    try {
      await apis.createInfoRequest(data);
      navigate(-1);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { infoRequestTypes },
        } = await apis.getInfoRequestTypes(
          `?type=${postType}&post_id=${postId}`
        );
        setInfoRequestTypes(infoRequestTypes);
      } catch (error) {}
    };
    init();
  }, []);

  return (
    <Box>
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2}>
            <Stack
              direction="column"
              maxWidth={700}
              width="100%"
              spacing={4}
              component="form"
              onSubmit={handleSubmit(handleCreate)}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton onClick={() => navigate(-1)}>
                  <ArrowBackIosNewIcon />
                </IconButton>
                <Typography variant="h6">
                  Create a information request
                </Typography>
              </Stack>

              <Stack spacing={1}>
                <TextField
                  label="First name"
                  {...register("firstname", {
                    required: "This field is required.",
                  })}
                  helperText={errors?.firstname?.message}
                  error={!!errors.firstname}
                />
                <TextField
                  label="Last name"
                  {...register("lastname", {
                    required: "This field is required.",
                  })}
                  helperText={errors?.lastname?.message}
                  error={!!errors.lastname}
                />
                <TextField
                  label="Email"
                  helperText={errors.email && errors.email.message}
                  error={!!errors.email}
                  {...register("email", {
                    required: "This field is required.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                <Controller
                  name="phone"
                  control={control}
                  rules={{ validate: matchIsValidTel }}
                  render={({ field, fieldState }) => (
                    <MuiTelInput
                      {...field}
                      label="phone"
                      helperText={
                        fieldState.invalid ? "Phone number is invalid" : ""
                      }
                      error={fieldState.invalid}
                    />
                  )}
                />
                <Controller
                  name="types"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "This field is required.",
                    },
                  }}
                  render={({ field: { value, onChange } }) => (
                    <FormControl variant="standard">
                      <InputLabel error={!!errors?.types}>
                        Request types
                      </InputLabel>
                      <Select
                        multiple
                        value={value}
                        onChange={onChange}
                        label="Request type"
                        error={!!errors?.types}
                      >
                        {infoRequestTypes.map((item, index) => (
                          <MenuItem
                            value={item._id}
                            key={`review-type-${index}`}
                          >
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors?.types && (
                        <FormHelperText error>
                          {errors?.types.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                <Box height="fit-content" pt={2}>
                  <Controller
                    name="message"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <ReactQuill
                        placeholder="Type message here"
                        theme="snow"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </Box>
              </Stack>

              <Stack spacing={1}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    variant="text"
                    onClick={() => navigate(-1)}
                    sx={{ width: "fit-content" }}
                  >
                    Go back
                  </Button>
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={isSubmitting}
                    sx={{ width: "fit-content" }}
                  >
                    Create
                  </LoadingButton>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateInfoRequestPage;
