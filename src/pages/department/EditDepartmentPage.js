import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apis } from "../../apis";
import { MuiTelInput } from "mui-tel-input";
import AddressAutocomplete from "mui-address-autocomplete";
import { countries } from "../../constants/constants";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ReactQuill from "react-quill";
import DragDropImages from "../../components/DragDropImages";

const EditDepartmentPage = () => {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { institute_id, department_id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      level: 2,
      institute: institute_id,
      images: [],
      email: "",
      phone: "",
      website_url: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      metadata: {
        title: "",
        description: "",
      },
      slug: "",
    },
  });
  const getComponentValue = (components, type) => {
    const component = components?.find((c) => c.types.includes(type));
    return component ? component.long_name : "";
  };
  const handleSelectAddress = (_, value) => {
    const addressComponents = value?.address_components;
    const address = value?.formatted_address || "";
    const city = getComponentValue(addressComponents, "locality");
    const state = getComponentValue(
      addressComponents,
      "administrative_area_level_1",
    );
    const postal_code = getComponentValue(addressComponents, "postal_code");
    const countryComponent = addressComponents?.find((component) =>
      component.types.includes("country"),
    );
    let countryCode = "";
    if (countryComponent) {
      countryCode = countryComponent.short_name;
    }
    let country = "";
    countries.forEach((e) => {
      if (e.code === countryCode) country = e;
    });

    setValue("address", address || "");
    setValue("city", city || "");
    setValue("state", state || "");
    setValue("postal_code", postal_code || "");
    setValue("country", country || "");
    setAddress(value);
  };
  const handleEdit = async (data) => {
    try {
      data.country = JSON.stringify(data.country);
      data.metadata = JSON.stringify(data.metadata);
      await apis.updateDepartment(department_id, data);
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
            department: {
              name,
              description,
              institute,
              images,
              email,
              phone,
              website_url,
              address,
              city,
              state,
              postal_code,
              country,
              metadata,
              slug,
              level,
            },
          },
        } = await apis.getDepartmentById(department_id);
        setValue("name", name);
        setValue("description", description);
        setValue("institute", institute);
        setValue("level", level);
        setValue("images", images || []);
        setValue("email", email);
        setValue("phone", phone);
        setValue("website_url", website_url);
        setValue("address", address);
        setValue("city", city);
        setValue("state", state);
        setValue("postal_code", postal_code);
        setValue("country", JSON.parse(country));
        setValue("metadata", JSON.parse(metadata));
        setValue("slug", slug || "");
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [setValue, department_id]);

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
                  <Typography variant="h6">Edit department</Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="h6">Basic information</Typography>
                  <TextField
                    label="Name"
                    {...register("name", {
                      required: "This Field is required",
                    })}
                    helperText={errors?.name?.message}
                    error={!!errors.name}
                  />
                  <Box height="fit-content" pt={2}>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <ReactQuill
                          placeholder="Type description here"
                          theme="snow"
                          value={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  </Box>
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="h6">Contact</Typography>
                  <TextField
                    label="Email"
                    helperText={errors.email?.message}
                    error={!!errors.email}
                    {...register("email", {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  <Controller
                    name="phone"
                    control={control}
                    // rules={{ validate: matchIsValidTel }}
                    render={({ field, fieldState }) => (
                      <MuiTelInput
                        {...field}
                        label="Phone"
                        helperText={
                          fieldState.invalid ? "Phone number is invalid" : ""
                        }
                        error={fieldState.invalid}
                      />
                    )}
                  />
                  <TextField
                    label="Website"
                    helperText={errors.website_url?.message}
                    placeholder="https://example.com"
                    error={!!errors.website_url}
                    {...register("website_url", {
                      pattern: {
                        value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                        message: "Invalid website url",
                      },
                    })}
                  />
                </Stack>
                <DragDropImages
                  imageType="department"
                  watch={watch}
                  setValue={setValue}
                />
                <Stack spacing={1}>
                  <Typography variant="h6">Address information</Typography>
                  <Box maxWidth={700}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <AddressAutocomplete
                          apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                          fields={["geometry"]}
                          value={address}
                          onChange={handleSelectAddress}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select address"
                              placeholder="type here to auto complete address"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          sx={{ width: "100%" }}
                          {...register("address", {
                            required: "This field is required.",
                          })}
                          error={!!errors.address}
                          helperText={errors?.address?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                Address:
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          sx={{ width: "100%" }}
                          {...register("city", {
                            required: "This field is required.",
                          })}
                          error={!!errors.city}
                          helperText={errors?.city?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                City:
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          sx={{ width: "100%" }}
                          {...register("state")}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                State:
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          sx={{ width: "100%", mt: 2 }}
                          {...register("postal_code", {
                            required: "This field is required",
                          })}
                          error={!!errors.postal_code}
                          helperText={errors?.postal_code?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                Postal code:
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Controller
                          name="country"
                          rules={{ required: "This field is required" }}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <Autocomplete
                              value={value}
                              onChange={(_, newValue) => {
                                onChange(newValue);
                              }}
                              options={countries}
                              autoHighlight
                              isOptionEqualToValue={(option, value) =>
                                option.code === value.code
                              }
                              getOptionLabel={(option) => option.label || ""}
                              renderOption={(props, option) => (
                                <Box
                                  component="li"
                                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                  {...props}
                                >
                                  <img
                                    loading="lazy"
                                    width="20"
                                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                    alt=""
                                  />
                                  {option.label} ({option.code}) +{option.phone}
                                </Box>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Choose a country"
                                  inputProps={{
                                    ...params.inputProps,
                                    autoComplete: "new-password", // disable autocomplete and autofill
                                  }}
                                  error={!!errors.country}
                                  helperText={errors?.country?.message}
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="h6">Seo metadata</Typography>
                  <TextField label="Title" {...register("metadata.title")} />
                  <TextField
                    label="Description"
                    {...register("metadata.description")}
                  />
                  <TextField label="Slug" {...register("slug")} />
                </Stack>
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
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditDepartmentPage;
