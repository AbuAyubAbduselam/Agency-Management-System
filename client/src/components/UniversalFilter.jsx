// components/UniversalFilter.jsx
import  { useEffect, useState } from "react";
import {
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Collapse,
  Row, 
  Col,
  Checkbox,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Option } = Select;

const UniversalFilter    = ({ apiPrefix = "/api/candidates", onApply }) => {
  const [schemaConfig, setSchemaConfig] = useState([]);
  const [values, setValues] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // fetch schema config on mount
  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const res = await fetch(`${apiPrefix}/schema`);
        const json = await res.json();
        setSchemaConfig(json.schemaConfig || []);
      } catch (err) {
        console.error("Failed to fetch schema config:", err);
      }
    };
    fetchSchema();
  }, [apiPrefix]);

  // initialize values from URL query params if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initial = {};
    for (const [k, v] of params.entries()) {
      // date ranges or comma lists will be stringified in url; keep as-is
      initial[k] = v;
    }
    setValues(initial);
  }, [location.search]);

  const setValue = (name, v) => {
    setValues((prev) => ({ ...prev, [name]: v }));
  };

  const onApplyClick = () => {
    const params = new URLSearchParams();

    // Build parameters according to types
    schemaConfig.forEach((field) => {
      const name = field.name;
      const val = values[name];
      if (val === undefined || val === null || val === "") return;

      if (field.type === "date") {
        // val expected to be [start, end] (dayjs)
        if (Array.isArray(val) && val[0] && val[1]) {
          params.set(`start_${name}`, dayjs(val[0]).toISOString());
          params.set(`end_${name}`, dayjs(val[1]).toISOString());
        }
      } else if (field.type === "number") {
        // Our UI stores { min, max } for numbers
        if (typeof val === "object") {
          if (val.min !== undefined && val.min !== "") params.set(`min_${name}`, String(val.min));
          if (val.max !== undefined && val.max !== "") params.set(`max_${name}`, String(val.max));
        } else {
          params.set(name, String(val));
        }
      } else if (field.type === "map") {
        // Map keys UI stores values under names like "skills.key"
        // We'll iterate keys
        if (field.mapKeys && field.mapKeys.length) {
          field.mapKeys.forEach((mapKey) => {
            const mapFieldName = `${name}.${mapKey}`;
            const mapVal = values[mapFieldName];
            if (mapVal !== undefined && mapVal !== "") {
              // allow comma-separated multiple values if selected as array
              if (Array.isArray(mapVal)) params.set(mapFieldName, mapVal.join(","));
              else params.set(mapFieldName, mapVal);
            }
          });
        }
      } else if (field.type === "enum") {
        // allow multi-select arrays or single value
        if (Array.isArray(val)) params.set(name, val.join(","));
        else params.set(name, val);
      } else {
        // default: direct set
        // allow arrays (multi-select) convert to comma string
        if (Array.isArray(val)) params.set(name, val.join(","));
        else params.set(name, val);
      }
    });

    // Also support a top-level 'search' field if user typed global search
    if (values.search) {
      params.set("search", values.search);
    }

    const queryString = params.toString();
    // update URL (this triggers route loader if your routing uses query)
    navigate({ pathname: location.pathname, search: queryString ? `?${queryString}` : "" });

    // Also call optional callback
    if (onApply) onApply(Object.fromEntries(params.entries()));
  };

  const onClearClick = () => {
    setValues({});
    navigate({ pathname: location.pathname, search: "" });
    if (onApply) onApply({});
  };

  // helper renderers:
  const renderField = (field) => {
    const current = values[field.name];

    if (field.type === "string") {
      return (
        <Input
          placeholder={field.label}
          value={current || ""}
          onChange={(e) => setValue(field.name, e.target.value)}
        />
      );
    }

    if (field.type === "enum") {
      return (
        <Select
          mode={field.values && field.values.length > 10 ? "multiple" : undefined}
          allowClear
          placeholder={field.label}
          value={current ? (Array.isArray(current) ? current : current) : undefined}
          onChange={(val) => setValue(field.name, val)}
        >
          {(field.values || []).map((v) => (
            <Option key={v || "__empty__"} value={v}>
              {v === "" ? "(empty)" : v}
            </Option>
          ))}
        </Select>
      );
    }

    if (field.type === "date") {
      // store as [start,end] dayjs
      const val = current && Array.isArray(current) ? current : null;
      return (
        <RangePicker
          value={val ? [dayjs(val[0]), dayjs(val[1])] : undefined}
          style={{ width: "100%" }}
          onChange={(dates) => setValue(field.name, dates ? [dates[0].toISOString(), dates[1].toISOString()] : null)}
        />
      );
    }

    if (field.type === "number") {
      const cur = current || {};
      return (
        <div style={{ display: "flex", gap: 8 }}>
          <InputNumber
            placeholder="min"
            value={cur.min}
            onChange={(v) => setValue(field.name, { ...cur, min: v })}
            style={{ width: "50%" }}
          />
          <InputNumber
            placeholder="max"
            value={cur.max}
            onChange={(v) => setValue(field.name, { ...cur, max: v })}
            style={{ width: "50%" }}
          />
        </div>
      );
    }

    if (field.type === "map") {
      // render each detected key as small select (yes/no or custom)
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {(field.mapKeys || []).length === 0 && <div className="text-muted">No map keys detected</div>}
          {(field.mapKeys || []).map((k) => {
            const mapFieldName = `${field.name}.${k}`;
            return (
              <div key={mapFieldName} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: "40%" }}>{k}</div>
                <Select
                  placeholder="(any)"
                  value={values[mapFieldName] ?? undefined}
                  style={{ width: "60%" }}
                  onChange={(val) => setValue(mapFieldName, val)}
                  allowClear
                >
                  <Option value="yes">yes</Option>
                  <Option value="no">no</Option>
                </Select>
              </div>
            );
          })}
        </div>
      );
    }

    // fallback
    return (
      <Input
        placeholder={field.label}
        value={current || ""}
        onChange={(e) => setValue(field.name, e.target.value)}
      />
    );
  };

  return (
    <Collapse defaultActiveKey={["1"]}>
      <Panel header="Advanced Dynamic Filters" key="1">
        <Row gutter={[12, 12]}>
          {/* Global search */}
          <Col xs={24} sm={24} md={12} lg={8}>
            <Input.Search
              placeholder="Search name / passport / code ..."
              value={values.search || ""}
              onChange={(e) => setValue("search", e.target.value)}
              onSearch={onApplyClick}
              allowClear
            />
          </Col>

          {schemaConfig.map((field) => (
            <Col key={field.name} xs={24} sm={12} md={8} lg={6}>
              <label style={{ display: "block", marginBottom: 6 }}>{field.label}</label>
              {renderField(field)}
            </Col>
          ))}
        </Row>

        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <Button type="primary" onClick={onApplyClick}>
            Apply
          </Button>
          <Button onClick={onClearClick}>Clear</Button>
        </div>
      </Panel>
    </Collapse>
  );
}

export default UniversalFilter