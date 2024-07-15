import React from "react";
import { FormControlLabel, Switch } from "@mui/material";
import { InputProps } from "../../types";
import { useController } from "react-hook-form";

export const PublicInformationChecked: React.FC<InputProps> = ({
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
    rules: {},
    defaultValue: "",
  });

  return (
    <FormControlLabel
      value="start"
      control={
        <Switch color="primary" checked={inputProps.value} {...inputProps} />
      }
      label="Public information"
      labelPlacement="start"
      sx={{ my: 1.5, mx: 0 }}
    />
  );
};

export default PublicInformationChecked;
