import AddNewType from "./Pages/Type_Admin/AddNewType";
import AdminHome from "./Pages/AdminSide/AdminHome";
import AdminView from "./Pages/Feedback/AdminView";
import AllFeedback from "./Pages/Feedback/AllFeedback";
import AllWasteCollections from "./Pages/Waste_Collection_Admin/AllWasteCollections";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cancel from "./Pages/Payment/Cancel";
import EditFeedback from "./Pages/Feedback/EditFeedBack";
import FeedbackForm from "./Pages/Feedback/FeedbackForm";
import LoginPage from "./Pages/LoginPage";
import MyFeedback from "./Pages/Feedback/MyFeedback";
import PaymentDetails from "./Pages/Payment/PaymentDetails";
import PaymentManagement from "./Pages/Payment/PaymentManagement";
import PaymentReport from "./Pages/PaymentReport";
import RecordCollection from "./Pages/Waste_Collection_Admin/RecordCollection";
import ReportNavigation from "./Pages/ReportNavigation";
import ScheduleForm from "./Pages/Waste_Schedule/ScheduleForm";
import ScheduleReport from "./Pages/ScheduleReport";
import Schedule_Satus_Admin from "./Pages/Waste_Schedule/Schedule_Satus_Admin"
import SignupPage from "./Pages/SignupPage";
import Success from "./Pages/Payment/Success";
import UpdateForm from "./Pages/Waste_Schedule/UpdateForm";
import UpdateWasteCollection from "./Pages/Waste_Collection_Admin/UpdateWasteCollection";
import ViewSchedule from "./Pages/Waste_Schedule/ViewSchedule";
import Wallet from "./Pages/Payment/Wallet";
import WasteCollectedReport from "./Pages/WasteCollectedReport";
import Waste_Collect_User from "./Pages/Waste_Schedule/Waste_Collect_User";
import UserDashboard from "./Pages/UserDashBoard";
import OAuthSuccess from "./Pages/OAuthSuccess"


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/oauth-success" element={<OAuthSuccess />} />

          <Route path="/schedule" element={<ScheduleForm />} />
          <Route path="/schedule/view" element={<ViewSchedule />} />
          <Route path="/schedule/update/:id" element={<UpdateForm />} />

          <Route path="/payment" element={<PaymentManagement />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/payment-details/:userId" element={<PaymentDetails />} />

          <Route path="/wcuser" element={<Waste_Collect_User />} />
          <Route path="/schedule/status/admin" element={<Schedule_Satus_Admin />} />


          <Route path="/WasteCollection" element={<RecordCollection />} />
          <Route path="/WasteCollection/all" element={<AllWasteCollections />} />
          <Route path="/update-waste-collection/:id" element={<UpdateWasteCollection />} />



          <Route path="/feedbackForm" element={<FeedbackForm />} />
          <Route path="/myFeedback" element={<MyFeedback />} />
          <Route path="/editFeedback/update/:id" element={<EditFeedback />} />
          <Route path="/adminView" element={<AdminView />} />
          <Route path="/allFeedback" element={<AllFeedback />} />

          <Route path="/reportNavigation" element={<ReportNavigation />} />
          <Route path="/paymentReport" element={<PaymentReport />} />
          <Route path="/reports/schedules" element={<ScheduleReport />} />
          <Route path="/wasteCollectedReport" element={<WasteCollectedReport />} />

          <Route path="/user" element={<UserDashboard />} />


          <Route path="/adminhome" element={<AdminHome />} />


          <Route path="/type" element={<AddNewType />} />



        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
