import React from "react";

const EmploymentForm = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center p-2 border-b">
        <img src="logo.png" alt="Logo" className="h-16" />
        <div className="text-center">
          <p className="text-lg font-bold">NAKHALA RECRUITMENT OFFICE</p>
          <p>HOUSEMAID APPLICATION FOR EMPLOYMENT</p>
        </div>
        <div className="text-right">
          <p>Attached 2x2 Most Recent Picture</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="border p-4">
        <h2 className="text-lg font-bold">Contact No.’s</h2>
        <input
          type="text"
          placeholder="Contact No.’s"
          className="border p-2 w-full mt-2"
        />
      </div>

      {/* Full Name */}
      <div className="border p-4 mt-4">
        <label className="block font-bold">FULL NAME</label>
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 w-full mt-2"
        />
      </div>

      {/* Monthly Salary and Contract Period */}
      <div className="grid grid-cols-2 gap-4 border p-4 mt-4">
        <div>
          <label className="block font-bold">Monthly Salary</label>
          <input
            type="text"
            placeholder="Monthly Salary"
            className="border p-2 w-full mt-2"
          />
        </div>
        <div>
          <label className="block font-bold">Contract Period</label>
          <input
            type="text"
            placeholder="Contract Period"
            className="border p-2 w-full mt-2"
          />
        </div>
      </div>

      {/* Passport Details */}
      <div className="border p-4 mt-4">
        <h2 className="text-lg font-bold">PASSPORT DETAILS</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block">Number</label>
            <input
              type="text"
              placeholder="Passport Number"
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block">Date of Issue</label>
            <input type="date" className="border p-2 w-full" />
          </div>
          <div>
            <label className="block">Date of Expiry</label>
            <input type="date" className="border p-2 w-full" />
          </div>
          <div>
            <label className="block">Place of Issue</label>
            <input
              type="text"
              placeholder="Place of Issue"
              className="border p-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* Language & Education */}
      <div className="border p-4 mt-4">
        <h2 className="text-lg font-bold">LANGUAGES & EDUCATION</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block">English</label>
            <input type="checkbox" className="mr-2" /> Proficient
          </div>
          <div>
            <label className="block">Arabic</label>
            <input type="checkbox" className="mr-2" /> Proficient
          </div>
          <div className="col-span-2">
            <label className="block">Education Level</label>
            <input
              type="text"
              placeholder="Education"
              className="border p-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* Personal Data */}
      <div className="border p-4 mt-4">
        <h2 className="text-lg font-bold">PERSONAL DATA</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block">Nationality</label>
            <input
              type="text"
              placeholder="Nationality"
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block">Religion</label>
            <input
              type="text"
              placeholder="Religion"
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block">Date of Birth</label>
            <input type="date" className="border p-2 w-full" />
          </div>
          <div>
            <label className="block">Place of Birth</label>
            <input
              type="text"
              placeholder="Place of Birth"
              className="border p-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* Skills & Experience */}
      <div className="border p-4 mt-4">
        <h2 className="text-lg font-bold">SKILLS & EXPERIENCES</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block">Baby Sitting</label>
            <input type="checkbox" className="mr-2" /> Yes
          </div>
          <div>
            <label className="block">Cooking</label>
            <input type="checkbox" className="mr-2" /> Yes
          </div>
          {/* Add more skills as needed */}
        </div>
      </div>

      {/* Print Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => window.print()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Print Form
        </button>
      </div>
    </div>
  );
};

export default EmploymentForm;
