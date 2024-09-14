import { Typography, Progress } from "antd";
import { useLoaderData } from "react-router-dom";
import customFetch from "../utils/customFetch";

const { Text } = Typography;

export const loader = async () => {
  try {
    const response = await customFetch.get("/stats/students");
    return response.data;
  } catch (error) {
    return null;
  }
};

const Stats = () => {
  const stats = useLoaderData();

  if (!stats) {
    return (
      <div className="h-full flex items-center justify-center">
        <Text className="text-[20px]">No stats are available!</Text>
      </div>
    );
  }

  const { totalStudents, maleStudents, femaleStudents, classBreakdown } = stats;

  return (
    <div>
      <Text className="text-primary-500 text-[20px]" strong>
        Student Statistics
      </Text>

      <div className="grid grid-cols-1 sm:grid-cols-3 mt-[20px] gap-[20px] sm:gap-[5px] md:gap-[20px] xl:gap-[50px] lg:px-[30px]">
        {/* Total Students */}
        <div className="flex flex-col-reverse gap-[20px] border border-gray-200 bg-white shadow-lg rounded-2xl p-[15px] border-b-primary-500 border-b-[5px]">
          <Text>Total Number of Students</Text>
          <Progress
            type="dashboard"
            trailColor="rgba(0, 0, 0, 0.06)"
            strokeWidth={20}
            strokeColor="#242f9c"
            steps={10}
            percent={100}
            format={() => totalStudents}
          />
        </div>

        {/* Male Students */}
        <div className="flex flex-col-reverse gap-[20px] border border-gray-200 bg-white shadow-lg rounded-2xl p-[15px] border-b-primary-500 border-b-[5px]">
          <Text>Total Number of Male Students</Text>
          <Progress
            type="dashboard"
            trailColor="rgba(0, 0, 0, 0.06)"
            strokeWidth={20}
            strokeColor="#242f9c"
            steps={10}
            percent={(maleStudents / totalStudents) * 100}
            format={() => maleStudents}
          />
        </div>

        {/* Female Students */}
        <div className="flex flex-col-reverse gap-[20px] border border-gray-200 bg-white shadow-lg rounded-2xl p-[15px] border-b-primary-500 border-b-[5px]">
          <Text>Total Number of Female Students</Text>
          <Progress
            type="dashboard"
            trailColor="rgba(0, 0, 0, 0.06)"
            strokeWidth={20}
            strokeColor="#242f9c"
            steps={10}
            percent={(femaleStudents / totalStudents) * 100}
            format={() => femaleStudents}
          />
        </div>
      </div>

      {/* Class Breakdown */}
      <div className="my-[30px]">
        <Text className="text-primary-500" strong>
          Class Breakdown
        </Text>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-[20px] lg:px-[30px]">
        {Object.entries(classBreakdown).map(([className, count]) => (
          <div
            key={className}
            className="flex flex-col-reverse gap-[20px] border border-gray-200 bg-white shadow-lg rounded-2xl p-[15px] border-b-primary-500 border-b-[5px]"
          >
            <Text>Class {className} Students</Text>
            <Progress
              type="dashboard"
              trailColor="rgba(0, 0, 0, 0.06)"
              strokeWidth={20}
              strokeColor="#242f9c"
              steps={10}
              percent={(count / totalStudents) * 100}
              format={() => count}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
