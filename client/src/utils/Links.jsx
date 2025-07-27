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
    text: "All Candidates",
    path: ".",
    icon: <TeamOutlined />,
  },

 /* {
    text: "Selected Candidates",  
    path: "",
    icon: <ScheduleOutlined />,
    subLinks: [
      { text: "Candidate Attendance", path: "candidate-attendance" },
      { text: "Teacher Attendance", path: "teacher-attendance" },
      { text: "View Attendance", path: "attendance-detail" },
    ],
  },
  */

  {
    text: "Selected Candidates",
    path: "candidate-attendance",
    icon: <ScheduleOutlined />,
  },
  {
    text: "CV",
    path: "teachers",
    icon: <UserOutlined />,
  },
  { text: "Reports", path: "results", icon: <ReadOutlined /> },
  { text: "Finance", path: "finance", icon: <DollarOutlined /> },
  {
    text: "Stats",
    path: "candidates-stats",
    icon: <BarChartOutlined />,
  },
];

export default links;
