import {
  UserOutlined,
  TeamOutlined,
  ScheduleOutlined,
  ReadOutlined,
  BarChartOutlined,
  DollarOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

const links = [

    {
    text: "Register Candidate",
    path: "add-candidate",
    icon: <UserAddOutlined/>
  },

  {
    text: "Registered Candidates",
    path: ".",
    icon: <TeamOutlined />,
  },
  


  {
    text: "Processing",
    path: "candidate-attendance",
    icon: <ScheduleOutlined />,
  },
  {
    text: "Arrived Candidates",
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
