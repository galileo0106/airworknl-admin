import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apis } from "../../apis";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ReactQuill from "react-quill";

const EditCertificatePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      categories: [],
      price: "",
    },
  });
  const handleEdit = async (data) => {
    try {
      await apis.updateCertificate(id, data);
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
            certificate: { name, code, description, categories, price },
          },
        } = await apis.getCertificateById(id);
        setValue("name", name);
        setValue("code", code);
        setValue("description", description);
        setValue("categories", categories);
        setValue("price", price);

        const {
          data: { categories: data },
        } = await apis.getCategories("?type=certificate");
        setCategories(data);
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
        <CardHeader title="Edit Certificate" />
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
                <TextField
                  label="Name"
                  {...register("name", {
                    required: "This Field is required",
                  })}
                  helperText={errors?.name?.message}
                  error={!!errors.name}
                />
                <TextField label="Code" {...register("code")} />
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
                <Controller
                  name="categories"
                  control={control}
                  rules={{
                    validate: (value) =>
                      value.length > 0 || "Please select at least 1 category",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      multiple
                      options={categories}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.name}
                      value={watch("categories")}
                      onChange={(event, newValue) => {
                        onChange(newValue);
                      }}
                      renderOption={(props, option, { selected }) => {
                        const isSelected = watch("categories").some(
                          (v) => v._id === option._id,
                        );
                        return (
                          <li
                            {...props}
                            onClick={() => {
                              var array = watch("categories");
                              if (isSelected)
                                array = watch("categories").filter(
                                  (e) => e._id !== option._id,
                                );
                              else array.push(option);
                              setValue("categories", array);
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
                          label="Select categories"
                          placeholder="Category"
                          error={!!errors.categories}
                          helperText={errors.categories?.message}
                        />
                      )}
                    />
                  )}
                />
                <TextField label="Price" {...register("price")} type="number" />
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

export default EditCertificatePage;
