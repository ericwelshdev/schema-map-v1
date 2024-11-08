import { Alert, Snackbar } from '@mui/material';

const AlertMessage = ({ type, message, onClose }) => (
  <Snackbar open={!!message} autoHideDuration={6000} onClose={onClose}>
    <Alert onClose={onClose} severity={type} sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);

export default AlertMessage;
