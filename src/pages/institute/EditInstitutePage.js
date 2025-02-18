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
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apis } from "../../apis";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { countries } from "../../constants/constants";
import AddressAutocomplete from "mui-address-autocomplete";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ReactQuill from "react-quill";
import DragDropImages from "../../components/DragDropImages";
import TextEditor from "../../components/TextEditor";

const EditInstitutePage = () => {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [instituteTypes, setInstituteTypes] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [notiEmail, setNotiEmail] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      institute_types: [],
      certificates: [],
      premium: false,
      images: [],
      members_only: false,
      founded_at: "",
      events: [],
      notification_emails: [],
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
      community: "",
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
      await apis.updateInstitute(id, data);
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
        setIsLoading(true);
        const {
          data: {
            institute: {
              name,
              description,
              institute_types,
              certificates,
              images = [],
              premium,
              notification_emails = [],
              members_only,
              founded_at,
              address,
              city,
              state,
              postal_code,
              country,
              metadata,
              slug,
              community,
            },
          },
        } = await apis.getInstituteById(id);
        setValue("name", name);
        setValue("description", description);
        setValue("institute_types", institute_types);
        setValue("address", address);
        setValue("certificates", certificates);
        setValue("notification_emails", notification_emails);
        setValue("images", images || []);
        setValue("premium", premium);
        setValue("members_only", members_only);
        setValue("founded_at", dayjs(founded_at));
        setValue("address", address);
        setValue("city", city);
        setValue("state", state);
        setValue("postal_code", postal_code);
        setValue("country", JSON.parse(country));
        setValue("metadata", JSON.parse(metadata));
        setValue("slug", slug || "");
        setValue("community", community);

        const {
          data: { institute_types: _institute_types },
        } = await apis.getInstituteTypes();
        setInstituteTypes(_institute_types);
        const {
          data: { certificates: _certificates },
        } = await apis.getCertificates();
        setCertificates(_certificates);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [setValue, id]);

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
                  <Typography variant="h6">Edit Institute</Typography>
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
                        <TextEditor
                          placeholder="Type description here"
                          theme="snow"
                          value={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  </Box>
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
                        renderOption={(props, option, { selected }) => {
                          const isSelected = watch("institute_types").some(
                            (v) => v._id === option._id,
                          );
                          return (
                            <li
                              {...props}
                              onClick={() => {
                                var array = watch("institute_types");
                                if (isSelected)
                                  array = watch("institute_types").filter(
                                    (e) => e._id !== option._id,
                                  );
                                else array.push(option);
                                setValue("institute_types", array);
                              }}
                              style={{ height: 40 }}
                            >
                              <Checkbox
                                icon={
                                  <CheckBoxOutlineBlankIcon fontSize="small" />
                                }
                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                style={{ marginRight: 8 }}
                                checked={isSelected}
                              />
                              {option.name}
                            </li>
                          );
                        }}
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
                        renderOption={(props, option, { selected }) => {
                          const isSelected = watch("certificates").some(
                            (v) => v._id === option._id,
                          );
                          return (
                            <li
                              {...props}
                              onClick={() => {
                                var array = watch("certificates");
                                if (isSelected)
                                  array = watch("certificates").filter(
                                    (e) => e._id !== option._id,
                                  );
                                else array.push(option);
                                setValue("certificates", array);
                              }}
                              style={{ height: 40 }}
                            >
                              <Checkbox
                                icon={
                                  <CheckBoxOutlineBlankIcon fontSize="small" />
                                }
                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                style={{ marginRight: 8 }}
                                checked={isSelected}
                              />
                              {option.name}
                            </li>
                          );
                        }}
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
                  <TextField
                    label="Community"
                    helperText={errors.community?.message}
                    placeholder="https://example.com"
                    error={!!errors.community}
                    {...register("community", {
                      pattern: {
                        value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                        message: "Invalid community url",
                      },
                    })}
                  />
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
                      ),
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

export default EditInstitutePage;
