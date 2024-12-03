import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { apis } from "../../apis";
import { useSelector } from "react-redux";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CloseIcon from "@mui/icons-material/Close";
import QuillContent from "../../components/QuillContent";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { socket } from "../../apis/socket";

const ContactRequestPage = () => {
  const { isLoading } = useSelector((state) => state.common);
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
    { field: "firstname", headerName: "First name", width: 100 },
    { field: "lastname", headerName: "First name", width: 100 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone number", width: 180 },
    {
      field: "type",
      headerName: "Request type",
      type: "string",
      width: 180,
      renderCell: (params) => {
        let backgroundColor;
        switch (params.value) {
          case "CONTACT_REQUEST":
            backgroundColor = "green";
            break;
          case "PREMIUM_REQUEST":
            backgroundColor = "orange";
            break;
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
              width: '100%'
            }}
          >
            {params.value.toUpperCase()}
          </div>
        );
      },
    },
    {
      field: "created_at",
      headerName: "Submitted date",
      type: "date",
      valueGetter: (params) => new Date(params.value),
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
      await apis.deleteContactRequests(data.join());
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
    socket.on("NEW_CONTACT_REQUEST", () => {
      init();
    });
    socket.on("NEW_PREMIUM_REQUEST", () => {
      init();
    });
    // eslint-disable-next-line
  }, []);

  const init = async () => {
    try {
      const {
        data: { contactRequests },
      } = await apis.getContactRequests();
      setRows(contactRequests);
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
                  Overview
                </Typography>
                <IconButton onClick={handleCloseOverviewDialog}>
                  <CloseIcon />
                </IconButton>
              </Stack>
              <Stack direction="row" spacing={1}>
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
                    First name:
                  </Typography>
                  <Typography variant="body2">
                    {selectedRow?.firstname}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Last name:
                  </Typography>
                  <Typography variant="body2">
                    {selectedRow?.lastname}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Email:
                  </Typography>
                  <Typography variant="body2">{selectedRow?.email}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Phone number:
                  </Typography>
                  <Typography variant="body2">
                    {selectedRow?.phone || "--"}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Message:
                  </Typography>
                  <QuillContent content={selectedRow?.message} />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Created date:
                  </Typography>
                  <Typography variant="body2">
                    {selectedRow?.created_at}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={openDialog.delete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete contact requests</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to delete selected contact requests?
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

      <Card>
        <CardContent>
          <Stack direction="column" spacing={2}>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton onClick={() => navigate(-1)}>
                  <ArrowBackIosNewIcon />
                </IconButton>
                <Typography variant="h6">Manage contact requests</Typography>
              </Stack>
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
              </Box>
            </Stack>
            <Box height={700}>
              <DataGrid
                sx={{ height: "100%" }}
                localeText={{ noRowsLabel: "No contact requests" }}
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default ContactRequestPage;
