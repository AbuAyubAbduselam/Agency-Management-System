import { RouterProvider, createBrowserRouter } from "react-router-dom";

import {
  HomeLayout,
  Register,
  Login,
  DashboardLayout,
  Error,
  Landing,
  AddStudent,
  Stats,
  AllStudents,
  Profile,
  Admin,
  EditStudent,
  StudentAttendance,
  TeacherAttendance,
  About,
  Contact,
  Teachers,
  Results,
  Finance,
} from "./pages";
import { action as loginAction } from "./pages/Login";
import { loader as dashboardLoader } from "./pages/DashboardLayout";
import { loader as allStudentsLoader } from "./pages/AllStudents";
import { loader as allTeachersLoader } from "./pages/Teachers";
import { loader as teachersLoader } from "./pages/Teachers";
import { loader as editStudentLoader } from "./pages/EditStudent";
import { action as editStudentAction } from "./pages/EditStudent";
import { action as deleteStudentAction } from "./pages/DeleteStudent";
import { action as deleteTeacherAction } from "./pages/DeleteTeacher";
import { loader as adminLoader } from "./pages/Admin";
import { action as profileAction } from "./pages/Profile";
import { loader as statsLoader } from "./pages/Stats";
import { loader as resultsLoader } from "./pages/Results";
import AttendanceStats, {
  loader as attendanceStatsLoader,
} from "./pages/AttendanceStats";
import AttendanceDetail from "./pages/AttendanceDetail";
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
            element: <AllStudents />,
            loader: allStudentsLoader,
          },
          {
            path: "students-stats",
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
            path: "student-attendance",
            element: <StudentAttendance />,
            loader: allStudentsLoader,
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
            path: "edit-student/:id",
            element: <EditStudent />,
            loader: editStudentLoader,
            action: editStudentAction,
          },
          {
            path: "delete-student/:id",
            action: deleteStudentAction,
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
