import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Box } from '@mui/material';
import ResourceTypeSelection from './ResourceTypeSelection';
import ResourceConfiguration from './ResourceConfiguration';
import ResourceMetadataTagging from './ResourceMetadataTagging';

const ResourceWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [resourceData, setResourceData] = useState({});

  const steps = ['Select Resource Type', 'Configure Resource', 'Metadata Tagging'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleResourceTypeSelection = (data) => {
    setResourceData(data);
    handleNext();
  };

  const isStepComplete = (step) => {
    // Add logic to check if the current step is complete
    // For example:
    // return resourceData.hasOwnProperty('someRequiredField');
    return true; // Placeholder, replace with actual logic
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <ResourceTypeSelection onComplete={handleResourceTypeSelection} setResourceData={setResourceData} />;
      case 1:
        return <ResourceConfiguration resourceData={resourceData} />;
      case 2:
        return <ResourceMetadataTagging resourceData={resourceData} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 2 }}>
        {activeStep === steps.length ? (
          <Box>
            <p>All steps completed</p>
            {/* Add final submission logic here */}
          </Box>
        ) : (
          <Box>
            {getStepContent(activeStep)}
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
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ResourceWizard;