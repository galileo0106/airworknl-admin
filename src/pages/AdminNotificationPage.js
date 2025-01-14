import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { apis } from "../apis";
import { socket } from "../apis/socket";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import { useNavigate } from "react-router-dom";
import { getNotificationCounts } from "../redux/actions/commonActions";

const AdminNotificationPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState({
    approve: false,
    block: false,
    delete: false,
    markAsLead: false,
  });

  const handleMardAsReadNotification = async (notification) => {
    try {
      setIsLoading({ ...isLoading, markAsLead: true });
      await apis.updateNotification(notification._id, { is_read: true });
      getNotifications();
      getNotificationCounts();
    } catch (error) {
    } finally {
      setIsLoading({ ...isLoading, markAsLead: false });
    }
  };
  const handleDeleteNotification = async (notification) => {
    try {
      setIsLoading({ ...isLoading, delete: true });
      await apis.deleteNotifications(notification._id);
      getNotifications();
      getNotificationCounts();
    } catch (error) {
    } finally {
      setIsLoading({ ...isLoading, delete: false });
    }
  };
  const getNotifications = async () => {
    try {
      const {
        data: { notifications },
      } = await apis.getNotifications();
      setNotifications(notifications);
    } catch (error) { }
  };
  const handleViewMore = async (notification) => {
    switch (notification.type) {
      case "INSTITUTE_REVIEW":
        navigate(
          `/institute/${JSON.parse(notification.content).post._id}/review/${JSON.parse(notification.content)._id
          }/edit`
        );
        break;
      case "EDUCATION_REVIEW":
        navigate(
          `/institute/${JSON.parse(notification.content).post.institute._id
          }/education/${JSON.parse(notification.content).post._id}/review/${JSON.parse(notification.content)._id
          }/edit`
        );
        break;
      case "PLATFORM_REVIEW":
        navigate(`/platform_review/${JSON.parse(notification.content)._id}/edit`);
        break;
      case "INSTITUTE_INFO_REQUEST":
        navigate(`/info_request/${JSON.parse(notification.content)._id}/edit`);
        break;
      case "EDUCATION_INFO_REQUEST":
        navigate(`/info_request/${JSON.parse(notification.content)._id}/edit`);
        break;
      case "AIRPLANE_INFO_REQUEST":
        navigate(`/info_request/${JSON.parse(notification.content)._id}/edit`);
        break;
      case "SIMULATOR_INFO_REQUEST":
        navigate(`/info_request/${JSON.parse(notification.content)._id}/edit`);
        break;
      case "CONTACT_REQUEST":
        navigate(`/contact_request`);
        break;
      case "PREMIUM_REQUEST":
        navigate(`/contact_request`);
        break;
      default:
        break;
    }
    handleMardAsReadNotification(notification);
  };
  useEffect(() => {
    getNotifications();
    socket.on("NEW_REVIEW_NOTIFICATION", () => {
      getNotifications();
    });
    socket.on("NEW_PLATFORM_REVIEW_NOTIFICATION", () => {
      getNotifications();
    });
    socket.on("NEW_INFO_REQUEST", () => {
      getNotifications();
    });
    socket.on("NEW_CONTACT_REQUEST", () => {
      getNotifications();
    });
    socket.on("NEW_PREMIUM_REQUEST", () => {
      getNotifications();
    });
  }, []);
  return (
    <Box>
      <Card sx={{ minHeight: 700 }}>
        <CardContent>
          <Typography variant="h5" mb={4}>
            Admin notification
          </Typography>
          <Stack spacing={1}>
            {notifications.map((notification, index) => (
              <Box
                key={`notification-${index}`}
                p={2}
                border={`1px solid ${notification.is_read
                  ? theme.palette.divider
                  : theme.palette.secondary.light
                  }`}
                borderRadius={1}
                width="100%"
                maxWidth={700}
              >
                <Stack spacing={1}>
                  <Typography variant="body1" fontWeight={600}>
                    {notification.title}
                  </Typography>
                  <Typography variant="body2">
                    {notification.message}
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      onClick={() => {
                        handleViewMore(notification);
                      }}
                    >
                      View more
                    </Button>
                    <Tooltip title="Delete notification">
                      <LoadingButton
                        color="error"
                        sx={{ minWidth: 0, borderRadius: "50%" }}
                        onClick={() => handleDeleteNotification(notification)}
                        loading={isLoading.delete}
                      >
                        <DeleteIcon />
                      </LoadingButton>
                    </Tooltip>

                    {!notification.is_read && (
                      <Tooltip title="Mark as read">
                        <LoadingButton
                          sx={{ minWidth: 0, borderRadius: "50%" }}
                          onClick={() =>
                            handleMardAsReadNotification(notification)
                          }
                          loading={isLoading.markAsLead}
                        >
                          <DoneIcon />
                        </LoadingButton>
                      </Tooltip>
                    )}
                  </Stack>
                </Stack>
              </Box>
            ))}
            {notifications.length === 0 && (
              <Typography variant="body1">No notifications</Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminNotificationPage;
