import React, { useState, useEffect ,useMemo, useCallback} from 'react';
import { Stepper, Step, StepLabel, Button, Box, Slide, Alert } from '@mui/material';
import ResourceTypeSelection from './ResourceTypeSelection';
import ResourceConfiguration from './ResourceConfiguration';
import ResourceDataDictionaryTypeSelection from './ResourceDataDictionaryTypeSelection';
import ResourceDataDictionaryConfiguration from './ResourceDataDictionaryConfiguration';
import ResourceMappingTagging from './ResourceMappingTagging';
import ResourceSummary from './ResourceSummary';
import { debounce } from 'lodash';
import { initDB,  getData, setData } from '../utils/storageUtils'


const ResourceWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [slideDirection, setSlideDirection] = useState('left');
  const [prevStep, setPrevStep] = useState(0);
  const [validationError, setValidationError] = useState(null);
    const [wizardState, setWizardState] = useState(() => {
      const savedState = localStorage.getItem('wizardState');
      if (savedState) {
        return JSON.parse(savedState);
      }    
      return {
        resourceSetup: {
          resourceName: '',
          standardizedSourceName: '',
          collection: 'None',
          resourceTags: ['source'],
          resourceDescription: '',
          resourceType: 'file',
          isValid: false
        },
        resourceConfig: {
          expandedAccordion: 'ingestionSetup',
          activeTab: 0,
          sourceInfo: null,
          schema: null,
          processedSchema: null,
          fullData: null,
          sampleData: null,
          rawData: null,
          ingestionSettings: {},
          ingestionConfig: {},
          uploadStatus: null,
          error: null
        },
        ddResourceSetup: {
          resourceName: '',
          standardizedSourceName: '',
          collection: 'None',
          resourceTags: ['datadictionary'],
          resourceDescription: '',
          resourceType: 'dd_new',
          isValid: false
        },
        ddResourceConfig: {
          expandedAccordion: 'ingestionSetup',
          activeTab: 0,
          sourceInfo: null,
          schema: null,
          processedSchema: null,
          fullData: null,
          sampleData: null,
          rawData: null,
          ingestionSettings: {},
          ingestionConfig: {},
          uploadStatus: null,
          error: null,
          previewRows: null
        }
      };
    });


    useEffect(() => {
      initDB();
    
      const essentialState = {
        resourceSetup: wizardState.resourceSetup,
        ddResourceSetup: wizardState.ddResourceSetup,
        currentStep: wizardState.currentStep
      };
      localStorage.setItem('wizardStateEssential', JSON.stringify(essentialState));
    
      if (wizardState.resourceConfig?.fullData) {
        setData('resourceFullData', wizardState.resourceConfig.fullData);
      }
      if (wizardState.resourceConfig?.sampleData) {
        setData('resourceSampleData', wizardState.resourceConfig.sampleData);
      }
      if (wizardState.dataDictionaryConfig?.fullData) {
        setData('ddResourceFullData', wizardState.dataDictionaryConfig.fullData);
      }    
      if (wizardState.dataDictionaryConfig?.sampleData) {
        setData('ddResourceSampleData', wizardState.dataDictionaryConfig.sampleData);
      }
      if (wizardState.dataDictionaryConfig?.previewRows) {
        setData('ddResourcePreviewRows', wizardState.dataDictionaryConfig.previewRows);
      }
    }, [wizardState]);
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem('wizardStateEssential');
      localStorage.removeItem('resourceGeneralConfig');
      localStorage.clear();
    };
  }, []);
  const steps = ['Resource Type', 'Configure Resource', 'Data Dictionary Type', 'Data Dictionary', 'Mapping & Tagging', 'Summary'];

  // Ensure that the first step is displayed properly on initial load
  useEffect(() => {
    if (activeStep === 0) {
      setSlideDirection('left');
    }
  }, [activeStep]);




const handleNext = () => {
  switch (activeStep) {
    case 0:
      const typeSelectionValid = wizardState.resourceSetup?.isValid;
      if (!typeSelectionValid) {
        setValidationError('Please complete all required fields');
        return;
      }
      break;
  }
  setSlideDirection('left');
  setValidationError(null);
  setPrevStep(activeStep);
  setActiveStep((prevStep) => prevStep + 1);
};

const validateTypeSelection = (setup) => {
      return setup.resourceType && 
             setup.standardizedSourceName && 
             setup.resourceDescription;
};
    

const handleBack = async () => {
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

  const debouncedStateUpdate = useMemo(
    () => debounce((step, newState, setWizardState) => {
      if (JSON.stringify(wizardState[step]) !== JSON.stringify(newState)) {
        setWizardState(prev => ({
          ...prev,
          [step]: newState
        }));
      }
    }, 1000),
    [wizardState]  // Only depend on wizardState changes
  );

  const updateWizardState = useCallback((step, newState) => {
    setWizardState(prevState => {
      const currentStateStr = JSON.stringify(prevState[step]);
      const newStateStr = JSON.stringify(newState);
      if (currentStateStr === newStateStr) {
        return prevState;
      }
      return {
        ...prevState,
        [step]: newState
      };
    });
  }, []);

  // const updateWizardState = useCallback((step, newState) => {
  //   setWizardState(prevState => ({
  //     ...prevState,
  //     [step]: {
  //       ...newState,
  //       isValid: newState.isValid
  //     }
  //   }));
  // }, []);  
  
  // Remove or conditionally render console.log
  const DEBUG = false;
  useEffect(() => {
    if (DEBUG) {
      console.log('Current Wizard State:', wizardState);
    }
  }, [wizardState]);
  

  // Add memoization for the state logging
  const logWizardState = useMemo(() => {
    // console.log('Current Wizard State:', wizardState);
  }, [wizardState]);

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
        const resourceSetupConfigState = {
          ...wizardState.resourceSetup,
          config: wizardState.resourceConfig
        };
        return (
          <ResourceConfiguration
            savedState={wizardState}
            onStateChange={(newState) => updateWizardState('resourceConfig', newState)}
          />
        );
      case 2:
        return (
          <ResourceDataDictionaryTypeSelection
            savedState={wizardState.ddResourceSetup}
            onStateChange={(newState) => updateWizardState('ddResourceSetup', newState)}
          />
        );
      case 3:
        const ddResourceSetupConfigState = {
          ...wizardState.resourceSetup,
          config: wizardState.resourceConfig
        };
        return (
          <ResourceDataDictionaryConfiguration
            savedState={wizardState}
            onStateChange={(newState) => updateWizardState('dataDictionaryConfig', newState)}
          />
        );
      case 4:
        return (
          <ResourceMappingTagging
            savedState={wizardState}
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
      {validationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationError}
        </Alert>
      )}
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} onClick={() => handleStepClick(index)} sx={{ cursor: 'pointer' }}>
            <StepLabel
              StepIconProps={{
                sx: { cursor: 'pointer' },
              }}
              sx={{ userSelect: 'none' }} 
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 2, position: 'relative' }}>
        <Slide
          direction={slideDirection} 
          in={true} //  always in when the step changes
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
