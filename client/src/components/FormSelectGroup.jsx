const FormSelectGroup = ({ label, name, value, options, onChange }) => {
    return (
      <div className="form-control w-full sm:w-[48%] lg:w-[31%]">
        <div className="flex items-center">
         
          <select
            id={name}
            name={name}
            defaultValue={value}
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
      </div>
    );
  };
  
  export default FormSelectGroup;
  