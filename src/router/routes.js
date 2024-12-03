import { createBrowserRouter, Navigate } from "react-router-dom";
// import SignUpPage from "../pages/auth/SignUpPage";
// import EmailSentPage from "../pages/auth/EmailSentPage";
// import VerifyAccountPage from "../pages/auth/VerifyAccountPage";
// import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
// import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import PrivateLayout from "../layout/PrivateLayout";
import PublicLayout from "../layout/PublicLayout";
import LoginPage from "../pages/auth/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import CreateEducationPage from "../pages/education/CreateEducationPage";
import EditEducationPage from "../pages/education/EditEducationPage";
import InstitutePage from "../pages/institute";
import CreateInstitutePage from "../pages/institute/CreateInstitutePage";
import EditInstitutePage from "../pages/institute/EditInstitutePage";
import CategoryPage from "../pages/category";
import CreateCategoryPage from "../pages/category/CreateCategoryPage";
import EditCategoryPage from "../pages/category/EditCategoryPage";
import TrainingFormPage from "../pages/trainingForm";
import CreateTrainingFormPage from "../pages/trainingForm/CreateTrainingFormPage";
import EditTrainingFormPage from "../pages/trainingForm/EditTrainingFormPage";
import AdminssionSelectionPage from "../pages/adminssionSelection";
import CreateAdmissionSelectionPage from "../pages/adminssionSelection/CreateAdmissionSelectionPage";
import EditAdmissionSelectionPage from "../pages/adminssionSelection/EditAdmissionSelectionPage";
import CertificatePage from "../pages/certificate";
import CreateCertificatePage from "../pages/certificate/CreateCertificatePage";
import EditCertificatePage from "../pages/certificate/EditCertificatePage";
import InstituteTypePage from "../pages/instituteType";
import CreateInstituteTypePage from "../pages/instituteType/CreateInstituteTypePage";
import EditInstituteTypePage from "../pages/instituteType/EditInstituteTypePage";
import AirplanePage from "../pages/airplane";
import CreateAirplanePage from "../pages/airplane/CreateAirplanePage";
import EditAirplanePage from "../pages/airplane/EditAirplanePage";
import SimulatorPage from "../pages/simulator";
import CreateSimulatorPage from "../pages/simulator/CreateSimulatorPage";
import EditSimulatorPage from "../pages/simulator/EditSimulatorPage";
import DepartmentPage from "../pages/department";
import CreateDepartmentPage from "../pages/department/CreateDepartmentPage";
import EditDepartmentPage from "../pages/department/EditDepartmentPage";
import InstituteDetailsPage from "../pages/institute/InstituteDetailsPage";
import AirplaneTypePage from "../pages/airplaneType";
import SimulatorTypePage from "../pages/simulatorType";
import EditInstituteAirplanePage from "../pages/instituteAirplane/EditInstituteAirplanePage";
import CreateInstituteAirplanePage from "../pages/instituteAirplane/CreateInstituteAirplanePage";
import CreateInstituteSimulatorPage from "../pages/instituteSimulator/CreateInstituteSimulatorPage";
import EditInstituteSimulatorPage from "../pages/instituteSimulator/EditInstituteSimulatorPage";
import EditInstituteReviewPage from "../pages/instituteReview/EditInstituteReviewPage";
import CreateInstituteReviewPage from "../pages/instituteReview/CreateInstituteReviewPage";
import EducationDetailsPage from "../pages/education/EducationDetailsPage";
import CreateEducationReviewPage from "../pages/educationReview/CreateEducationReviewPage";
import AdminNotificationPage from "../pages/AdminNotificationPage";
import InfoRequestTypePage from "../pages/infoRequestType";
import CreateInfoRequestTypePage from "../pages/infoRequestType/CreateInfoRequestTypePage";
import EditInfoRequestTypePage from "../pages/infoRequestType/EditInfoRequestTypePage";
import CreateInfoRequestPage from "../pages/infoRequest/CreateInfoRequestPage";
import EditInfoRequestPage from "../pages/infoRequest/EditInfoRequestPage";
import InstituteAirplaneDetailsPage from "../pages/instituteAirplane/InstituteAirplaneDetailsPage";
import InstituteSimulatorDetailsPage from "../pages/instituteSimulator/InstituteSimulatorDetailsPage";
import ReviewPage from "../pages/review";
import CreateReviewPage from "../pages/review/CreateReviewPage";
import EditReviewPage from "../pages/review/EditReviewPage";
import AllInfoRequestPage from "../pages/infoRequest/AllInfoRequestPage";
import NewsAndBlogPage from "../pages/newAndBlog";
import CreateNewsAndBlogPage from "../pages/newAndBlog/CreateNewsAndBlogPage";
import EditNewsAndBlogPage from "../pages/newAndBlog/EditNewsAndBlogPage";
import ContactRequestPage from "../pages/contactRequest";
import PlatformReviewPage from "../pages/platformReview";
import CreatePlatformReviewPage from "../pages/platformReview/CreatePlatformReviewPage";
import EditPlatformReviewPage from "../pages/platformReview/EditPlatformReviewPage";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/institute" />,
  },
  // {
  //   path: "/dashboard",
  //   element: <PrivateLayout children={<DashboardPage />} />,
  // },

  {
    path: "/institute",
    element: <PrivateLayout children={<InstitutePage />} />,
  },
  {
    path: "/institute/create",
    element: <PrivateLayout children={<CreateInstitutePage />} />,
  },
  {
    path: "/institute/:id/edit",
    element: <PrivateLayout children={<EditInstitutePage />} />,
  },
  {
    path: "/institute/:institute_id/view",
    element: <PrivateLayout children={<InstituteDetailsPage />} />,
  },
  {
    path: "/institute/:institute_id/department/create",
    element: <PrivateLayout children={<CreateDepartmentPage />} />,
  },
  {
    path: "/institute/:institute_id/department/:department_id/edit",
    element: <PrivateLayout children={<EditDepartmentPage />} />,
  },
  {
    path: "/institute/:institute_id/education/:education_id/view",
    element: <PrivateLayout children={<EducationDetailsPage />} />,
  },
  {
    path: "/institute/:institute_id/education/create",
    element: <PrivateLayout children={<CreateEducationPage />} />,
  },
  {
    path: "/institute/:institute_id/education/:education_id/edit",
    element: <PrivateLayout children={<EditEducationPage />} />,
  },
  {
    path: "/institute/:institute_id/education/:education_id/review/create",
    element: <PrivateLayout children={<CreateEducationReviewPage />} />,
  },
  {
    path: "/institute/:institute_id/airplane/create",
    element: <PrivateLayout children={<CreateInstituteAirplanePage />} />,
  },
  {
    path: "/institute/:institute_id/airplane/:institute_airplane_id/edit",
    element: <PrivateLayout children={<EditInstituteAirplanePage />} />,
  },
  {
    path: "/institute/:institute_id/airplane/:institute_airplane_id/view",
    element: <PrivateLayout children={<InstituteAirplaneDetailsPage />} />,
  },
  {
    path: "/institute/:institute_id/simulator/create",
    element: <PrivateLayout children={<CreateInstituteSimulatorPage />} />,
  },
  {
    path: "/institute/:institute_id/simulator/:institute_simulator_id/edit",
    element: <PrivateLayout children={<EditInstituteSimulatorPage />} />,
  },
  {
    path: "/institute/:institute_id/simulator/:institute_simulator_id/view",
    element: <PrivateLayout children={<InstituteSimulatorDetailsPage />} />,
  },
  {
    path: "/institute/:institute_id/review/create",
    element: <PrivateLayout children={<CreateInstituteReviewPage />} />,
  },
  {
    path: "/institute/:institute_id/review/:review_id/edit",
    element: <PrivateLayout children={<EditInstituteReviewPage />} />,
  },
  {
    path: "/info_request",
    element: <PrivateLayout children={<AllInfoRequestPage />} />,
  },
  {
    path: "/info_request/create",
    element: <PrivateLayout children={<CreateInfoRequestPage />} />,
  },
  {
    path: "/info_request/:info_request_id/edit",
    element: <PrivateLayout children={<EditInfoRequestPage />} />,
  },
  {
    path: "/institute/:id/department",
    element: <PrivateLayout children={<DepartmentPage />} />,
  },
  {
    path: "/category",
    element: <PrivateLayout children={<CategoryPage />} />,
  },
  {
    path: "/category/create",
    element: <PrivateLayout children={<CreateCategoryPage />} />,
  },
  {
    path: "/category/:id/edit",
    element: <PrivateLayout children={<EditCategoryPage />} />,
  },
  {
    path: "/training_form",
    element: <PrivateLayout children={<TrainingFormPage />} />,
  },
  {
    path: "/training_form/create",
    element: <PrivateLayout children={<CreateTrainingFormPage />} />,
  },
  {
    path: "/training_form/:id/edit",
    element: <PrivateLayout children={<EditTrainingFormPage />} />,
  },
  {
    path: "/admission_selection",
    element: <PrivateLayout children={<AdminssionSelectionPage />} />,
  },
  {
    path: "/admission_selection/create",
    element: <PrivateLayout children={<CreateAdmissionSelectionPage />} />,
  },
  {
    path: "/admission_selection/:id/edit",
    element: <PrivateLayout children={<EditAdmissionSelectionPage />} />,
  },
  {
    path: "/certificate",
    element: <PrivateLayout children={<CertificatePage />} />,
  },
  {
    path: "/certificate/create",
    element: <PrivateLayout children={<CreateCertificatePage />} />,
  },
  {
    path: "/certificate/:id/edit",
    element: <PrivateLayout children={<EditCertificatePage />} />,
  },
  {
    path: "/institute_type",
    element: <PrivateLayout children={<InstituteTypePage />} />,
  },
  {
    path: "/institute_type/create",
    element: <PrivateLayout children={<CreateInstituteTypePage />} />,
  },
  {
    path: "/institute_type/:id/edit",
    element: <PrivateLayout children={<EditInstituteTypePage />} />,
  },
  {
    path: "/info_request_type",
    element: <PrivateLayout children={<InfoRequestTypePage />} />,
  },
  {
    path: "/info_request_type/create",
    element: <PrivateLayout children={<CreateInfoRequestTypePage />} />,
  },
  {
    path: "/info_request_type/:id/edit",
    element: <PrivateLayout children={<EditInfoRequestTypePage />} />,
  },
  {
    path: "/airplane",
    element: <PrivateLayout children={<AirplanePage />} />,
  },
  {
    path: "/airplane/create",
    element: <PrivateLayout children={<CreateAirplanePage />} />,
  },
  {
    path: "/airplane_type",
    element: <PrivateLayout children={<AirplaneTypePage />} />,
  },
  {
    path: "/airplane/:id/edit",
    element: <PrivateLayout children={<EditAirplanePage />} />,
  },
  {
    path: "/simulator",
    element: <PrivateLayout children={<SimulatorPage />} />,
  },
  {
    path: "/simulator/create",
    element: <PrivateLayout children={<CreateSimulatorPage />} />,
  },
  {
    path: "/simulator_type/",
    element: <PrivateLayout children={<SimulatorTypePage />} />,
  },
  {
    path: "/simulator/:id/edit",
    element: <PrivateLayout children={<EditSimulatorPage />} />,
  },
  {
    path: "/admin_notification",
    element: <PrivateLayout children={<AdminNotificationPage />} />,
  },
  {
    path: "/review",
    element: <PrivateLayout children={<ReviewPage />} />,
  },
  {
    path: "/review/create",
    element: <PrivateLayout children={<CreateReviewPage />} />,
  },
  {
    path: "/review/:review_id/edit",
    element: <PrivateLayout children={<EditReviewPage />} />,
  },
  {
    path: "/platform_review",
    element: <PrivateLayout children={<PlatformReviewPage />} />,
  },
  {
    path: "/platform_review/create",
    element: <PrivateLayout children={<CreatePlatformReviewPage />} />,
  },
  {
    path: "/platform_review/:platform_review_id/edit",
    element: <PrivateLayout children={<EditPlatformReviewPage />} />,
  },
  {
    path: "/news_blog",
    element: <PrivateLayout children={<NewsAndBlogPage />} />,
  },
  {
    path: "/news_blog/create",
    element: <PrivateLayout children={<CreateNewsAndBlogPage />} />,
  },
  {
    path: "/news_blog/:id/edit",
    element: <PrivateLayout children={<EditNewsAndBlogPage />} />,
  },
  {
    path: "/contact_request",
    element: <PrivateLayout children={<ContactRequestPage />} />,
  },
  ///auth routers
  {
    path: "/login",
    element: <PublicLayout children={<LoginPage />} />,
  },
  // {
  //   path: "/register",
  //   element: <PublicLayout children={<SignUpPage />} />,
  // },

  // {
  //   path: "/email-sent",
  //   element: <PublicLayout children={<EmailSentPage />} />,
  // },
  // {
  //   path: "/verify-email/:hash",
  //   element: <PublicLayout children={<VerifyAccountPage />} />,
  // },
  // {
  //   path: "/forgot-password",
  //   element: <PublicLayout children={<ForgotPasswordPage />} />,
  // },
  // {
  //   path: "/reset-password/:token",
  //   element: <PublicLayout children={<ResetPasswordPage />} />,
  // },

  {
    path: "*",
    element: <PublicLayout children={<NotFoundPage />} />,
  },
]);
