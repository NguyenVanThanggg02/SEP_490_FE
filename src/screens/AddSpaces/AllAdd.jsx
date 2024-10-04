import React, { useState } from 'react';
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
const steps = ['Chọn thể loại', 'Chọn tiện ích', 'Vị trí', 'Thông tin chi tiết'];

export default function AddSpaceFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // State để lưu categoryId

  const handleNext = () => {
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
        return <AddSpaceCategories setSelectedCategoryId={setSelectedCategoryId} />;
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
            <Step key={label}>
              <StepButton onClick={() => setActiveStep(index)}>
                {label}
              </StepButton>
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
          <Button onClick={handleNext} sx={{ mr: 1 }}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
