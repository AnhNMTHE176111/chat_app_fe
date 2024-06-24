import React, { useEffect, useState } from "react";
import { Description } from "@mui/icons-material";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { InputProps } from "../../types";
import { useController } from "react-hook-form";

interface Province {
  _id: string;
  slug: string;
  name_with_type: string;
}

export const AddressInput: React.FC<InputProps> = ({
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

  const provinces = [
    { _id: "1", slug: "hcm", name_with_type: "Ho Chi Minh" },
    { _id: "2", slug: "hn", name_with_type: "Ha Noi" },
    { _id: "3", slug: "dn", name_with_type: "Da Nang" },
    { _id: "4", slug: "sg", name_with_type: "Sai Gon" },
    { _id: "5", slug: "bd", name_with_type: "Binh Dinh" },
    { _id: "6", slug: "bt", name_with_type: "Binh Thuan" },
    { _id: "7", slug: "tb", name_with_type: "Tuyen Quang" },
  ];

  return (
    <TextField
      margin="dense"
      select
      fullWidth
      variant="outlined"
      size="small"
      label="Address"
      error={invalid}
      helperText={error?.message}
      sx={{ my: 1.5 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Description />
          </InputAdornment>
        ),
      }}
      {...inputProps}
      {...otherProps}
    >
      {provinces?.map((province) => (
        <MenuItem key={province._id} value={province.name_with_type}>
          {province.name_with_type}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default AddressInput;
