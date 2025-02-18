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
import { useNavigate, useParams } from "react-router-dom";
import { apis } from "../../apis";
import { useEffect, useState } from "react";
import { review_status, reviewer_types } from "../../constants/constants";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ReactQuill from "react-quill";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import AvatarUpload from "../../components/AvatarUpload";

const EditPlatformReviewPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { platform_review_id } = useParams();
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
      rating: 0,
      reviewer_email: "",
      comment: "",
      reviewer_type: "",
      status: "PENDING",
      type: "Institute",
      review_date: null,
      avatar: "",
    },
  });

  const handleUpdate = async (data) => {
    try {
      await apis.updatePlatformReview(platform_review_id, data);
      navigate(-1);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const {
          data: {
            platformReview: {
              reviewer_name,
              rating,
              reviewer_email,
              comment,
              reviewer_type,
              status,
              review_date,
              avatar,
            },
          },
        } = await apis.getPlatformReviewById(platform_review_id);
        setValue("reviewer_name", reviewer_name);
        setValue("rating", rating);
        setValue("reviewer_email", reviewer_email);
        setValue("avatar", avatar);
        setValue("comment", comment);
        setValue("reviewer_type", reviewer_type);
        setValue("status", status);
        setValue("review_date", dayjs(review_date));
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [platform_review_id]);

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
              onSubmit={handleSubmit(handleUpdate)}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton onClick={() => navigate(-1)}>
                  <ArrowBackIosNewIcon />
                </IconButton>
                <Typography variant="h6">Update a platform review</Typography>
              </Stack>

              {!isLoading && (
                <Stack spacing={1}>
                  <Stack spacing={1}>
                    <Controller
                      name="rating"
                      control={control}
                      defaultValue={0}
                      render={({ field: { value, onChange } }) => (
                        <Stack spacing={1}>
                          <Typography variant="body2">Rating</Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
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
                                <Typography variant="body1">
                                  ({value})
                                </Typography>
                              </>
                            )}
                          </Stack>
                        </Stack>
                      )}
                    />
                  </Stack>
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
                  <AvatarUpload setValue={setValue} avatar={watch("avatar")} />
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
              )}

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
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditPlatformReviewPage;
