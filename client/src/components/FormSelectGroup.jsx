const FormSelectGroup = ({ label, name, value, options, onChange }) => {
  return (
    <div className="form-control w-full sm:w-[48%] lg:w-[31%]">
      {label && (
        <label htmlFor={name} className="mb-1 font-small text-gray-700">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="select select-bordered bg-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelectGroup;
