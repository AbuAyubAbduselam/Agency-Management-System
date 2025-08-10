import { useState } from "react";
import { Typography, Button, Input, Form, Card } from "antd";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import customFetch from "../utils/customFetch";

const { Text, Title } = Typography;

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const year = url.searchParams.get("year");
  const month = url.searchParams.get("month");

  try {
    const response = await customFetch.get(`stats/attendance`, {
      params: { year, month },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

const AttendanceStats = () => {
  const stats = useLoaderData();
  const { data } = stats;
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = () => {
    navigate(`?year=${year}&month=${month}`);
  };

  if (!stats) {
    return (
      <div className="h-full flex items-center justify-center">
        <Text className="text-2xl">No stats are available!</Text>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Form layout="inline" onFinish={handleSubmit} className="mb-5 p-9">
        <Form.Item label="Year">
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min={2000}
            max={new Date().getFullYear()}
            placeholder="Year"
          />
        </Form.Item>
        <Form.Item label="Month">
          <Input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            min={1}
            max={12}
            placeholder="Month"
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            onClick={handleSubmit}
          >
            Fetch Stats
          </Button>
        </Form.Item>
      </Form>

      {data.map((classData) => {
        const { class: className, stats: classStats } = classData;
        const total = Object.values(classStats).reduce(
          (acc, count) => acc + count,
          0
        );

        const presentPercent = ((classStats.Present || 0) / total) * 100;
        const absentPercent = ((classStats.Absent || 0) / total) * 100;
        const latePercent = ((classStats.Late || 0) / total) * 100;

        return (
          <Card key={className} className="mb-6">
            <Title level={4}>{`Class: ${className}`}</Title>

            <div className="mb-4">
              <Text>Present: {classStats.Present || 0}</Text>
              <div className="relative w-full h-8 bg-gray-200 rounded-lg mt-2">
                <div
                  className="absolute top-0 left-0 h-8 bg-green-500 rounded-lg"
                  style={{ width: `${presentPercent}%` }}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                  {presentPercent.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="mb-4">
              <Text>Absent: {classStats.Absent || 0}</Text>
              <div className="relative w-full h-8 bg-gray-200 rounded-lg mt-2">
                <div
                  className="absolute top-0 left-0 h-8 bg-red-500 rounded-lg"
                  style={{ width: `${absentPercent}%` }}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                  {absentPercent.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="mb-4">
              <Text>Late: {classStats.Late || 0}</Text>
              <div className="relative w-full h-8 bg-gray-200 rounded-lg mt-2">
                <div
                  className="absolute top-0 left-0 h-8 bg-yellow-500 rounded-lg"
                  style={{ width: `${latePercent}%` }}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                  {latePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AttendanceStats;
