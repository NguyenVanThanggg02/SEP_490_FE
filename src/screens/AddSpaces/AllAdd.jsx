import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddSpaceCategories from "./AddSpaceCategories";
import AddSpaceLocation from "./AddSpaceLocation";
import AddSpaceInforSpace from "./AddSpaceInforSpace";
import AddSpacePageAppliances from "./AddSpacePageAppliances";
import { SpaceContext } from '../../Context/SpaceContext ';
import axios from 'axios';
const steps = ['Chọn thể loại', 'Chọn tiện ích', 'Vị trí', 'Thông tin chi tiết'];

export default function AddSpaceFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const { selectedCategoryId, selectedApplianceId, spaceInfo, location, selectedAppliances, setSelectedAppliances, setSelectedApplianceId } = useContext(SpaceContext);
  const userId = localStorage.getItem('userId');

  const handleFinish = async () => {
    await addAppliances();

    
    const spaceData = {
      userId: userId,
      categoriesId: selectedCategoryId,
      appliancesId: selectedApplianceId,
      location,
      ...spaceInfo,
    };

    try {
      const response = await axios.post('http://localhost:9999/spaces', spaceData);
      console.log('Thêm không gian thành công:', response.data);
      alert('Thêm không gian thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm không gian:', error);
      alert('Đã xảy ra lỗi khi thêm không gian. Vui lòng thử lại.');
    }
  };

  const addAppliances = async () => {

    const appliancesToAdd = {
      name: "",
      appliances: selectedAppliances,
      categoryId: selectedCategoryId,
    };

    console.log(appliancesToAdd);


    try {
      const response = await axios.post('http://localhost:9999/appliances', appliancesToAdd);
      if (response.data.success) {
        const newApplianceId = response.data.appliance._id;
        console.log(response.data);

        setSelectedApplianceId(newApplianceId);

        console.log('New appliance added with ID:', newApplianceId);
        return newApplianceId
      } else {
        console.error('Failed to add appliance:', response.data.message);
      }
    } catch (error) {
      console.error('Error adding appliance:', error);
    }


  };

  console.log("ap id" + selectedApplianceId);

  const handleNext = async () => {
    if (activeStep === 0 && !selectedCategoryId) {
      alert("Bạn cần chọn thể loại trước khi tiếp tục.");
      return;
    }


    setActiveStep(prevStep => Math.min(prevStep + 1, steps.length - 1));
  };


  const handleBack = () => {
    setActiveStep(prevStep => Math.max(prevStep - 1, 0));
  };

  const handleReset = () => {
    setActiveStep(0);
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
        return <AddSpaceInforSpace />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ padding: '20px' }}>
        {renderStepContent(activeStep)}
      </Box>

      <Box sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        backgroundColor: 'white',
        zIndex: 1000,
        padding: '10px',
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <Stepper nonLinear activeStep={activeStep}>
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
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === steps.length - 1 ? (
            <Button onClick={handleFinish}>
              Finish
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
