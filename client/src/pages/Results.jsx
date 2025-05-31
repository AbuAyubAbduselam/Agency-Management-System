import { Input, Button, Card } from "antd"; // Importing Card from Ant Design
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useLoaderData } from "react-router-dom";
import PageBtnContainer3 from "../components/PageBtnContainer3";

export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);

  try {
    const { data } = await customFetch.get("/students", {
      params,
    });

    return { data, selectedParams: { ...params } };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Results = () => {
  const { data } = useLoaderData();
  const { students, numOfPages } = data;

  const handleChange = (e, id, field) => {
    const newStudents = students.map((student) => {
      if (student.id === id) {
        return { ...student, [field]: e.target.value };
      }
      return student;
    });
    setStudents(newStudents);
  };

  const handleSave = (id) => {
    const updatedStudent = students.find((student) => student.id === id);
    console.log("Saving data for:", updatedStudent);
    // Add API or logic to save the updated student's results
  };

  return (
    <Card className="p-6 !bg-white" bordered={false}>
      {" "}
      <h1 className="text-2xl font-bold mb-4">Record Student Results</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th></th>
              <th>Level</th>
              <th>Test 5%</th>
              <th>Mid 25%</th>
              <th>Assignment 20%</th>
              <th>Final 50%</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="!bg-white">
                <td className="font-bold capitalize">{student.firstName}</td>
                <td className="font-bold capitalize">{student.middleName}</td>
                <td>
                  <Input
                    type="number"
                    value={student.test}
                    onChange={(e) => handleChange(e, student.id, "test")}
                    className="border border-gray-300 rounded-lg p-1"
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    value={student.test}
                    onChange={(e) => handleChange(e, student.id, "test")}
                    className="border border-gray-300 rounded-lg p-1"
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    value={student.midExam}
                    onChange={(e) => handleChange(e, student.id, "midExam")}
                    className="border border-gray-300 rounded-lg p-1"
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    value={student.final}
                    onChange={(e) => handleChange(e, student.id, "final")}
                    className="border border-gray-300 rounded-lg p-1"
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    value={student.assignment}
                    onChange={(e) => handleChange(e, student.id, "assignment")}
                    className="border border-gray-300 rounded-lg p-1"
                  />
                </td>
                <td>
                  <Button
                    className="bg-emerald-600 text-white"
                    onClick={() => handleSave(student.id)}
                  >
                    Save
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {numOfPages > 1 && <PageBtnContainer3 data={data} />}
    </Card>
  );
};

export default Results;
