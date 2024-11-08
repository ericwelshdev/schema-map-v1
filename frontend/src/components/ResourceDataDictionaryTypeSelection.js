import React, { useState, useEffect, useCallback } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  MenuItem,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Autocomplete,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FileText, Database, TextCursorInput } from "lucide-react";
import { useView } from './../contexts/ViewContext';

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: theme.spacing(2),
  "&:hover": {
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
  },
}));

const ResourceDataDictionaryTypeSelection = ({ savedState, onStateChange, existingSourceNames }) => {
  const { setFooterAlert } = useView();

  const [ddResourceSetup, setddResourceSetup] = useState(() => {
    return savedState || {
      resourceName: '',
      standardizedSourceName: '',
      resourceVersionText: '',
      collection: 'None',
      resourceTags: ['datadictionary'],
      resourceDescription: '',
      resourceType: 'dd_new'
    };
  }); 

// const ResourceDataDictionaryTypeSelection = ({ savedState, onStateChange, existingSourceNames }) => {
//   const [ddResourceSetup, setddResourceSetup] = useState(() => {
//     const saved = localStorage.getItem("wizardStateEssential.ddResourceSetup");
//     return saved
//       ? JSON.parse(saved)
//       : savedState.ddResourceSetup || {
//           resourceName: "",
//           standardizedSourceName: "",
//           resourceVersionText: "",
//           collection: "None",
//           resourceTags: ["datadictionary"],
//           resourceDescription: "",
//           resourceType: "dd_new",
//         };
//   });

 

  useEffect(() => {
    localStorage.setItem('wizardStateEssential', JSON.stringify(ddResourceSetup));
  }, [ddResourceSetup]);
  const [errors, setErrors] = useState({});
  const [sourceTags] = useState([
    "target",
    "datadictionary",
    "source",
    "data",
    "resource",
  ]);

  // Form validation
      const validateForm = useCallback(() => {
    const newErrors = {};
        if (!ddResourceSetup.resourceName) {
      newErrors.resourceName = "Data Dictionary name is required";
    }

        if (!ddResourceSetup.resourceType) {
      newErrors.resourceType = "Data Dictionary type is required";
    }

    setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        onStateChange({ ...ddResourceSetup, isValid });
        return isValid;
      }, [ddResourceSetup, onStateChange]);

  useEffect(() => {
        validateForm();
      }, [validateForm]);
  



  const handleInputChange = (field, value) => {
    setddResourceSetup((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setFooterAlert({
      type: errors[field] ? 'error' : 'info',
      message: errors[field] || `Updated ${field}`
    });
  };

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Data Dictionary Source
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Data Dictionary Name"
              variant="outlined"
              value={ddResourceSetup.resourceName}
              onChange={(e) =>
                handleInputChange("resourceName", e.target.value)
              }
              placeholder="Enter source name"
              required
              error={!!errors.resourceName}
              helperText={errors.resourceName}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Standardized Data Dictionary Name"
              variant="outlined"
              value={ddResourceSetup.standardizedSourceName}
              onChange={(e) =>
                handleInputChange("standardizedSourceName", e.target.value)
              }
              placeholder="Enter a Standardized Data Dictionary Name"
              helperText={errors.standardizedSourceName}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <TextField
                select
                label="Collection"
                defaultValue={"None"}
                value={ddResourceSetup.collection}
                onChange={(e) =>
                  handleInputChange("collection", e.target.value)
                }
                variant="outlined"
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Collection1">Collection 1</MenuItem>
                <MenuItem value="Collection2">Collection 2</MenuItem>
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={8}>
            <Autocomplete
              multiple
              id="resourceTags"
              options={sourceTags}
              value={ddResourceSetup.resourceTags}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      variant="outlined"
                      label={option}
                      key={key}
                      {...tagProps}
                      onDelete={
                        option === "datadictionary"
                          ? () => {}
                          : tagProps.onDelete
                      }
                      disabled={option === "datadictionary"}
                      sx={{
                        backgroundColor:
                          option === "datadictionary" ? "default" : "lightblue",
                        "& .MuiChip-deleteIcon": {
                          display: "flex",
                        },
                      }}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Data Dictionary Tags"
                  placeholder="Enter tags"
                />
              )}
              onChange={(event, newValue) => {
                const updatedTags = newValue.includes("datadictionary")
                  ? newValue
                  : ["datadictionary", ...newValue];
                handleInputChange("resourceTags", updatedTags);
              }}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <FormControl fullWidth>
              <TextField
                fullWidth
                label="Resource Version"
                variant="outlined"
                value={ddResourceSetup.resourceVersionText}
                onChange={(e) =>
                  handleInputChange("versionText", e.target.value)
                }
                placeholder="Enter version number"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Data Dictionary Description"
              variant="outlined"
              value={ddResourceSetup.resourceDescription}
              onChange={(e) =>
                handleInputChange("resourceDescription", e.target.value)
              }
              placeholder="Enter data dictionary description"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Choose Data Dictionary Option:
            </Typography>
            <RadioGroup
              aria-label="source type"
              name="sourceType"
              defaultValue={"dd_new"}
              value={ddResourceSetup.resourceType}
              onChange={(e) =>
                handleInputChange("resourceType", e.target.value)
              }
            >
              <Box display="flex">
                <FormControlLabel
                  value="dd_new"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      <FileText style={{ marginRight: "8px" }} />
                      Add New Data Dictionary
                    </Box>
                  }
                />
                <FormControlLabel
                  value="dd_existing"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      <Database style={{ marginRight: "8px" }} />
                      Assign Existing Data Dictionary
                    </Box>
                  }
                />
                <FormControlLabel
                  value="dd_manual"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      <TextCursorInput style={{ marginRight: "8px" }} />
                      Manually Create Data Dictionary
                    </Box>
                  }
                />
              </Box>
            </RadioGroup>
            {errors.resourceType && (
              <Typography color="error">{errors.resourceType}</Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  );
};

export default ResourceDataDictionaryTypeSelection;
