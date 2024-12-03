import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { apis } from "../../apis";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useSearchParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import EducationOverviewPage from "./EducationOverviewPage";
import EducationReviewPage from "../educationReview";
import InfoRequestPage from "../infoRequest";

const EducationDetailsPage = () => {
  const [openDialog, setOpenDialog] = useState({
    delete: false,
  });
  const [currentTab, setCurrentTab] = useState(null);
  const navigate = useNavigate();
  const { institute_id, education_id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const deleteForm = useForm();
  const [education, setEducation] = useState(null);
  const [institute, setInstitute] = useState(null);

  const handleChangeTab = (event, newValue) => {
    if (newValue === "info_requests")
      setSearchParams({ tab: newValue, post_type: "Education" });
    else setSearchParams({ tab: newValue });
  };

  const handleCloseDeleteDialog = () => {
    setOpenDialog({ ...openDialog, delete: false });
  };

  const handleDeleteInstitute = async () => {
    try {
      await apis.deleteInstitutes(institute_id);
      setOpenDialog({ ...openDialog, delete: false });
      navigate(`/institute/${institute_id}/education`);
    } catch (error) {
      console.log(error);
    }
  };

  const init = async () => {
    try {
      const {
        data: { education },
      } = await apis.getEducationById(education_id);
      const {
        data: { institute },
      } = await apis.getInstituteById(institute_id);
      setEducation(education);
      setInstitute(institute);
    } catch (error) {}
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (searchParams.get("tab")) setCurrentTab(searchParams.get("tab"));
    else {
      navigate(
        `/institute/${institute_id}/education/${education_id}/view?tab=overview`
      );
    }
  }, [searchParams, institute_id, education_id]);
  return (
    <Box>
      <Dialog open={openDialog.delete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete education</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We will delete all related information to this education forever.
            <br />
            Are you sure to delete this education?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            component="form"
            onSubmit={deleteForm.handleSubmit(handleDeleteInstitute)}
          >
            <Button variant="text" onClick={handleCloseDeleteDialog}>
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              color="error"
              type="submit"
              loading={deleteForm.formState.isSubmitting}
            >
              Delete
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
      {education && (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack spacing={2} justifyContent="space-between">
                <Breadcrumbs separator="›">
                  <Link
                    variant="h6"
                    onClick={() => navigate("/institute")}
                    sx={{ cursor: "pointer" }}
                  >
                    Institutes
                  </Link>
                  <Link
                    variant="h6"
                    onClick={() =>
                      navigate(`/institute/${institute_id}/view?tab=overview`)
                    }
                    sx={{ cursor: "pointer" }}
                  >
                    {institute.name}
                  </Link>
                  <Link
                    variant="h6"
                    onClick={() =>
                      navigate(`/institute/${institute_id}/view?tab=educations`)
                    }
                    sx={{ cursor: "pointer" }}
                  >
                    Educations
                  </Link>
                  <Typography variant="h6">{education.name}</Typography>
                  <Typography variant="h6">{currentTab}</Typography>
                </Breadcrumbs>
                <Stack spacing={1} direction="row" alignItems="center">
                  <Button
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={(e) => {
                      setOpenDialog({ ...openDialog, delete: true });
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() =>
                      navigate(
                        `/institute/${institute_id}/education/${education_id}/edit`
                      )
                    }
                  >
                    Edit education
                  </Button>
                </Stack>
              </Stack>
              <TabContext value={currentTab}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList onChange={handleChangeTab}>
                    <Tab
                      label="Overview"
                      value="overview"
                      sx={{ textTransform: "none" }}
                    />
                    <Tab
                      label="Reviews"
                      value="reviews"
                      sx={{ textTransform: "none" }}
                    />
                    <Tab
                      label="Information requests"
                      value="info_requests"
                      sx={{ textTransform: "none" }}
                    />
                  </TabList>
                </Box>
                <TabPanel value="overview" sx={{ p: 0 }}>
                  <EducationOverviewPage education={education} />
                </TabPanel>
                <TabPanel value="reviews" sx={{ p: 0 }}>
                  <EducationReviewPage />
                </TabPanel>
                <TabPanel value="info_requests" sx={{ p: 0 }}>
                  <InfoRequestPage requestType="Education" />
                </TabPanel>
              </TabContext>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default EducationDetailsPage;
