import {
  Box,
  Button,
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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import SendIcon from "@mui/icons-material/Send";

const InfoRequestPage = () => {
  const { isLoading } = useSelector((state) => state.common);
  const [rows, setRows] = useState([]);
  const deleteForm = useForm();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    institute_id,
    education_id,
    institute_airplane_id,
    institute_simulator_id,
  } = useParams();
  const postType = searchParams.get("post_type");
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openDialog, setOpenDialog] = useState({
    delete: false,
    overview: false,
    emailSend: false,
    emailAlreadySent: false,
  });

  const sendMailForm = useForm();

  const handleCloseDeleteDialog = () => {
    setOpenDialog({ ...openDialog, delete: false });
  };
  const handleCloseOverviewDialog = () => {
    setOpenDialog({ ...openDialog, overview: false });
  };
  const columns = [
    { field: "firstname", headerName: "Firstname" },
    { field: "lastname", headerName: "Lastname" },
    {
      field: "post_type",
      headerName: "Type of post",
      width: 150,
    },
    {
      field: "post",
      headerName: "Post",
      width: 300,
      valueGetter: (params) =>
        params.value.name ||
        params.value?.airplane?.name ||
        params.value?.simulator?.name,
    },
    {
      field: "email_sent",
      headerName: "Email sent",
      type: 'boolean'
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={(e) => {
                setSelectedRow(params.row);
                setOpenDialog({ ...openDialog, delete: true });
              }}
              disabled={String(params.row.level) === "1"}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                navigate(`/info_request/${params.id}/edit`);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleViewInfoRequest(params.row)}>
              <RemoveRedEyeIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                if (params.row.email_sent)
                  setOpenDialog({ ...openDialog, emailAlreadySent: true });
                else {
                  setSelectedRow(params.row);
                  setOpenDialog({ ...openDialog, emailSend: true });
                }
              }}
            >
              <SendIcon />
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
      await apis.deleteInfoRequests(data.join());
      init();
      setOpenDialog({ ...openDialog, delete: false, overview: false });
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewInfoRequest = (row) => async (event) => {
    try {
      setSelectedRow(row);
      setOpenDialog({ ...openDialog, overview: true });
    } catch (error) {}
  };

  const handleEmailSend = async (data) => {
    try {
      await apis.sendEmailForInfoRequest(selectedRow?._id);
      init();
    } catch (error) {
    } finally {
      setOpenDialog({ ...openDialog, emailSend: false });
    }
  };

  const getRequestTypes = (types) => {
    let temp = [];
    types.forEach((e) => {
      temp.push(e.name);
    });
    return temp.join(", ");
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, [postType]);

  const init = async () => {
    try {
      let postId = "";
      switch (postType) {
        case "Institute":
          postId = institute_id;
          break;
        case "Education":
          postId = education_id;
          break;
        case "InstituteAirplane":
          postId = institute_airplane_id;
          break;
        case "InstituteSimulator":
          postId = institute_simulator_id;
          break;
        default:
          break;
      }
      const {
        data: { infoRequests },
      } = await apis.getInfoRequests(`?posts=${postId || ""}`);
      setRows(infoRequests);
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
                  startIcon={<EditIcon />}
                  onClick={() => {
                    navigate(`/info_request/${selectedRow._id}/edit`);
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
                    Request types:
                  </Typography>
                  <Typography variant="body2">
                    {getRequestTypes(selectedRow?.types)}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Firstname:
                  </Typography>
                  <Typography variant="body2">
                    {selectedRow?.firstname}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Lastname:
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
                    Phone:
                  </Typography>
                  <Typography variant="body2">{selectedRow?.phone}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Message:
                  </Typography>
                  <QuillContent content={selectedRow?.message} />
                </Stack>
              </Stack>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
      <Dialog
        open={openDialog.emailAlreadySent}
        onClose={() =>
          setOpenDialog({ ...openDialog, emailAlreadySent: false })
        }
      >
        <DialogTitle>Email already sent</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            We have sent email already for this information request.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={() =>
              setOpenDialog({ ...openDialog, emailAlreadySent: false })
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDialog.emailSend}
        onClose={() => setOpenDialog({ ...openDialog, emailSend: false })}
      >
        <DialogTitle>Send email</DialogTitle>
        <DialogContent>
          <Stack
            spacing={1}
            component="form"
            onSubmit={sendMailForm.handleSubmit(handleEmailSend)}
          >
            <Typography variant="body1">
              Are you going to send an email for this information request?
            </Typography>
            <Typography variant="body1">
              Please check this information request again to determine if it is
              not spam or if there is anything you need to change.
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                variant="text"
                onClick={() =>
                  setOpenDialog({ ...openDialog, emailSend: false })
                }
              >
                Close
              </Button>
              <LoadingButton
                loading={sendMailForm.formState.isSubmitting}
                variant="contained"
                type="submit"
              >
                Send email
              </LoadingButton>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog.delete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete infoRequests</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to delete selected infoRequests?
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
              onClick={() => {
                let postId = "";
                switch (postType) {
                  case "Institute":
                    postId = institute_id;
                    break;
                  case "Education":
                    postId = education_id;
                    break;
                  case "InstituteAirplane":
                    postId = institute_airplane_id;
                    break;
                  case "InstituteSimulator":
                    postId = institute_simulator_id;
                    break;
                  default:
                    break;
                }
                navigate(
                  `/info_request/create?post_type=${
                    postType || "Institute"
                  }&post_id=${postId || ""}`
                );
              }}
              startIcon={<AddIcon />}
            >
              Create Information request
            </Button>
          </Box>
        </Stack>
        <Box height={500}>
          <DataGrid
            sx={{ height: "100%" }}
            localeText={{ noRowsLabel: "No infoRequests" }}
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

export default InfoRequestPage;
