import React, { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Button, Box, Slide } from '@mui/material';
import ResourceTypeSelection from './ResourceTypeSelection';
import ResourceConfiguration from './ResourceConfiguration';
import ResourceDataDictionaryTypeSelection from './ResourceDataDictionaryTypeSelection';
import ResourceDataDictionaryConfiguration from './ResourceDataDictionaryConfiguration';
import ResourceMappingTagging from './ResourceMappingTagging';
import ResourceSummary from './ResourceSummary';

const ResourceWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [slideDirection, setSlideDirection] = useState('left');
  const [prevStep, setPrevStep] = useState(0);
  const [wizardState, setWizardState] = useState({
    resourceSetup: {},
    resourceConfiguration: {},
    dataDictionary: {},
    mappingTagging: {}
  });

  const steps = ['Resource Type', 'Configure Resource', 'Data Dictionary Type', 'Data Dictionary', 'Mapping & Tagging', 'Summary'];

  // Ensure that the first step is displayed properly on initial load
  useEffect(() => {
    if (activeStep === 0) {
      setSlideDirection('left');
    }
  }, [activeStep]);

  const handleNext = () => {
    setSlideDirection('left');
    setPrevStep(activeStep);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setSlideDirection('right');
    setPrevStep(activeStep);
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSkip = () => {
    setSlideDirection('left');
    setPrevStep(activeStep);
    if (activeStep === 2) {
      setActiveStep(4);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleStepClick = (step) => {
    setSlideDirection(step > activeStep ? 'left' : 'right');
    setPrevStep(activeStep);
    setActiveStep(step);
  };

  const isStepSkippable = (step) => step === 2 || step === 4;

  const updateWizardState = (step, newState) => {
    setWizardState((prevState) => {
      let updatedState = { ...prevState[step], ...newState };

      if (step === 'resourceSetup' && updatedState.resourceSetup) {
        updatedState = {
          ...updatedState,
          ...updatedState.resourceSetup,
          resourceSetup: undefined,
        };
      }

      return {
        ...prevState,
        [step]: updatedState,
      };
    });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ResourceTypeSelection
            savedState={wizardState.resourceSetup}
            onStateChange={(newState) => updateWizardState('resourceSetup', newState)}
          />
        );
      case 1:
        return (
          <ResourceConfiguration
            savedState={{
              ...wizardState.resourceConfiguration,
              resourceSetup: wizardState.resourceSetup,
            }}
            onStateChange={(newState) => updateWizardState('resourceConfiguration', newState)}
          />
        );
      case 2:
        return (
          <ResourceDataDictionaryTypeSelection
            savedState={wizardState.dataDictionary}
            onStateChange={(newState) => updateWizardState('dataDictionarySetup', newState)}
          />
        );
      case 3:
        return (
          <ResourceDataDictionaryConfiguration
            savedState={wizardState.dataDictionary}
            onStateChange={(newState) => updateWizardState('dataDictionary', newState)}
          />
        );
      case 4:
        return (
          <ResourceMappingTagging
            savedState={wizardState.mappingTagging}
            onStateChange={(newState) => updateWizardState('mappingTagging', newState)}
          />
        );
      case 5:
        return <ResourceSummary wizardState={wizardState} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} onClick={() => handleStepClick(index)} sx={{ cursor: 'pointer' }}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 2, position: 'relative' }}>
        <Slide
          direction={slideDirection} 
          in={true} // Ensure it's always in when the step changes
          mountOnEnter
          unmountOnExit
          key={activeStep} 
        >
          <Box>{getStepContent(activeStep)}</Box>
        </Slide>

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }} variant="outlined">
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {isStepSkippable(activeStep) && (
            <Button onClick={handleSkip} sx={{ mr: 1 }}>
              Skip
            </Button>
          )}
          <Button onClick={handleNext} variant="outlined">
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ResourceWizard;
