import {
  Box,
  FormGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

export default function RuleList({
  selectedRules,
  setSelectedRules,
  customRule,
  setCustomRule,
}) {
  const rulesList = [
    'Vệ sinh và ngăn nắp',
    'Cấm mang theo vũ khí, chất cấm',
    'Bảo quản thiết bị và cơ sở vật chất',
    'Mọi người vào đều phải được đăng ký trước',
    'Tuân thủ giờ thuê, không ở quá giờ quy định',
    'Số lượng người không được vượt quá giới hạn',
    'Không gây rối, xung đột với nhân viên và người khác',
  ];

  console.log(selectedRules);

  const handleToggleRule = (rule, checked) => {
    setSelectedRules((prevSelectedRules) => {
      if (checked) {
        // Nếu switch được bật, thêm rule vào mảng
        return [...prevSelectedRules, rule];
      } else {
        // Nếu switch bị tắt, loại bỏ rule khỏi mảng
        return prevSelectedRules.filter((r) => r !== rule);
      }
    });
  };

  // Hàm xử lý khi nhập vào custom rule
  const handleCustomRuleChange = (event) => {
    setCustomRule(event.target.value);
  };
  return (
    <Box>
      <Typography
        variant="h6"
        style={{
          fontWeight: 700,
          fontSize: '20px',
          paddingBottom: '10px',
        }}
      >
        Quy định<span style={{ color: 'red' }}>*</span>
      </Typography>
      <FormGroup>
        {rulesList.map((rule) => (
          <Stack direction="row" alignItems={'center'} gap={2}>
            <Switch
              checked={selectedRules.find(
                (selectedRule) => selectedRule === rule
              )}
              onChange={(e) => handleToggleRule(rule, e.target.checked)}
            />
            <span>{rule}</span>
          </Stack>
        ))}
        <TextField
          className="mt-3"
          id="outlined-basic"
          label="Điền thêm quy định vào đây"
          variant="outlined"
          value={customRule}
          onChange={handleCustomRuleChange}
          helperText="Các quy định riêng lẻ có thể tách nhau bằng dấu ';'"
          FormHelperTextProps={{
            style: {
              fontSize: '14px', // Kích thước chữ helperText
            },
          }}
        />
      </FormGroup>
    </Box>
  );
}
