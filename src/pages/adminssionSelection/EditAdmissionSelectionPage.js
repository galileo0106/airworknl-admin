import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apis } from "../../apis";

const EditAdmissionSelectionPage = () => {
  const [educations, setEducations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
  } = useForm({
    defaultValues: {
      education_id: "",
      funding: "",
      education: "",
      medical: "",
    },
  });
  const handleEdit = async (data) => {
    try {
      await apis.updateAdmissionSelection(id, data);
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
            admission_selection: { education_id, funding, education, medical },
          },
        } = await apis.getAdmissionSelectionById(id);
        setValue("education_id", education_id);
        setValue("funding", funding);
        setValue("education", education);
        setValue("medical", medical);

        const {
          data: { educations },
        } = await apis.getEducations();
        setEducations(educations);
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
        <CardHeader title="Edit admission and selection" />
        <CardContent>
          {!isLoading && (
            <Stack direction="row" spacing={2}>
              <Stack
                direction="column"
                maxWidth={700}
                width="100%"
                spacing={2}
                component="form"
                onSubmit={handleSubmit(handleEdit)}
              >
                <Controller
                  name="education_id"
                  control={control}
                  rules={{
                    required: "This field is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      options={educations}
                      getOptionLabel={(option) => (option ? option.name : "")}
                      value={watch("education_id")}
                      onChange={(event, newValue) => {
                        onChange(newValue);
                      }}
                      renderOption={(props, option, { selected }) => (
                        <li {...props} style={{ height: 40 }}>
                          {option.name}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select education"
                          error={!!errors.education_id}
                          helperText={errors.education_id?.message}
                        />
                      )}
                    />
                  )}
                />
                <TextField
                  label="Funding"
                  {...register("funding")}
                  multiline
                  rows={4}
                />
                <TextField
                  label="Education"
                  {...register("education")}
                  multiline
                  rows={4}
                />
                <TextField
                  label="Medical"
                  {...register("medical")}
                  multiline
                  rows={4}
                />
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

export default EditAdmissionSelectionPage;
