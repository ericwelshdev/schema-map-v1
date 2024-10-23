import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Box, Slide, StepConnector, styled } from '@mui/material';
import ResourceTypeSelection from './ResourceTypeSelection';
import ResourceConfiguration from './ResourceConfiguration';
import ResourceDataDictionaryTypeSelection from './ResourceDataDictionaryTypeSelection';
import ResourceDataDictionaryConfiguration from './ResourceDataDictionaryConfiguration';
import ResourceMappingTagging from './ResourceMappingTagging';
import ResourceSummary from './ResourceSummary';

// Styled components for animated stepper
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${StepConnector.line}`]: {
    transition: 'width 0.5s ease-in-out', // Smooth transition for line
  },
}));

const CustomStep = styled(Step)(({ theme, active, completed }) => ({
  [`& .MuiStepLabel-root .MuiStepIcon-root`]: {
    transition: 'transform 0.3s ease-in-out', // Smooth size transition for step circles
    transform: active ? 'scale(1.5)' : 'scale(1)', // Enlarge active step
  },
}));

const ResourceWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [slideDirection, setSlideDirection] = useState('left'); // Default direction is forward
  const [prevStep, setPrevStep] = useState(0); // Keep track of the previous step

  const steps = ['Resource Type', 'Configure Resource', 'Data Dictionary Type', 'Data Dictionary', 'Mapping & Tagging', 'Summary'];

  const handleNext = () => {
    setSlideDirection('left'); // Moving forward
    setPrevStep(activeStep); // Set the current step as previous
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setSlideDirection('right'); // Moving backward
    setPrevStep(activeStep); // Set the current step as previous
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSkip = () => {
    setSlideDirection('left'); // Moving forward
    setPrevStep(activeStep); // Set the current step as previous
    if (activeStep === 2) {
      setActiveStep(4);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleStepClick = (step) => {
    setSlideDirection(step > activeStep ? 'left' : 'right');
    setPrevStep(activeStep); // Set the current step as previous
    setActiveStep(step);
  };

  const isStepSkippable = (step) => {
    return step === 2 || step === 4;
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <ResourceTypeSelection />;
      case 1:
        return <ResourceConfiguration />;
      case 2:
        return <ResourceDataDictionaryTypeSelection />;
      case 3:
        return <ResourceDataDictionaryConfiguration />;
      case 4:
        return <ResourceMappingTagging />;
      case 5:
        return <ResourceSummary />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Stepper 
        activeStep={activeStep} 
        connector={<CustomStepConnector />}
      >
        {steps.map((label, index) => (
          <CustomStep 
            key={label} 
            active={index === activeStep} 
            completed={index < activeStep} 
            onClick={() => handleStepClick(index)} 
            sx={{ cursor: 'pointer' }}
          >
            <StepLabel>{label}</StepLabel>
          </CustomStep>
        ))}
      </Stepper>

      <Box sx={{ mt: 2, position: 'relative' }}>
        <Slide
          direction={slideDirection} 
          in={activeStep !== prevStep} // Ensure it transitions only when the step changes
          mountOnEnter
          unmountOnExit
          key={activeStep} // Use the key prop to ensure proper re-rendering
        >
          <Box>{getStepContent(activeStep)}</Box>
        </Slide>

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {isStepSkippable(activeStep) && (
            <Button onClick={handleSkip} sx={{ mr: 1 }}>
              Skip
            </Button>
          )}
          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ResourceWizard;
