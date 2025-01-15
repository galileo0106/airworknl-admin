import { Checkbox, Chip, Divider, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import QuillContent from "../../components/QuillContent";
import ImagePreview from "../../components/ImagePreview";

const EducationOverviewPage = ({ education }) => {
  return (
    <Box>
      {education && (
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Typography variant="h6">Basic information</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Typography variant="body2" fontWeight={600} minWidth={120}>
                Departments:
              </Typography>
              {education?.departments.map((e, index) => (
                <Chip label={e?.name || ""} key={`category-${index}`} />
              ))}
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" fontWeight={600} minWidth={120}>
                Description:
              </Typography>
              <QuillContent content={education?.description} />
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" fontWeight={600} minWidth={120}>
                Code:
              </Typography>
              <Typography variant="body2">{education?.code}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Typography variant="body2" fontWeight={600} minWidth={120}>
                Categories:
              </Typography>
              {education?.categories.map((e, index) => (
                <Chip label={e?.name || ""} key={`category-${index}`} />
              ))}
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Typography variant="body2" fontWeight={600} minWidth={120}>
                Training forms:
              </Typography>
              {education?.training_forms.map((e, index) => (
                <Chip label={e?.name || ""} key={`category-${index}`} />
              ))}
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Typography variant="body2" fontWeight={600} minWidth={120}>
                Languages:
              </Typography>
              {education?.languages.map((e, index) => (
                <Chip
                  label={JSON.parse(e)?.name || ""}
                  key={`category-${index}`}
                />
              ))}
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" fontWeight={600} minWidth={120}>
                Price:
              </Typography>
              <Typography variant="body2">{education?.price} $</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" fontWeight={600} minWidth={120}>
                Funding:
              </Typography>
              <Checkbox
                checked={education?.funding}
                sx={{ width: 20, height: 20 }}
              />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" fontWeight={600} minWidth={120}>
                Premium:
              </Typography>
              <Checkbox
                checked={education?.premium}
                sx={{ width: 20, height: 20 }}
              />
            </Stack>
          </Stack>
          <Divider />
          <Stack spacing={2}>
            <Typography variant="h6">Images</Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              {education.images &&
                education.images.map((image, index) => (
                  <ImagePreview
                    image={image}
                    hideDeleteBtn
                    key={`image-education-${index}`}
                  />
                ))}
            </Box>
          </Stack>
          <Divider />
          <Stack direction="column" spacing={0.5} alignItems="flex-start">
            <Typography variant="h6">Seo medadata</Typography>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" fontWeight={500} minWidth={120}>
                Title:
              </Typography>
              <Typography variant="body2">
                {JSON.parse(education.metadata).title}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" fontWeight={500} minWidth={120}>
                Description:
              </Typography>
              <Typography variant="body2">
                {JSON.parse(education.metadata).description}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" fontWeight={500} minWidth={120}>
                Slug:
              </Typography>
              <Typography variant="body2">{education.slug}</Typography>
            </Stack>
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="h6">Others</Typography>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" fontWeight={600} minWidth={120}>
                Created at:
              </Typography>
              <Typography variant="body2">{education?.created_at}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" fontWeight={600} minWidth={120}>
                Updated at:
              </Typography>
              <Typography variant="body2">{education?.updated_at}</Typography>
            </Stack>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default EducationOverviewPage;
