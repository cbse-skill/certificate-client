import { Paper } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

export default function AutoCompleteSelect({ data = [], label, value = "", loading=false, onChange, disableClearable = true, error = false, helperText = "", defaultVal }) {
  const optionsWithDefault = [];
  if (defaultVal) {
    optionsWithDefault.push({ value: "", label: defaultVal }, ...data)
  } else {
    optionsWithDefault.push(...data)
  }
  return (
    <>
      <Paper component="form" elevation={error ? 0 : 0}>
        <Autocomplete
          value={String(value)}
          onChange={(_, newValue) => onChange(newValue)}
          options={optionsWithDefault}
          getOptionLabel={(option) => (option.label) || (option)}
          blurOnSelect
          fullWidth
          disableClearable={disableClearable}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={error}
              helperText={helperText}
              size="small"
              slotProps={{
              input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
            />
          )}
        />
      </Paper>
    </>
  );
}
