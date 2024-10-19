import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Box } from '@mui/material';
import ResourceTypeSelection from './ResourceTypeSelection';
import ResourceConfiguration from './ResourceConfiguration';
import ResourceDataDictionary from './ResourceDataDictionary';
import ResourceMappingTagging from './ResourceMappingTagging';
import ResourceSummary from './ResourceSummary';

const ResourceWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [resourceData, setResourceData] = useState({});
  const [configurationState, setConfigurationState] = useState({});
  const [dataDictionaryState, setDataDictionaryState] = useState({});
  const [mappingTaggingState, setMappingTaggingState] = useState({});

  const steps = ['Select Resource Type', 'Configure Resource', 'Configure Data Dictionary', 'Mapping and Tagging', 'Summary'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  const handleResourceTypeSelection = (data) => {
    setResourceData(data);
    handleNext();
  };

  const handleConfigurationStateChange = (newState) => {
    setConfigurationState(newState);
  };

  const handleDataDictionaryStateChange = (newState) => {
    setDataDictionaryState(newState);
  };

  const handleMappingTaggingStateChange = (newState) => {
    setMappingTaggingState(newState);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <ResourceTypeSelection onComplete={handleResourceTypeSelection} />;
      case 1:
        return (
          <ResourceConfiguration
            resourceData={resourceData}
            savedState={configurationState}
            onStateChange={handleConfigurationStateChange}
          />
        );
      case 2:
        return (
          <ResourceDataDictionary
            resourceData={resourceData}
            savedState={dataDictionaryState}
            onStateChange={handleDataDictionaryStateChange}
          />
        );
      case 3:
        return (
          <ResourceMappingTagging
            resourceData={resourceData}
            savedState={mappingTaggingState}
            onStateChange={handleMappingTaggingStateChange}
          />
        );
      case 4:
        return (
          <ResourceSummary
            resourceData={resourceData}
            configurationState={configurationState}
            dataDictionaryState={dataDictionaryState}
            mappingTaggingState={mappingTaggingState}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel onClick={() => handleStepClick(index)} style={{ cursor: 'pointer' }}>
              {label}
            </StepLabel>
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