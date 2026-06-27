// =============================================
// src/components/NotificationFilter.jsx
// Dropdown to filter by notification type.
// This file ALREADY EXISTS in your project - replace its content.
// =============================================

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";

/**
 * Props:
 *   value       - current filter value ("" | "Event" | "Result" | "Placement")
 *   onChange    - function to call when user picks a new filter
 */
export default function NotificationFilter({ value, onChange }) {
  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="filter-label">Filter by type</InputLabel>
        <Select
          labelId="filter-label"
          value={value}
          label="Filter by type"
          onChange={(e) => onChange(e.target.value)}
        >
          {/* Empty string = show all */}
          <MenuItem value="">All types</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
