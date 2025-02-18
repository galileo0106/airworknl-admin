import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
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
import ReactQuill from "react-quill";
import DragDropImages from "../../components/DragDropImages";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";

const EditNewsAndBlogPage = () => {
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
    watch,
    control,
  } = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      content: "",
      categories: [],
      images: [],
      type: "",
      author: "",
      metadata: {
        title: "",
        description: "",
      },
      slug: "",
      posted_date: dayjs(new Date()),
    },
  });
  const handleEdit = async (data) => {
    try {
      data.metadata = JSON.stringify(data.metadata);
      await apis.updateNewsAndBlog(id, data);
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
            newsAndBlog: {
              title,
              subtitle,
              content,
              categories,
              images,
              type,
              author,
              posted_date,
              metadata,
              slug,
            },
          },
        } = await apis.getNewsAndBlogById(id);
        console.log(content);
        setValue("title", title);
        setValue("subtitle", subtitle);
        setValue("content", content);
        setValue("categories", categories);
        setValue("type", type);
        setValue("images", images || []);
        setValue("author", author);
        setValue("posted_date", dayjs(posted_date));
        setValue("metadata", JSON.parse(metadata));
        setValue("slug", slug || "");
        const {
          data: { categories: data },
        } = await apis.getCategories("?type=news_blog");
        setCategories(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [setValue, id]);

  return (
    <Box>
      <Card>
        <CardHeader title="Edit News and blog" />
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
                  label="Title"
                  {...register("title", {
                    required: "This Field is required",
                  })}
                  helperText={errors?.title?.message}
                  error={!!errors.title}
                />
                <TextField
                  label="Subtitle"
                  multiline
                  rows={3}
                  {...register("subtitle", {
                    required: "This Field is required",
                  })}
                  helperText={errors?.subtitle?.message}
                  error={!!errors.subtitle}
                />
                <Box height="fit-content" pt={2}>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <ReactQuill
                        placeholder="Type content here"
                        theme="snow"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </Box>
                <TextField
                  label="Author"
                  {...register("author", {
                    required: "This Field is required",
                  })}
                  helperText={errors?.author?.message}
                  error={!!errors.author}
                />
                <Controller
                  name="categories"
                  control={control}
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
                      renderOption={(props, option, { selected }) => (
                        <li {...props} style={{ height: 40 }}>
                          <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
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
                          label="Select categories"
                          placeholder="Category"
                          error={!!errors.categories}
                          helperText={errors.categories?.message}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="type"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "This field is required.",
                    },
                  }}
                  render={({ field: { value, onChange } }) => (
                    <FormControl variant="standard">
                      <InputLabel>Type</InputLabel>
                      <Select value={value} onChange={onChange} label="Type">
                        <MenuItem value="news">News</MenuItem>
                        <MenuItem value="blog">Blog</MenuItem>
                      </Select>
                      {errors?.type && (
                        <FormHelperText error>
                          {errors?.type.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                <Controller
                  name="posted_date"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      label="Posted date"
                      value={value}
                      onChange={(newValue) => onChange(newValue)}
                    />
                  )}
                />
                <DragDropImages
                  imageType="news_blog"
                  watch={watch}
                  setValue={setValue}
                />
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

export default EditNewsAndBlogPage;
