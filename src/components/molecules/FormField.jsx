import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const FormField = ({ 
  label, 
  type = "text", 
  required = false, 
  error = null,
  options = [],
  ...props 
}) => {
  return (
    <div className="space-y-2">
      <Label required={required}>
        {label}
      </Label>
      {type === "select" ? (
        <Select error={!!error} {...props}>
          <option value="">Select an option</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input type={type} error={!!error} {...props} />
      )}
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;