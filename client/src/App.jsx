import { RouterProvider, createBrowserRouter } from "react-router-dom";

import {
  HomeLayout,
  Register,
  Login,
  DashboardLayout,
  Error,
  Landing,
  AddCandidate,
  Stats,
  AllCandidates,
  Profile,
  Admin,
  EditCandidate,
  CandidateAttendance,
  TeacherAttendance,
  About,
  Contact,
  Teachers,
  Results,
  Finance,
} from "./pages";
import { action as loginAction } from "./pages/Login";
import { loader as dashboardLoader } from "./pages/DashboardLayout";
import { loader as allCandidatesLoader } from "./pages/AllCandidates";
import { loader as allTeachersLoader } from "./pages/Teachers";
import { loader as teachersLoader } from "./pages/Teachers";
import { loader as editCandidateLoader } from "./pages/EditCandidate";
import { loader as editSelectedCandidateLoader } from "./pages/EditSelectedCandidate";
import { action as editCandidateAction } from "./pages/EditCandidate";
import { action as editSelectedCandidateAction } from "./pages/EditSelectedCandidate";
import { action as deleteCandidateAction } from "./pages/DeleteCandidate";
import { action as deleteTeacherAction } from "./pages/DeleteTeacher";
import { loader as adminLoader } from "./pages/Admin";
import { action as profileAction } from "./pages/Profile";
import { loader as statsLoader } from "./pages/Stats";
import { loader as resultsLoader } from "./pages/Results";
import { loader as candidateAttendanceLoader } from "./pages/CandidateAttendance";
import AttendanceStats, {
  loader as attendanceStatsLoader,
} from "./pages/AttendanceStats";
import AttendanceDetail from "./pages/AttendanceDetail";
import EditSelectedCandidate from "./pages/EditSelectedCandidate";
const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem("darkTheme") === "true";
  document.body.classList.toggle("dark-theme", isDarkTheme);
  return isDarkTheme;
};

const isDarkThemeEnabled = checkDefaultTheme();

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },

      {
        path: "admin-login",
        element: <Login />,
        action: loginAction,
      },
      {
        path: "teacher-login",
        element: <Login />,
        action: loginAction,
      },

      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "dashboard",
        element: <DashboardLayout isDarkThemeEnabled={isDarkThemeEnabled} />,
        loader: dashboardLoader,
        children: [
          {
            index: true,
            element: <AllCandidates />,
            loader: allCandidatesLoader,
          },
          {
            path: "add-candidate",
            element: <AddCandidate />,
          },
          {
            path: "candidates-stats",
            element: <Stats />,
            loader: statsLoader,
          },
          {
            path: "attendance-stats",
            element: <AttendanceStats />,
            loader: attendanceStatsLoader,
          },
          {
            path: "results",
            element: <Results />,
            loader: resultsLoader,
          },
          {
            path: "finance",
            element: <Finance />,
          },
          {
            path: "attendance-detail",
            element: <AttendanceDetail />,
          },

          {
            path: "teachers",
            element: <Teachers />,
            loader: teachersLoader,
          },
          {
            path: "candidate-attendance",
            element: <CandidateAttendance />,
            loader: candidateAttendanceLoader,
          },
          {
            path: "teacher-attendance",
            element: <TeacherAttendance />,
            loader: allTeachersLoader,
          },

          {
            path: "profile",
            element: <Profile />,
            action: profileAction,
          },
          {
            path: "admin",
            element: <Admin />,
            loader: adminLoader,
          },
          {
            path: "edit-candidate/:id",
            element: <EditCandidate />,
            loader: editCandidateLoader,
            action: editCandidateAction,
          },
          {
            path: "edit-candidate-attendance/:id",
            element: <EditSelectedCandidate />,
            loader: editSelectedCandidateLoader,
            action: editSelectedCandidateAction,
          },
          {
            path: "delete-candidate/:id",
            action: deleteCandidateAction,
          },
          {
            path: "delete-teacher/:id",
            action: deleteTeacherAction,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};
export default App;
