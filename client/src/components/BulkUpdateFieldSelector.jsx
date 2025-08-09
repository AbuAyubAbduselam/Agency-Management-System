import { Select, Button } from "antd";

const BulkUpdateFieldSelector = ({
  statusOptions,
  bulkField,
  bulkValue,
  setBulkField,
  setBulkValue,
  onApply,
}) => {
  return (
    <div className="flex items-center gap-4 my-4">
      <Select
        placeholder="Select Field"
        value={bulkField || undefined}
        onChange={setBulkField}
        className="w-48"
      >
        {Object.keys(statusOptions).map((key) => (
          <Select.Option key={key} value={key}>
            {key}
          </Select.Option>
        ))}
      </Select>

      <Select
        placeholder="Select Value"
        value={bulkValue || undefined}
        onChange={setBulkValue}
        className="w-48"
        disabled={!bulkField}
      >
        {bulkField &&
          statusOptions[bulkField]?.map(({ label, value }) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
      </Select>

      <Button
        type="primary"
        onClick={onApply}
        disabled={!bulkField || !bulkValue}
      >
        Apply to Selected
      </Button>
    </div>
  );
};

export default BulkUpdateFieldSelector;
