import React, { useState, useEffect ,useMemo, useCallback} from 'react';
import { Stepper, Step, StepLabel, Button, Box, Slide, Alert } from '@mui/material';
import ResourceDataDictionaryTypeSelection from './ResourceDataDictionaryTypeSelection';
import ResourceDataDictionaryConfiguration from './ResourceDataDictionaryConfiguration';
import ResourceDataDictionaryClassificationSummary from './ResourceDataDictionaryClassificationSummary';
import ResourceDataDictionarySummary from './ResourceDataDictionarySummary';
import { initDB, getData, setData } from '../utils/storageUtils';

const ResourceDataDictionaryWizard = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [slideDirection, setSlideDirection] = useState('left');
    const [prevStep, setPrevStep] = useState(0);
    const [validationError, setValidationError] = useState(null);
    const [wizardState, setWizardState] = useState({
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
    });

    const steps = ['Data Dictionary Type', 'Data Dictionary Config', 'Data Dictionary Classification Summary', 'Summary'];

    useEffect(() => {
        initDB();
        const essentialState = {
            ddResourceSetup: wizardState.ddResourceSetup,
            currentStep: wizardState.currentStep
        };
        localStorage.setItem('wizardStateEssential', JSON.stringify(essentialState));
    }, [wizardState]);

    const handleNext = () => {
  switch (activeStep) {
    case 0:
      const typeSelectionValid = wizardState.ddResourceSetup?.isValid;
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

    const updateWizardState = useCallback((step, newState) => {
        setWizardState(prevState => ({
            ...prevState,
            [step]: newState
        }));
    }, []);

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <ResourceDataDictionaryTypeSelection
                        savedState={wizardState.ddResourceSetup}
                        onStateChange={(newState) => updateWizardState('ddResourceSetup', newState)}
                    />
                );
            case 1:
                return (
                    <ResourceDataDictionaryConfiguration
                        savedState={wizardState}
                        onStateChange={(newState) => updateWizardState('dataDictionaryConfig', newState)}
                    />
                );
            case 2:
                return (
                    <ResourceDataDictionaryClassificationSummary
                        classificationData={wizardState.dataDictionaryConfig?.processedSchema}
                        onStateChange={(newState) => updateWizardState('classificationSummary', newState)}
                    />
                );
            case 3:
                return <ResourceDataDictionarySummary wizardState={wizardState} />;
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
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ mt: 2, position: 'relative' }}>
                <Slide
                    direction={slideDirection}
                    in={true}
                    mountOnEnter
                    unmountOnExit
                    key={activeStep}
                >
                    <Box>{getStepContent(activeStep)}</Box>
                </Slide>

                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                        variant="outlined"
                    >
                        Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleNext} variant="outlined">
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ResourceDataDictionaryWizard;
