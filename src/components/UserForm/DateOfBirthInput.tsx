import React from "react";
import { InputAdornment, TextField } from "@mui/material";
import { useController } from "react-hook-form";
import moment, { isDate } from "moment";
import { InputProps } from "../../types";
import { DateRange } from "@mui/icons-material";

export const DateOfBirthInput: React.FC<InputProps> = ({
  control,
  name,
  ...otherProps
}) => {
  const {
    field: { ...inputProps },
    fieldState: { invalid, error },
  } = useController({
    control,
    name,
    rules: {
      validate: {
        isOldEnough: (value) => {
          const selectedDate = moment(value);
          const fifteenYearsAgo = moment().subtract(15, "years");
          return (
            selectedDate.isBefore(fifteenYearsAgo) ||
            "You must be at least 15 years old"
          );
        },
      },
    },
    defaultValue: "",
  });

  return (
    <TextField
      margin="dense"
      fullWidth
      type="date"
      variant="outlined"
      size="small"
      label="Date of Birth"
      error={invalid}
      helperText={error?.message}
      sx={{ my: 1.5 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <DateRange />
          </InputAdornment>
        ),
      }}
      {...inputProps}
      {...otherProps}
    />
  );
};

export default DateOfBirthInput;
