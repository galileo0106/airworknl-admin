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
import { useNavigate, useParams } from "react-router-dom";
import { apis } from "../../apis";
import { useEffect, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ReactQuill from "react-quill";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";

const EditInfoRequestPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { info_request_id } = useParams();
  const [infoRequestTypes, setInfoRequestTypes] = useState([]);
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      post: "",
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      types: [],
      message: "",
      post_type: "",
    },
  });

  const handleEdit = async (data) => {
    try {
      await apis.updateInfoRequet(info_request_id, data);
      navigate(-1);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const {
          data: {
            infoRequest: {
              firstname,
              lastname,
              email,
              phone,
              message,
              types,
              post,
              post_type,
            },
          },
        } = await apis.getInfoRequestById(info_request_id);
        setValue("firstname", firstname);
        setValue("lastname", lastname);
        setValue("email", email);
        setValue("phone", phone);
        setValue("post", post);
        setValue("message", message);
        setValue("types", types);
        const {
          data: { infoRequestTypes },
        } = await apis.getInfoRequestTypes(
          `?type=${post_type}&post_id=${post._id}&premium=${
            post?.premium || ""
          }`,
        );
        setInfoRequestTypes(infoRequestTypes);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  return (
    <Box>
      <Card>
        <CardContent>
          {!isLoading && (
            <Stack direction="row" spacing={2}>
              <Stack
                direction="column"
                maxWidth={700}
                width="100%"
                spacing={4}
                component="form"
                onSubmit={handleSubmit(handleEdit)}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIosNewIcon />
                  </IconButton>
                  <Typography variant="h6">Edit information request</Typography>
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
                          Reviewer types
                        </InputLabel>
                        <Select
                          multiple
                          value={value}
                          onChange={onChange}
                          label="Reviewer type"
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
                      Update
                    </LoadingButton>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditInfoRequestPage;
