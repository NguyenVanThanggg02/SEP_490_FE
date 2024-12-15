import React, { useContext, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import AddSpaceCategories from './AddSpaceCategories';
import AddSpaceLocation from './AddSpaceLocation';
import AddSpaceInforSpace from './AddSpaceInforSpace';
import AddSpacePageAppliances from './AddSpacePageAppliances';
import { SpaceContext } from '../../Context/SpaceContext ';
import axios from 'axios';
import StepConnector from '@mui/material/StepConnector'; // Import StepConnector
import { styled } from '@mui/material/styles'; // Import styled from MUI
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { Constants } from '../../utils/constants';

const steps = [
  'Chọn thể loại',
  'Chọn tiện ích',
  'Vị trí',
  'Thông tin chi tiết',
];
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${StepConnector.line}`]: {
    borderColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
  [`& .${StepConnector.lineCompleted}`]: {
    borderColor: 'green', // Màu xanh khi hoàn thành
  },
}));

export default function AddSpaceFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const {
    selectedCategoryId,
    setSelectedCategoryId,
    selectedApplianceId,
    setSelectedApplianceId,
    selectedAppliances,
    setSelectedAppliances, 
    location,
    setLocation,
    spaceInfo,
    setSpaceInfo,
    rules,
    setRules,
    selectedRules,
    setSelectedRules,
    customRule,
    setCustomRule,
    isGoldenHour,
    setIsGoldenHour,
    goldenHourDetails,
    setGoldenHourDetails,
    priceIncrease,
    setPriceIncrease,
  } = useContext(SpaceContext);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const editorRef = useRef();
  const [isLoading, setIsLoading] = useState(false)

  const isHaveAtLeastOnePricePer =
    spaceInfo.pricePerHour ||
    spaceInfo.pricePerDay ||
    spaceInfo.pricePerWeek ||
    spaceInfo.pricePerMonth;

  const canSave =
    spaceInfo.name &&
    isHaveAtLeastOnePricePer &&
    spaceInfo.area > 0 &&
    selectedRules.length &&
    location &&
    spaceInfo.latLng.length;

  const resetAllStates = () => {
    setSelectedCategoryId(null);
    setSelectedApplianceId(null);
    setSelectedAppliances([]);
    setLocation(null);
    setSpaceInfo({
      name: '',
      description: '',
      area: '',
      rulesId: null,
      pricePerHour: 0,
      pricePerDay: 0,
      pricePerWeek: 0,
      pricePerMonth: 0,
      images: [],
      latLng: [],
    });
    setIsGoldenHour(false);
    setGoldenHourDetails([]);
    setRules([]);
    setSelectedRules([]);
    setCustomRule('');
    setPriceIncrease(0);
  };

  const handleFinish = async () => {
    if (isFinishDisabled()) {
      toast.error('Vui lòng hoàn thành tất cả các trường bắt buộc!');
      return;
    }
    setIsLoading(true);
    try {
      const ruleId = await addRules();
    // Sau khi thêm quy định thành công, thêm thiết bị
    const applianceId = await addAppliances();

    const spaceData = {
      userId: userId,
      categoriesId: selectedCategoryId,
      appliancesId: applianceId,
      description: editorRef.current?.editor?.getData(),
      location,
      ...spaceInfo,
      rulesId: ruleId,
      isGoldenHour: isGoldenHour,
      goldenHourDetails: goldenHourDetails,
    };
    try {
      const response = await axios.post(
        'http://localhost:9999/spaces',
        spaceData
      );
      toast.success('Thêm không gian thành công!');
      navigate('/posted');
    } catch (error) {
      console.error('Lỗi khi thêm không gian:', error);
      toast.error('Đã xảy ra lỗi khi thêm không gian. Vui lòng thử lại.');
    }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const addRules = async () => {
    try {
      const customRulesArray = customRule
        .split(';')
        .map((rule) => rule.trim())
        .filter((rule) => rule.length > 0);

      const data = {
        selectedRules,
        customRules: customRulesArray,
      };
      console.log('Custom rules array:', customRulesArray); // Kiểm tra sau

      const response = await axios.post(
        'http://localhost:9999/rules/addRule',
        data
      );

      const ruleId = response.data._id;

      setSpaceInfo((prev) => ({
        ...prev,
        rulesId: ruleId,
      }));
      return ruleId;
    } catch (error) {
      console.error('Error adding rule:', error);
    }
  };

  const addAppliances = async () => {
    const appliancesToAdd = {
      name: '',
      appliances: selectedAppliances,
      categoryId: selectedCategoryId,
    };

    try {
      const response = await axios.post(
        'http://localhost:9999/appliances',
        appliancesToAdd
      );
      if (response.data.success) {
        const newApplianceId = response.data.appliance._id;

        setSelectedApplianceId(newApplianceId);

        return newApplianceId;
      } else {
        console.error('Failed to add appliance:', response.data.message);
      }
    } catch (error) {
      console.error('Error adding appliance:', error);
    }
  };

  // Hàm gửi dữ liệu lên server

  const handleNext = async () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <AddSpaceCategories />;
      case 1:
        return <AddSpacePageAppliances categoryId={selectedCategoryId} />;
      case 2:
        return <AddSpaceLocation />;
      case 3:
        return <AddSpaceInforSpace editorRef={editorRef} />;
      default:
        return 'Unknown step';
    }
  };

  useEffect(() => {
    return () => {
      resetAllStates();
    };
  }, []);

  const isNextDisabled =
    (activeStep === 0 && !selectedCategoryId) ||
    (activeStep === 1 && selectedAppliances.length === 0) ||
    (activeStep === 2 && (!location || spaceInfo.latLng.length === 0));

    const isFinishDisabled = () => {
      // Kiểm tra các điều kiện để nút "Hoàn thành" được kích hoạt
      const hasValidName = spaceInfo.name && spaceInfo.name.trim() !== ''; // Tên không gian
      const hasValidPrice = spaceInfo.pricePerHour || spaceInfo.pricePerDay || spaceInfo.pricePerMonth; // Ít nhất một loại giá
      const hasValidArea = spaceInfo.area && spaceInfo.area > 0; // Diện tích phải > 0
      const hasValidRules = selectedRules.length > 0 || (customRule && customRule.trim() !== ''); // Quy định phải được chọn hoặc nhập
      const hasImages = spaceInfo.images && spaceInfo.images.length > 0; // Kiểm tra ảnh đã được thêm
    
      return !(hasValidName && hasValidPrice && hasValidArea && hasValidRules && hasImages);
    };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ padding: '20px' }}>{renderStepContent(activeStep)}</Box>

      <Box
        sx={{
          width: '100%',
          position: 'fixed',
          bottom: 0,
          left: 0,
          backgroundColor: 'white',
          zIndex: 1000,
          padding: '10px',
          boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Stepper
          nonLinear
          activeStep={activeStep}
          connector={<CustomStepConnector />}
        >
          {steps.map((label, index) => (
            <Step key={label} completed={index < activeStep}>
              {/* Chỉ hiển thị StepButton cho bước hiện tại hoặc bước đã hoàn thành */}
              {index <= activeStep && (
                <StepButton onClick={() => setActiveStep(index)}>
                  {label}
                </StepButton>
              )}
            </Step>
          ))}
        </Stepper>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 1 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Quay lại
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === steps.length - 1 ? (
            <LoadingButton
            disabled={!canSave||isFinishDisabled()}
            onClick={handleFinish}
            variant="contained"
            loading={isLoading}
          >
            Hoàn thành
          </LoadingButton>
          ) : (
            <Button
              onClick={handleNext}
              disabled={isNextDisabled}
              sx={{
                cursor: isNextDisabled ? 'not-allowed' : 'pointer',
                opacity: isNextDisabled ? 0.5 : 1,
              }}
              variant="contained"
            >
              Tiếp tục
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
