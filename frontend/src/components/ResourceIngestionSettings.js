import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandIcon from '@mui/icons-material/Expand';

const ResourceIngestionSettings = ({ sourceData, setSourceData }) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Source Ingestion Settings</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Add dynamic ingestion settings based on file type */}
      </AccordionDetails>
    </Accordion>
  );
};

export default ResourceIngestionSettings;
