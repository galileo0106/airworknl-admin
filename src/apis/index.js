import Axios from "axios";
import { store } from "../redux/store";
import {
  API_REQUEST,
  ERROR_RESPONSE,
  SUCCESS_RESPONSE,
} from "../redux/actionTypes";
import { enqueueSnackbar } from "notistack";

export const SERVER_URL =
  process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:5001";
const axios = Axios.create({
  baseURL: SERVER_URL,
  timeout: 100000,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
});

axios.interceptors.request.use((config) => {
  store.dispatch({ type: API_REQUEST, payload: true });
  let token = JSON.parse(localStorage.getItem("token"));
  config.headers.set("Authorization", `bearer ${token}`);
  return config;
});

axios.interceptors.response.use(
  (response) => {
    store.dispatch({ type: SUCCESS_RESPONSE, payload: response.data?.message });
    if (response.data.message)
      enqueueSnackbar({ variant: "success", message: response.data?.message });
    return response;
  },
  (error) => {
    console.log(error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.replace(window.location.origin + "/login");
    } else {
      store.dispatch({
        type: ERROR_RESPONSE,
        payload: error.response?.data.message || error.message,
      });
    }
    enqueueSnackbar({
      variant: "error",
      message: error.response?.data?.message || error.message,
    });
    return Promise.reject(error);
  },
);

//auth apis
const login = (data) => axios.post("/api/auth/login", data);
const register = (data) => axios.post("/api/auth/register", data);
const verifyEmail = (data) => axios.post(`/api/auth/verify-email/`, data);
const forgotPassword = (data) => axios.post(`/api/auth/forgot-password/`, data);
const resetPassword = (data) => axios.post("/api/auth/reset-password", data);
const sendEmail = (data) => axios.post("/api/auth/email-verification", data);
const updatePassword = (data) => axios.post("/api/auth/update-password", data);

const getFilterTypes = () => axios.get("/api/filter_types");

const getUserInfor = () => axios.get("/api/user");

const createEducation = (data) => axios.post("/api/education", data);
const getEducations = (query = "") => axios.get(`/api/education${query}`);
const getEducationById = (id) => axios.get(`/api/education/${id}`);
const updateEducation = (id, data) => axios.put(`/api/education/${id}`, data);
const deleteEducations = (ids) => axios.delete(`/api/education/${ids}`);

const getInstitutes = () => axios.get("/api/institute");
const getInstituteById = (id) => axios.get(`/api/institute/${id}`);
const createInstitute = (data) => axios.post("/api/institute", data);
const updateInstitute = (id, data) => axios.put(`/api/institute/${id}`, data);
const deleteInstitutes = (ids) => axios.delete(`/api/institute/${ids}`);

const getAddresses = () => axios.get("/api/address");
const getAddresseById = (id) => axios.get(`/api/address/${id}`);
const createAddress = (data) => axios.post("/api/address", data);
const updateAddress = (id, data) => axios.put(`/api/address/${id}`, data);
const deleteAddresses = (ids) => axios.delete(`/api/address/${ids}`);

const getCategories = (query = "") => axios.get(`/api/category${query}`);
const getCategoryById = (id) => axios.get(`/api/category/${id}`);
const createCategory = (data) => axios.post("/api/category", data);
const updateCategory = (id, data) => axios.put(`/api/category/${id}`, data);
const deleteCategories = (ids) => axios.delete(`/api/category/${ids}`);

const getTrainingForms = () => axios.get("/api/training_form");
const getTrainingFormById = (id) => axios.get(`/api/training_form/${id}`);
const createTrainingForm = (data) => axios.post("/api/training_form", data);
const updateTrainingForm = (id, data) =>
  axios.put(`/api/training_form/${id}`, data);
const deleteTrainingForms = (ids) => axios.delete(`/api/training_form/${ids}`);

const getAdmissionSelections = () => axios.get("/api/admission_selection");
const getAdmissionSelectionById = (id) =>
  axios.get(`/api/admission_selection/${id}`);
const createAdmissionSelection = (data) =>
  axios.post("/api/admission_selection", data);
const updateAdmissionSelection = (id, data) =>
  axios.put(`/api/admission_selection/${id}`, data);
const deleteAdmissionSelections = (ids) =>
  axios.delete(`/api/admission_selection/${ids}`);

const getCertificates = () => axios.get("/api/certificate");
const getCertificateById = (id) => axios.get(`/api/certificate/${id}`);
const createCertificate = (data) => axios.post("/api/certificate", data);
const updateCertificate = (id, data) =>
  axios.put(`/api/certificate/${id}`, data);
const deleteCertificates = (ids) => axios.delete(`/api/certificate/${ids}`);

const getInstituteTypes = () => axios.get("/api/institute_type");
const getInstituteTypeById = (id) => axios.get(`/api/institute_type/${id}`);
const createInstituteType = (data) => axios.post("/api/institute_type", data);
const updateInstituteType = (id, data) =>
  axios.put(`/api/institute_type/${id}`, data);
const deleteInstituteTypes = (ids) =>
  axios.delete(`/api/institute_type/${ids}`);

const getInstituteAirplanes = (query = "") =>
  axios.get(`/api/institute_airplane${query}`);
const getInstituteAirplaneById = (id) =>
  axios.get(`/api/institute_airplane/${id}`);
const createInstituteAirplane = (data) =>
  axios.post("/api/institute_airplane", data);
const updateInstituteAirplane = (id, data) =>
  axios.put(`/api/institute_airplane/${id}`, data);
const deleteInstituteAirplanes = (ids) =>
  axios.delete(`/api/institute_airplane/${ids}`);

const getInstituteSimulators = (query = "") =>
  axios.get(`/api/institute_simulator${query}`);
const getInstituteSimulatorById = (id) =>
  axios.get(`/api/institute_simulator/${id}`);
const createInstituteSimulator = (data) =>
  axios.post("/api/institute_simulator", data);
const updateInstituteSimulator = (id, data) =>
  axios.put(`/api/institute_simulator/${id}`, data);
const deleteInstituteSimulators = (ids) =>
  axios.delete(`/api/institute_simulator/${ids}`);

const getAirplanes = (query = "") => axios.get(`/api/airplane${query}`);
const getAirplaneById = (id) => axios.get(`/api/airplane/${id}`);
const createAirplane = (data) => axios.post("/api/airplane", data);
const updateAirplane = (id, data) => axios.put(`/api/airplane/${id}`, data);
const deleteAirplanes = (ids) => axios.delete(`/api/airplane/${ids}`);

const getAirplaneTypes = () => axios.get("/api/airplane_type");
const getAirplaneTypeById = (id) => axios.get(`/api/airplane_type/${id}`);
const createAirplaneType = (data) => axios.post("/api/airplane_type", data);
const updateAirplaneType = (id, data) =>
  axios.put(`/api/airplane_type/${id}`, data);
const deleteAirplaneTypes = (ids) => axios.delete(`/api/airplane_type/${ids}`);

const getSimulators = (query = "") => axios.get(`/api/simulator${query}`);
const getSimulatorById = (id) => axios.get(`/api/simulator/${id}`);
const createSimulator = (data) => axios.post("/api/simulator", data);
const updateSimulator = (id, data) => axios.put(`/api/simulator/${id}`, data);
const deleteSimulators = (ids) => axios.delete(`/api/simulator/${ids}`);

const getSimulatorTypes = () => axios.get("/api/simulator_type");
const getSimulatorTypeById = (id) => axios.get(`/api/simulator_type/${id}`);
const createSimulatorType = (data) => axios.post("/api/simulator_type", data);
const updateSimulatorType = (id, data) =>
  axios.put(`/api/simulator_type/${id}`, data);
const deleteSimulatorTypes = (ids) =>
  axios.delete(`/api/simulator_type/${ids}`);

const getEvents = () => axios.get("/api/event");
const getEventById = (id) => axios.get(`/api/event/${id}`);
const createEvent = (data) => axios.post("/api/event", data);
const updateEvent = (id, data) => axios.put(`/api/event/${id}`, data);
const deleteEvents = (ids) => axios.delete(`/api/event/${ids}`);

const getReviews = (query = "") => axios.get(`/api/review${query}`);
const getReviewById = (id) => axios.get(`/api/review/${id}`);
const createReview = (data) => axios.post("/api/review", data);
const updateReview = (id, data) => axios.put(`/api/review/${id}`, data);
const deleteReviews = (ids) => axios.delete(`/api/review/${ids}`);

const getPlatformReviews = (query = "") =>
  axios.get(`/api/platform_review${query}`);
const getPlatformReviewById = (id) => axios.get(`/api/platform_review/${id}`);
const createPlatformReview = (data) => axios.post("/api/platform_review", data);
const updatePlatformReview = (id, data) =>
  axios.put(`/api/platform_review/${id}`, data);
const deletePlatformReviews = (ids) =>
  axios.delete(`/api/platform_review/${ids}`);

const getMetadatas = () => axios.get("/api/metadata");
const getMetadataById = (id) => axios.get(`/api/metadata/${id}`);
const createMetadata = (data) => axios.post("/api/metadata", data);
const updateMetadata = (id, data) => axios.put(`/api/metadata/${id}`, data);
const deleteMetadatas = (ids) => axios.delete(`/api/metadata/${ids}`);

const getDepartments = (query = "") => axios.get(`/api/department${query}`);
const getDepartmentById = (id) => axios.get(`/api/department/${id}`);
const createDepartment = (data) => axios.post("/api/department", data);
const updateDepartment = (id, data) => axios.put(`/api/department/${id}`, data);
const deleteDepartments = (ids) => axios.delete(`/api/department/${ids}`);

const getNotifications = (query = "") => axios.get(`/api/notification${query}`);
const getNotificationById = (id) => axios.get(`/api/notification/${id}`);
const createNotification = (data) => axios.post("/api/notification", data);
const updateNotification = (id, data) =>
  axios.put(`/api/notification/${id}`, data);
const deleteNotifications = (ids) => axios.delete(`/api/notification/${ids}`);

const getUnreadNotificationCounts = () =>
  axios.get(`/api/notification/get_unread_noti_counts`);

const uploadImage = (file_path, data) =>
  axios.post(`/api/image/${file_path}`, data);
const deleteImage = (file_path) =>
  axios.delete(`/api/image?file_path=${file_path}`);

const getInfoRequestTypes = (query = "") =>
  axios.get(`/api/info_request_type${query}`);
const getInfoRequestTypeById = (id) =>
  axios.get(`/api/info_request_type/${id}`);
const createInfoRequestType = (data) =>
  axios.post("/api/info_request_type", data);
const updateInfoRequestType = (id, data) =>
  axios.put(`/api/info_request_type/${id}`, data);
const deleteInfoRequestTypes = (ids) =>
  axios.delete(`/api/info_request_type/${ids}`);
const getInformationForRequestType = () =>
  axios.get(`/api/info_request_type/info`);

const getInfoRequests = (query) => axios.get(`/api/info_request${query}`);
const getInfoRequestById = (id) => axios.get(`/api/info_request/${id}`);
const createInfoRequest = (data) => axios.post("/api/info_request", data);
const updateInfoRequet = (id, data) =>
  axios.put(`/api/info_request/${id}`, data);
const deleteInfoRequests = (ids) => axios.delete(`/api/info_request/${ids}`);
const sendEmailForInfoRequest = (ids) =>
  axios.post(`/api/info_request/send_email/${ids}`);

const getNewsAndBlogs = () => axios.get("/api/news_blog");
const getNewsAndBlogById = (id) => axios.get(`/api/news_blog/${id}`);
const createNewsAndBlog = (data) => axios.post("/api/news_blog", data);
const updateNewsAndBlog = (id, data) => axios.put(`/api/news_blog/${id}`, data);
const deleteNewsAndBlogs = (ids) => axios.delete(`/api/news_blog/${ids}`);

const getContactRequests = () => axios.get("/api/contact_request");
const getContactRequestById = (id) => axios.get(`/api/contact_request/${id}`);
const createContactRequest = (data) => axios.post("/api/contact_request", data);
const updateContactRequest = (id, data) =>
  axios.put(`/api/contact_request/${id}`, data);
const deleteContactRequests = (ids) =>
  axios.delete(`/api/contact_request/${ids}`);

export const apis = {
  login,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  sendEmail,
  getUserInfor,
  updatePassword,
  getFilterTypes,
  createEducation,
  getEducations,
  updateEducation,
  getEducationById,
  deleteEducations,
  getInstitutes,
  getInstituteById,
  createInstitute,
  updateInstitute,
  deleteInstitutes,
  getAddresses,
  getAddresseById,
  createAddress,
  updateAddress,
  deleteAddresses,
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategories,
  getTrainingForms,
  getTrainingFormById,
  createTrainingForm,
  updateTrainingForm,
  deleteTrainingForms,
  getAdmissionSelections,
  getAdmissionSelectionById,
  createAdmissionSelection,
  updateAdmissionSelection,
  deleteAdmissionSelections,
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificates,
  getInstituteTypes,
  getInstituteTypeById,
  createInstituteType,
  updateInstituteType,
  deleteInstituteTypes,
  getAirplanes,
  getAirplaneById,
  createAirplane,
  updateAirplane,
  deleteAirplanes,
  getAirplaneTypes,
  getAirplaneTypeById,
  createAirplaneType,
  updateAirplaneType,
  deleteAirplaneTypes,
  getSimulators,
  getSimulatorById,
  createSimulator,
  updateSimulator,
  deleteSimulators,
  getSimulatorTypes,
  getSimulatorTypeById,
  createSimulatorType,
  updateSimulatorType,
  deleteSimulatorTypes,
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvents,
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReviews,
  getMetadatas,
  getMetadataById,
  createMetadata,
  updateMetadata,
  deleteMetadatas,
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartments,
  uploadImage,
  deleteImage,
  getInstituteAirplanes,
  getInstituteAirplaneById,
  createInstituteAirplane,
  updateInstituteAirplane,
  deleteInstituteAirplanes,
  getInstituteSimulators,
  getInstituteSimulatorById,
  createInstituteSimulator,
  updateInstituteSimulator,
  deleteInstituteSimulators,
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotifications,
  getUnreadNotificationCounts,
  getInfoRequestTypes,
  getInfoRequestTypeById,
  createInfoRequestType,
  updateInfoRequestType,
  deleteInfoRequestTypes,
  getInfoRequests,
  getInfoRequestById,
  createInfoRequest,
  updateInfoRequet,
  deleteInfoRequests,
  getInformationForRequestType,
  sendEmailForInfoRequest,
  getNewsAndBlogs,
  getNewsAndBlogById,
  createNewsAndBlog,
  updateNewsAndBlog,
  deleteNewsAndBlogs,
  getContactRequests,
  getContactRequestById,
  createContactRequest,
  updateContactRequest,
  deleteContactRequests,
  getPlatformReviews,
  getPlatformReviewById,
  createPlatformReview,
  updatePlatformReview,
  deletePlatformReviews,
};
