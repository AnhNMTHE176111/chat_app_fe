import { BaseTextFieldProps } from "@mui/material";

export type Severity = "success" | "error" | "info" | "warning";

export interface InputProps extends BaseTextFieldProps {
  label?: string;
  sx?: React.CSSProperties;
  control: any;
  name: string
}
