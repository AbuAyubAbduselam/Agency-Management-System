import { useState } from "react";
import { Input, Button, Card } from "antd";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useLoaderData } from "react-router-dom";
import PageBtnContainer3 from "../components/PageBtnContainer3";

// Loader
export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);

  try {
    const { data } = await customFetch.get("/candidates", { params });
    return { data, selectedParams: { ...params } };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

// Reusable input field component
const ScoreInput = ({ value, onChange }) => (
  <Input
    type="number"
    value={value}
    onChange={onChange}
    className="border border-gray-300 rounded-lg p-1"
  />
);

// Main component
const Results = () => {
  const { data } = useLoaderData();
  const { candidates: loadedCandidates, numOfPages } = data;

  const [candidates, setCandidates] = useState(loadedCandidates);

  const handleChange = (e, id, field) => {
    const newCandidates = candidates.map((candidate) =>
      candidate.id === id ? { ...candidate, [field]: e.target.value } : candidate
    );
    setCandidates(newCandidates);
  };

  const handleSave = (id) => {
    const updatedCandidate = candidates.find((candidate) => candidate.id === id);
    console.log("Saving data for:", updatedCandidate);
    // Add your save logic here
  };

  return (
  

    <div>Reports</div>
  )
}


export default Results;
