import { Button, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Constants } from '../utils/constants';

export default function ConfirmPassword({ setOpenConfirmPwd, handleSave }) {
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [userData, setUserData] = useState({});
  const userId = localStorage.getItem('userId');

  const fetchUserData = () => {
    setIsLoading(true);
    axios
      .get(`${Constants.apiHost}/users/${userId}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((err) => {
        console.error('Error fetching user data:', err);
        toast.success(err?.response?.data?.Error ?? 'Something wrong');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onPasswordChange = (e) => setPassword(e.target.value);
  const onOtpChange = (e) => setOtp(e.target.value);

  const sendConfirmPwdEmail = () => {
    setIsLoading(true);

    axios
      .post(`${Constants.apiHost}/users/confirm-password`, {
        password,
        userId: userData._id,
      })
      .then((res) => {
        console.log('send email res', res);
        toast.success('Vui lòng kiểm tra email');
        setShowOtpInput(true);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const checkOtp = async () => {
    setIsLoading(true);

    axios
      .post(`${Constants.apiHost}/users/confirm-otp`, {
        otp,
        userId: userData._id,
      })
      .then((res) => {
        handleSave();
        console.log('res when check otp', res);
        setOpenConfirmPwd(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const resentOtp = () => {
    setIsLoading(true);

    axios
      .post(`${Constants.apiHost}/users/resent-otp`, {
        userId: userData._id,
      })
      .then((res) => {
        console.log('res when check otp', res);
        toast.success('Vui lòng kiểm tra email');
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  return (
    <Stack spacing={2}>
      {isLoading ? <p>Loading...</p> : null}
      {!showOtpInput ? (
        <>
          <Typography variant="h2" sx={{ fontSize: '2rem' }}>
            Vui lòng nhập lại mật khẩu
          </Typography>

          <TextField
            type="password"
            value={password}
            onChange={onPasswordChange}
          />
          <Button type="button" onClick={sendConfirmPwdEmail}>
            Gửi
          </Button>
        </>
      ) : (
        <>
          <Stack direction={'row'} spacing={2}>
            <Typography variant="h2" sx={{ fontSize: '2rem' }}>
              Vui lòng nhập OTP nhận được từ email của bạn, OTP có hiệu lực
              trong 5 phút
            </Typography>
            <Button type="button" onClick={resentOtp}>
              Gửi lại OTP
            </Button>
          </Stack>
          <TextField type="text" value={otp} onChange={onOtpChange} />
          <Button variant="primary" type="button" onClick={checkOtp}>
            Gửi
          </Button>
        </>
      )}
    </Stack>
  );
}
