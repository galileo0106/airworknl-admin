import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import { apis } from "../../apis";
import { useSelector } from "react-redux";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CloseIcon from "@mui/icons-material/Close";
import QuillContent from "../../components/QuillContent";

const EducationReviewPage = () => {
  const { isLoading } = useSelector((state) => state.common);
  const { institute_id, education_id } = useParams();
  const [rows, setRows] = useState([]);
  const deleteForm = useForm();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openDialog, setOpenDialog] = useState({
    delete: false,
    overview: false,
  });

  const handleCloseDeleteDialog = () => {
    setOpenDialog({ ...openDialog, delete: false });
  };
  const handleCloseOverviewDialog = () => {
    setOpenDialog({ ...openDialog, overview: false });
  };
  const columns = [
    { field: "reviewer_name", headerName: "Reviewer name", width: 200 },
    {
      field: "reviewer_email",
      headerName: "Reviewer email",
      width: 200,
    },
    {
      field: "review_date",
      headerName: "Review date",
      type: "date",
      valueGetter: (params) => new Date(params.value),
    },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      width: 150,
      renderCell: (params) => (
        <Rating
          value={params.value}
          readOnly
          precision={0.5} // or as per your requirement
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      type: "string",
      width: 150,
      renderCell: (params) => {
        let backgroundColor;
        switch (params.value) {
          case "PENDING":
            backgroundColor = "orange";
            break;
          case "APPROVED":
            backgroundColor = "green";
            break;
          case "BLOCKED":
            backgroundColor = "red";
            break;
          default:
            backgroundColor = "transparent";
        }
        return (
          <div
            style={{
              backgroundColor,
              padding: "0.8em 1em", // Optional for spacing inside cell
              // borderRadius: "4px", // Optional if you want rounded corners
              textAlign: "center", // To center the status text
              color: "white",
              minWidth: 100,
            }}
          >
            {params.value.toUpperCase()}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={(e) => {
                setSelectedRow(params.row);
                setOpenDialog({ ...openDialog, delete: true });
              }}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                navigate(
                  `/review/${params.id}/edit`
                );
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleViewReview(params.row)}>
              <RemoveRedEyeIcon />
            </IconButton>
          </Stack>
        );
      },
    },
  ];
  const handleDelete = async () => {
    try {
      var data;
      if (selectedRow) data = [selectedRow._id];
      else data = rowSelectionModel;
      await apis.deleteReviews(data.join());
      init();
      setOpenDialog({ ...openDialog, delete: false, overview: false });
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewReview = (row) => async (event) => {
    try {
      setSelectedRow(row);
      setOpenDialog({ ...openDialog, overview: true });
    } catch (error) {}
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, [education_id]);

  const init = async () => {
    try {
      const {
        data: { reviews },
      } = await apis.getReviews(`?posts=${education_id}&type=Education`);
      setRows(reviews);
    } catch (error) {}
  };

  return (
    <Box>
      {selectedRow && (
        <Dialog
          open={openDialog.overview}
          onClose={handleCloseOverviewDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogContent>
            <Stack spacing={1}>
              <Stack
                justifyContent="space-between"
                direction="row"
                alignItems="center"
              >
                <Typography variant="h6" fontWeight={600}>
                  Overview of {selectedRow?.name}
                </Typography>
                <IconButton onClick={handleCloseOverviewDialog}>
                  <CloseIcon />
                </IconButton>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="text"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    navigate(
                      `/institute/${institute_id}/education/${education_id}/review/${selectedRow._id}/edit`
                    );
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="text"
                  startIcon={<DeleteIcon />}
                  color="error"
                  onClick={() => {
                    setOpenDialog({ ...openDialog, delete: true });
                  }}
                >
                  Delete
                </Button>
              </Stack>
              <Divider />
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Reviewer name:
                  </Typography>
                  <Typography variant="body2">
                    {selectedRow?.reviewer_name}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Reviewer email:
                  </Typography>
                  <Typography variant="body2">
                    {selectedRow?.reviewer_email}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Reviewer type:
                  </Typography>
                  <Typography variant="body2">
                    {selectedRow?.reviewer_type}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Rating:
                  </Typography>
                  <Rating
                    value={selectedRow?.rating}
                    readOnly
                    precision={0.5}
                  />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    comment:
                  </Typography>
                  <QuillContent content={selectedRow?.comment} />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Status:
                  </Typography>
                  <Typography variant="body2">{selectedRow?.status}</Typography>
                </Stack>
              </Stack>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={openDialog.delete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete reviews</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to delete selected reviews?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            component="form"
            onSubmit={deleteForm.handleSubmit(handleDelete)}
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

      <Stack direction="column" spacing={2}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Box gap={1} display="flex">
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setOpenDialog({ ...openDialog, delete: true });
              }}
              disabled={!rowSelectionModel.length}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                navigate(
                  `/institute/${institute_id}/education/${education_id}/review/create`
                )
              }
              startIcon={<AddIcon />}
            >
              Create Review
            </Button>
          </Box>
        </Stack>
        <Box height={500}>
          <DataGrid
            sx={{ height: "100%" }}
            localeText={{ noRowsLabel: "No reviews" }}
            rows={rows}
            columns={columns}
            getRowId={(params) => params._id}
            scrollbarSize={3}
            checkboxSelection
            pageSizeOptions={[20, 50, 100]}
            loading={isLoading}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 20, page: 0 },
              },
            }}
            density="compact"
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            disableRowSelectionOnClick
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default EducationReviewPage;
