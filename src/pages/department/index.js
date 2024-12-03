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
import { formatDate } from "../../utils";
import QuillContent from "../../components/QuillContent";

const DepartmentPage = () => {
  const { isLoading } = useSelector((state) => state.common);
  const { institute_id } = useParams();
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
    { field: "name", headerName: "Name", width: 300 },
    {
      field: "address",
      headerName: "Address",
      width: 300,
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
              disabled={String(params.row.level) === "1"}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                navigate(
                  `/institute/${institute_id}/department/${params.id}/edit`
                );
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleViewDepartment(params.row)}>
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
      await apis.deleteDepartments(data.join());
      init();
      setOpenDialog({ ...openDialog, delete: false, overview: false });
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewDepartment = (row) => async (event) => {
    try {
      setSelectedRow(row);
      setOpenDialog({ ...openDialog, overview: true });
    } catch (error) {}
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, [institute_id]);

  const init = async () => {
    try {
      const {
        data: { departments },
      } = await apis.getDepartments(`?institutes=${institute_id}`);
      setRows(departments);
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
                      `/institute/${institute_id}/department/${selectedRow._id}/edit`
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
                <Typography variant="h6">Basic information</Typography>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Name:
                  </Typography>
                  <Typography variant="body2">{selectedRow?.name}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Deacription:
                  </Typography>
                  <QuillContent content={selectedRow?.description} />
                </Stack>
                {selectedRow?.simulators.length > 0 && (
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Typography variant="body2" fontWeight={600} minWidth={120}>
                      Simulators:
                    </Typography>
                    {selectedRow?.simulators.map((e, index) => (
                      <Chip
                        label={`${e?.simulator?.name} (${
                          e?.registration || "--"
                        })`}
                        key={`simulator-${index}`}
                      />
                    ))}
                  </Stack>
                )}
                {selectedRow?.airplanes.length > 0 && (
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Typography variant="body2" fontWeight={600} minWidth={120}>
                      Airplanes:
                    </Typography>
                    {selectedRow?.airplanes.map((e, index) => (
                      <Chip
                        label={`${e?.airplane?.name} (${
                          e?.registration || "--"
                        })`}
                        key={`simulator-${index}`}
                      />
                    ))}
                  </Stack>
                )}
              </Stack>
              <Divider />
              <Stack spacing={0.5}>
                <Typography variant="h6">Address information</Typography>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Address:
                  </Typography>
                  <Typography variant="body2">
                    {selectedRow?.address}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    City:
                  </Typography>
                  <Typography variant="body2">{selectedRow?.city}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    State:
                  </Typography>
                  <Typography variant="body2">{selectedRow?.state}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Postal code:
                  </Typography>
                  <Typography variant="body2">
                    {selectedRow?.postal_code}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Country:
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <img
                      style={{ width: 20, height: 12 }}
                      loading="lazy"
                      width="20"
                      src={`https://flagcdn.com/w20/${JSON.parse(
                        selectedRow?.country
                      ).code.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w40/${JSON.parse(
                        selectedRow?.country
                      ).code.toLowerCase()}.png 2x`}
                      alt=""
                    />
                    <Typography variant="body2">
                      {JSON.parse(selectedRow?.country).label} (
                      {JSON.parse(selectedRow?.country).code}) +
                      {JSON.parse(selectedRow?.country).phone}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Divider />
              <Stack spacing={0.5}>
                <Typography variant="h6">Contact</Typography>
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
                    Website:
                  </Typography>
                  <Typography variant="body2">
                    {selectedRow?.website_url}
                  </Typography>
                </Stack>
              </Stack>
              <Divider />
              {selectedRow?.metadata && (
                <>
                  <Stack
                    direction="column"
                    spacing={0.5}
                    alignItems="flex-start"
                  >
                    <Typography variant="h6">Seo medadata</Typography>
                    <Stack direction="row" spacing={0.5}>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        minWidth={120}
                      >
                        Title:
                      </Typography>
                      <Typography variant="body2">
                        {JSON.parse(selectedRow?.metadata).title}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5}>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        minWidth={120}
                      >
                        Description:
                      </Typography>
                      <Typography variant="body2">
                        {JSON.parse(selectedRow?.metadata).description}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5}>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        minWidth={120}
                      >
                        Slug:
                      </Typography>
                      <Typography variant="body2">
                        {selectedRow?.slug}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Divider />
                </>
              )}

              <Stack spacing={0.5}>
                <Typography variant="h6">Others</Typography>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Created at:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(new Date(selectedRow?.created_at))}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" fontWeight={600} minWidth={120}>
                    Updated at:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(new Date(selectedRow?.updated_at))}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={openDialog.delete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete departments</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to delete selected departments?
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
                navigate(`/institute/${institute_id}/department/create`)
              }
              startIcon={<AddIcon />}
            >
              Create Department
            </Button>
          </Box>
        </Stack>
        <Box height={500}>
          <DataGrid
            sx={{ height: "100%" }}
            localeText={{ noRowsLabel: "No departments" }}
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

export default DepartmentPage;
