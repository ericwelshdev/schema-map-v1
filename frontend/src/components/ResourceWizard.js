import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Box } from '@mui/material';
import ResourceTypeSelection from './ResourceTypeSelection';
import ResourceConfiguration from './ResourceConfiguration';
import ResourceDataDictionaryConfiguration from './ResourceDataDictionaryConfiguration';
import ResourceMappingTagging from './ResourceMappingTagging';
import ResourceSummary from './ResourceSummary';

const ResourceWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [wizardState, setWizardState] = useState({
    resourceSetup: {},
    resourceConfiguration: {},
    dataDictionary: {},
    mappingTagging: {}
  });

  const steps = ['Select Resource Type', 'Configure Resource', 'Data Dictionary', 'Mapping & Tagging', 'Summary'];

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const updateWizardState = (step, newState) => {
    setWizardState(prevState => ({
      ...prevState,
      [step]: { ...prevState[step], ...newState }
    }));
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <ResourceTypeSelection 
          savedState={wizardState.resourceSetup} 
          onStateChange={(newState) => updateWizardState('resourceSetup', newState)} 
        />;
      case 1:
        return <ResourceConfiguration 
          savedState={{...wizardState.resourceConfiguration, resourceSetup: wizardState.resourceSetup}}
          onStateChange={(newState) => updateWizardState('resourceConfiguration', newState)}
        />;
      case 2:
        return <ResourceDataDictionaryConfiguration 
          savedState={wizardState.dataDictionary}
          onStateChange={(newState) => updateWizardState('dataDictionary', newState)}
        />;
      case 3:
        return <ResourceMappingTagging 
          savedState={wizardState.mappingTagging}
          onStateChange={(newState) => updateWizardState('mappingTagging', newState)}
        />;
      case 4:
        return <ResourceSummary wizardState={wizardState} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 2 }}>
        {activeStep === steps.length ? (
          <Box>
            <p>All steps completed</p>
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