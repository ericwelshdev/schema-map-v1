import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/actions/authActions';
import { TextField, Button, Container, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const { email, password, rememberMe } = formData;

  const onChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  if (auth.isAuthenticated) {
    navigate('/dashboard');
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={onSubmit}>
        <TextField
          label="Email"
          name="email"
          value={email}
          onChange={onChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={onChange}
          required
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={<Checkbox name="rememberMe" checked={rememberMe} onChange={onChange} />}
          label="Remember Me"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
      </form>
      {auth.error && <Typography color="error">{auth.error}</Typography>}
    </Container>
  );
};

export default Login;
