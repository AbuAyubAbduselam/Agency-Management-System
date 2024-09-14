import {
  UserOutlined,
  TeamOutlined,
  ScheduleOutlined,
  ReadOutlined,
  BarChartOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const links = [
  {
    text: "Students",
    path: ".",
    icon: <TeamOutlined />,
  },
  {
    text: "Teachers",
    path: "teachers",
    icon: <UserOutlined />,
  },
  {
    text: "Attendance",
    path: "",
    icon: <ScheduleOutlined />,
    subLinks: [
      { text: "Student Attendance", path: "student-attendance" },
      { text: "Teacher Attendance", path: "teacher-attendance" },
      { text: "View Attendance", path: "attendance-detail" },
    ],
  },
  { text: "Results", path: "results", icon: <ReadOutlined /> },
  { text: "Finance", path: "finance", icon: <DollarOutlined /> },
  {
    text: "Stats",
    path: "",
    icon: <BarChartOutlined />,
    subLinks: [
      { text: "Student", path: "students-stats" },
      { text: "Attendance", path: "attendance-stats" },
    ],
  },
];

export default links;
