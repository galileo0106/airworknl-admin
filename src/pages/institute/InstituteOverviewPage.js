import { Checkbox, Chip, Divider, Rating, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import ImagePreview from "../../components/ImagePreview";
import QuillContent from "../../components/QuillContent";

const InstituteOverviewPage = ({ institute }) => {
  return (
    <Box>
      {institute && (
        <Stack spacing={1}>
          <Typography variant="h6">Basic information</Typography>
          <Stack direction="row" spacing={0.5} alignItems="flex-start">
            <Typography variant="body2" fontWeight={600} minWidth={120}>
              Name:
            </Typography>
            <Typography variant="body2">{institute.name}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="flex-start">
            <Typography variant="body2" fontWeight={600} minWidth={120}>
              Description:
            </Typography>
            <QuillContent content={institute.description} />
          </Stack>
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            flexWrap="wrap"
          >
            <Typography variant="body2" fontWeight={600} minWidth={120}>
              Institute types:
            </Typography>
            <Stack direction="row" spacing={0.5}>
              {institute.institute_types.map((e, index) => (
                <Chip label={e.name} key={`institute-type-${index}`} />
              ))}
            </Stack>
          </Stack>
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            flexWrap="wrap"
          >
            <Typography variant="body2" fontWeight={600} minWidth={120}>
              Certificates:
            </Typography>
            <Stack direction="row" spacing={0.5}>
              {institute.certificates.map((e, index) => (
                <Chip label={e.name} key={`institute-type-${index}`} />
              ))}
            </Stack>
          </Stack>
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            flexWrap="wrap"
          >
            <Typography variant="body2" fontWeight={600} minWidth={120}>
              Notification emails:
            </Typography>
            <Stack direction="row" spacing={0.5}>
              {institute.notification_emails?.map((e, index) => (
                <Chip label={e} key={`notification-email-${index}`} />
              ))}
            </Stack>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="flex-start">
            <Typography variant="body2" fontWeight={600} minWidth={120}>
              Community:
            </Typography>
            <Typography variant="body2">{institute.community}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="body2" fontWeight={600} minWidth={120}>
              Rating:
            </Typography>
            <Rating
              name="Rating"
              value={institute.rating}
              size="large"
              readOnly
              precision={0.5}
            />
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="flex-start">
            <Typography variant="body2" fontWeight={600} minWidth={120}>
              Founded at:
            </Typography>
            <Typography variant="body2">
              {institute.founded_at?.split("T")[0]}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="body2" fontWeight={600} minWidth={120}>
              Members only:
            </Typography>
            <Checkbox
              checked={institute.members_only}
              size="small"
              sx={{ width: 20, height: 20 }}
            />
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="body2" fontWeight={600} minWidth={120}>
              Premium:
            </Typography>
            <Checkbox
              checked={institute.premium}
              sx={{ width: 20, height: 20 }}
            />
          </Stack>
          <Divider />
          <Stack spacing={2}>
            <Typography variant="h6">Images</Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              {institute.images &&
                institute.images.map((image, index) => (
                  <ImagePreview
                    image={image}
                    hideDeleteBtn
                    key={`image-institute-${index}`}
                  />
                ))}
            </Box>
          </Stack>
          <Divider />
          <Typography variant="h6">Address information</Typography>
          <Stack direction="row" spacing={0.5} alignItems="flex-start">
            <Typography variant="body2" fontWeight={600} minWidth={120}>
              Address:
            </Typography>
            <Typography variant="body2">{institute.address}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="flex-start">
            <Typography variant="body2" fontWeight={600} minWidth={120}>
              City:
            </Typography>
            <Typography variant="body2">{institute.city}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="flex-start">
            <Typography variant="body2" fontWeight={600} minWidth={120}>
              State:
            </Typography>
            <Typography variant="body2">{institute.state}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="flex-start">
            <Typography variant="body2" fontWeight={600} minWidth={120}>
              Postal code:
            </Typography>
            <Typography variant="body2">{institute.postal_code}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="flex-start">
            <Typography variant="body2" fontWeight={600} minWidth={120}>
              Country:
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <img
                style={{ width: 20, height: 12 }}
                loading="lazy"
                width="20"
                src={`https://flagcdn.com/w20/${JSON.parse(
                  institute.country,
                ).code.toLowerCase()}.png`}
                srcSet={`https://flagcdn.com/w40/${JSON.parse(
                  institute.country,
                ).code.toLowerCase()}.png 2x`}
                alt=""
              />
              <Typography variant="body2">
                {JSON.parse(institute.country).label} (
                {JSON.parse(institute.country).code}) +
                {JSON.parse(institute.country).phone}
              </Typography>
            </Stack>
          </Stack>
          <Divider />
          <Stack direction="column" spacing={0.5} alignItems="flex-start">
            <Typography variant="h6">Seo medadata</Typography>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="body2" fontWeight={500} minWidth={120}>
                Title:
              </Typography>
              <Typography variant="body2">
                {JSON.parse(institute.metadata).title}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="body2" fontWeight={500} minWidth={120}>
                Description:
              </Typography>
              <Typography variant="body2">
                {JSON.parse(institute.metadata).description}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="body2" fontWeight={500} minWidth={120}>
                Slug:
              </Typography>
              <Typography variant="body2">{institute.slug}</Typography>
            </Stack>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default InstituteOverviewPage;
