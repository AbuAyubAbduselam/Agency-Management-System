// src/pages/PreviewExport.jsx
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Document, Page, PDFViewer, pdf } from "@react-pdf/renderer";
import { Button, Spin } from "antd";
import { CandidateCVPages, CombinedPDFDocument } from "../components/ExportActions";
import customFetch from "../utils/customFetch";
import { Export2Word } from "../utils/Export2Word";

const PreviewExport = () => {
  const [params] = useSearchParams();
  const type = params.get("type");
  const ids = params.get("ids")?.split(",") || [];
  const fields = params.get("fields")?.split(",") || [];
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await customFetch.get("/candidates?limit=1000&page=1");
        const all = res.data.candidates;
        const filtered = all.filter((c) => ids.includes(c._id));
        setCandidates(filtered);
      } catch (error) {
        console.error("Error fetching candidates", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [ids]);

  const handleDownload = async () => {
    if (!candidates.length) return;

    if (type === "word") {
      Export2Word("preview-container", "Candidates.doc");
    } else {
      const doc = type === "cv" && candidates.length === 1
        ? <Document><CandidateCVPages candidate={candidates[0]} /></Document>
        : <CombinedPDFDocument candidates={candidates} fields={fields} />;

      const blob = await pdf(doc).toBlob();
      const filename = type === "cv"
        ? `CV-${candidates[0].firstName}.pdf`
        : `Export_${type}.pdf`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (loading) return <Spin className="mt-10" tip="Loading candidates..." size="large" />;

  return (
    <div className="p-6 space-y-6" id="preview-container">
      <h2 className="text-xl font-bold capitalize">{type} Preview ({candidates.length} Candidates)</h2>
      {type === "word" && (
        <div className="bg-gray-100 p-4 rounded">
          <ul className="list-disc list-inside">
            {candidates.map((c) => (
              <li key={c._id}>{c.firstName} {c.lastName} — {c.gender}</li>
            ))}
          </ul>
        </div>
      )}
      {(type === "cv" || type === "summary") && (
        <div className="h-[90vh] border rounded shadow">
          <PDFViewer width="100%" height="100%">
            {type === "cv" && candidates.length === 1 ? (
              <Document><CandidateCVPages candidate={candidates[0]} /></Document>
            ) : (
              <CombinedPDFDocument candidates={candidates} fields={fields} />
            )}
          </PDFViewer>
        </div>
      )}
      <Button type="primary" onClick={handleDownload}>Download</Button>
    </div>
  );
};

export default PreviewExport;
