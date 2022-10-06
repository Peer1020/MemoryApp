import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

export interface DropdownItemType {
  id: string;
  value: string;
}

interface CustomDropdownProps {
  id: string;
  label: string;
  changeHandler: (targetName: string, selection: DropdownItemType) => void;
  openHandler?: () => void;
  currentValue: DropdownItemType;
  values: DropdownItemType[];
  emptyText: string;
  disabled?: boolean;
  dataTestId?: string;
}

const CustomDropdown = ({
  id,
  label,
  changeHandler,
  openHandler,
  currentValue,
  values,
  emptyText,
  disabled,
  dataTestId,
}: CustomDropdownProps) => {
  const handleSelectChange = (event: SelectChangeEvent): void => {
    const selection: DropdownItemType = values.find(
      ({ id }) => id === event.target.value
    ) || {
      id: '',
      value: '',
    };
    changeHandler(event.target.name, selection);
  };

  return (
    <FormControl
      sx={{ my: 1, minWidth: 130, maxWidth: 500, flexGrow: 1 }}
      size="small"
      disabled={disabled}>
      <InputLabel id={`label-${id}`}>{label}</InputLabel>
      <Select
        key="dropdown"
        labelId={`label-${id}`}
        id={id}
        name={id}
        value={currentValue.id}
        label={label}
        data-testid={dataTestId}
        onChange={handleSelectChange}
        onOpen={openHandler}>
        {values.length !== 0 ? (
          values.map((current) => (
            <MenuItem
              key={current.id}
              value={current.id}
              data-testid="dropdown-menu-item">
              {current.value}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>{emptyText}</MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export { CustomDropdown };
