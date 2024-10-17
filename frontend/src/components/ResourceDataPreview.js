import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const ResourceDataPreview = ({ sourceData }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="General" />
        <Tab label="Schema" />
        <Tab label="Sample Data" />
      </Tabs>
      <TabPanel value={value} index={0}>
        {/* General information about the file */}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {/* Schema information */}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {/* Sample data grid */}
      </TabPanel>
    </div>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default ResourceDataPreview;
