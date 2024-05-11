import { BaseTextFieldProps } from "@mui/material";

export interface InputProps extends BaseTextFieldProps {
  label?: string;
  sx?: React.CSSProperties;
}
