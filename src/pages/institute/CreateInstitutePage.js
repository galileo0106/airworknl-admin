import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apis } from "../../apis";
import { useEffect, useState } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { countries } from "../../constants/constants";
import AddressAutocomplete from "mui-address-autocomplete";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ReactQuill from "react-quill";
import DragDropImages from "../../components/DragDropImages";

const CreateInstitutePage = () => {
  const [address, setAddress] = useState("");
  const [instituteTypes, setInstituteTypes] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [notiEmail, setNotiEmail] = useState("");
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
      institute_types: [],
      certificates: [],
      premium: false,
      images: [],
      notification_emails: [],
      members_only: false,
      founded_at: null,
      events: [],
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      main_department_name: "Main location",
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
      "administrative_area_level_1"
    );
    const postal_code = getComponentValue(addressComponents, "postal_code");
    const countryComponent = addressComponents?.find((component) =>
      component.types.includes("country")
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
  const handleCreateInstitute = async (data) => {
    try {
      data.country = JSON.stringify(data.country);
      data.metadata = JSON.stringify(data.metadata);
      await apis.createInstitute(data);
      navigate(-1);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNotificationEmail = () => {
    if (!notiEmail) return;
    else {
      var array = watch("notification_emails");
      setValue("notification_emails", [...array, notiEmail]);
      setNotiEmail("");
    }
  };
  const handleDeleteNotificationEmail = (email) => {
    var array = watch("notification_emails");
    array = array.filter((e) => e !== email);
    setValue("notification_emails", array);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { institute_types },
        } = await apis.getInstituteTypes();
        setInstituteTypes(institute_types);
        const {
          data: { certificates },
        } = await apis.getCertificates();
        setCertificates(certificates);
      } catch (error) {}
    };

    init();
  }, []);

  return (
    <Box>
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2}>
            <Stack direction="row" spacing={2}>
              <Stack
                direction="column"
                width="100%"
                spacing={4}
                component="form"
                onSubmit={handleSubmit(handleCreateInstitute)}
                maxWidth={700}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIosNewIcon />
                  </IconButton>
                  <Typography variant="h6">Create institute</Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="h6">Basic information</Typography>
                  <TextField
                    label="Institute Name"
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
                  <TextField
                    label="Name of main department"
                    {...register("main_department_name")}
                  />
                  <Controller
                    name="institute_types"
                    control={control}
                    rules={{
                      validate: (value) =>
                        value.length > 0 ||
                        "Please select at least 1 institute type",
                    }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        multiple
                        options={instituteTypes}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.name}
                        value={watch("institute_types")}
                        onChange={(event, newValue) => {
                          onChange(newValue);
                        }}
                        renderOption={(props, option, { selected }) => (
                          <li {...props} style={{ height: 40 }}>
                            <Checkbox
                              icon={
                                <CheckBoxOutlineBlankIcon fontSize="small" />
                              }
                              checkedIcon={<CheckBoxIcon fontSize="small" />}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.name}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select institute types"
                            placeholder="institute_types"
                            error={!!errors.institute_types}
                            helperText={errors.institute_types?.message}
                          />
                        )}
                      />
                    )}
                  />
                  <Controller
                    name="certificates"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        multiple
                        options={certificates}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.name}
                        value={watch("certificates")}
                        onChange={(event, newValue) => {
                          onChange(newValue);
                        }}
                        renderOption={(props, option, { selected }) => (
                          <li {...props} style={{ height: 40 }}>
                            <Checkbox
                              icon={
                                <CheckBoxOutlineBlankIcon fontSize="small" />
                              }
                              checkedIcon={<CheckBoxIcon fontSize="small" />}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.name}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select certificates"
                            placeholder="Certificate"
                            error={!!errors.certificates}
                            helperText={errors.certificates?.message}
                          />
                        )}
                      />
                    )}
                  />
                  <Controller
                    name="founded_at"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        label="Founded at"
                        value={value}
                        onChange={(newValue) => onChange(newValue)}
                      />
                    )}
                  />
                  <Stack direction="row" spacing={1} alignItems="flex-end">
                    <TextField
                      variant="standard"
                      label="Notification email"
                      value={notiEmail}
                      fullWidth
                      onChange={(e) => setNotiEmail(e.target.value)}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddNotificationEmail}
                      sx={{ minWidth: "fit-content" }}
                    >
                      Add email
                    </Button>
                  </Stack>
                  <Box
                    display="flex"
                    gap={1}
                    flexDirection="row"
                    flexWrap="wrap"
                  >
                    {watch("notification_emails").map(
                      (notification_email, index) => (
                        <Chip
                          label={notification_email}
                          key={`notification-email-${index}`}
                          onDelete={() =>
                            handleDeleteNotificationEmail(notification_email)
                          }
                        />
                      )
                    )}
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Controller
                      name="premium"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={value}
                              onChange={(e) => onChange(e.target.checked)}
                            />
                          }
                          label="Premium"
                        />
                      )}
                    />
                    <Controller
                      name="members_only"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={value}
                              onChange={(e) => onChange(e.target.checked)}
                            />
                          }
                          label="Members only"
                        />
                      )}
                    />
                  </Stack>
                </Stack>
                <DragDropImages
                  imageType="institute"
                  watch={watch}
                  setValue={setValue}
                />
                <Stack spacing={1}>
                  <Typography variant="h6">Address information</Typography>
                  <Box>
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
                          error={!!errors.state}
                          helperText={errors?.state?.message}
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

export default CreateInstitutePage;
