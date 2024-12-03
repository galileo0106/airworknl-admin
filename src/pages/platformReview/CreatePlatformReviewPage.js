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
  Rating,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apis } from "../../apis";
import { review_status, reviewer_types } from "../../constants/constants";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ReactQuill from "react-quill";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import AvatarUpload from "../../components/AvatarUpload";

const CreatePlatformReviewPage = () => {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      reviewer_name: "",
      rating: 5,
      reviewer_email: "",
      avatar: "",
      comment: "",
      reviewer_type: "",
      status: "PENDING",
      review_date: dayjs(new Date()),
    },
  });

  const handleCreate = async (data) => {
    try {
      await apis.createPlatformReview(data);
      navigate(-1);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

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
                <Typography variant="h6">Create a platform review</Typography>
              </Stack>

              <Stack spacing={1}>
                <Controller
                  name="rating"
                  control={control}
                  defaultValue={0}
                  render={({ field: { value, onChange } }) => (
                    <Stack spacing={1}>
                      <Typography variant="body2">Rating</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Rating
                          name="Rating"
                          value={value}
                          onChange={(event, newValue) => {
                            onChange(newValue);
                          }}
                          size="medium"
                          precision={0.5}
                        />
                        {value > 0 && (
                          <>
                            <span className="dot" />
                            <Typography variant="body1">({value})</Typography>
                          </>
                        )}
                      </Stack>
                    </Stack>
                  )}
                />

                <TextField
                  label="Reviewer name"
                  {...register("reviewer_name", {
                    required: "This field is required.",
                  })}
                  helperText={errors?.reviewer_name?.message}
                  error={!!errors.reviewer_name}
                />
                <TextField
                  label="Reviewer email"
                  helperText={
                    errors.reviewer_email && errors.reviewer_email.message
                  }
                  error={!!errors.reviewer_email}
                  {...register("reviewer_email", {
                    required: "This field is required.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                <Controller
                  name="reviewer_type"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "This field is required.",
                    },
                  }}
                  render={({ field: { value, onChange } }) => (
                    <FormControl variant="standard">
                      <InputLabel>Reviewer type</InputLabel>
                      <Select
                        value={value}
                        onChange={onChange}
                        label="Reviewer type"
                      >
                        {reviewer_types.map((item, index) => (
                          <MenuItem
                            value={item.value}
                            key={`review-type-${index}`}
                          >
                            {item.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors?.reviewer_type && (
                        <FormHelperText error>
                          {errors?.reviewer_type.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                <AvatarUpload avatar={watch("avatar")} setValue={setValue} />
                <Controller
                  name="review_date"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      label="Review date"
                      value={value}
                      onChange={(newValue) => onChange(newValue)}
                    />
                  )}
                />
                <Controller
                  name="status"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "This field is required.",
                    },
                  }}
                  render={({ field: { value, onChange } }) => (
                    <FormControl variant="standard">
                      <InputLabel>Reviewer status</InputLabel>
                      <Select
                        value={value}
                        onChange={onChange}
                        label="Reviewer status"
                      >
                        {review_status.map((item, index) => (
                          <MenuItem
                            value={item.value}
                            key={`review-status-${index}`}
                          >
                            {item.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors?.reviewer_type && (
                        <FormHelperText error>
                          {errors?.reviewer_type.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                <Box height="fit-content" pt={2}>
                  <Controller
                    name="comment"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "This field is required",
                      },
                    }}
                    render={({ field: { onChange, value } }) => (
                      <ReactQuill
                        placeholder="Type comment here"
                        theme="snow"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  {errors?.comment && (
                    <FormHelperText error>
                      {errors.comment?.message}
                    </FormHelperText>
                  )}
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

export default CreatePlatformReviewPage;
