import React, { useState, useEffect, useCallback  } from "react";
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
import { FileText, Database, Globe } from "lucide-react";
import { useView } from './../contexts/ViewContext';

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: theme.spacing(2),
  "&:hover": {
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
  },
}));

const ResourceTypeSelection = ({ savedState, onStateChange, existingSourceNames }) => {
  const { setFooterAlert } = useView();
  
  const [resourceSetup, setResourceSetup] = useState(() => {
    return savedState || {
      resourceName: '',
      standardizedSourceName: '',
      resourceVersionText: '',
      collection: 'None',
      resourceTags: ['source'],
      resourceDescription: '',
      resourceType: 'file'
    };
  });
  

 

  useEffect(() => {
    localStorage.setItem('wizardStateEssential', JSON.stringify(resourceSetup));
  }, [resourceSetup]);
  const [errors, setErrors] = useState({});
  const [sourceTags] = useState([
    "target",
    "source",
    "data",
    "resource",
  ]);

      // Form validation
      const validateForm = useCallback(() => {
        const newErrors = {};
        if (!resourceSetup.resourceName) {
          newErrors.resourceName = "Resource name is required";
        }
        if (!resourceSetup.standardizedSourceName) {
          newErrors.standardizedSourceName = "Standardized name is required";
        }
        if (!resourceSetup.resourceType) {
          newErrors.resourceType = "Resource type is required";
        }

        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        onStateChange({ ...resourceSetup, isValid });
        return isValid;
      }, [resourceSetup, onStateChange]);

      useEffect(() => {
        validateForm();
      }, [validateForm]);
  

  // useEffect(() => {
  //   onStateChange({ ...resourceSetup, isValid: validateForm() });
  // }, [onStateChange, resourceSetup, validateForm]);

  const handleInputChange = (field, value) => {
    setResourceSetup((prevState) => ({
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
          Resource Source
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Resource Name"
              variant="outlined"
              value={resourceSetup.resourceName}
              onChange={(e) =>
                handleInputChange("resourceName", e.target.value)
              }
              placeholder="Enter Resource name"
              required
              error={!!errors.resourceName}
              helperText={errors.resourceName}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Standardized Resource Name"
              variant="outlined"
              value={resourceSetup.standardizedSourceName}
              onChange={(e) =>
                handleInputChange("standardizedSourceName", e.target.value)
              }
              placeholder="Enter a Standardized Resource Name"
              required
              error={!!errors.standardizedSourceName}
              helperText={errors.standardizedSourceName}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <TextField
                select
                label="Collection"
                defaultValue={"None"}
                value={resourceSetup.collection}
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
              value={resourceSetup.resourceTags}
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
                        option === "source"
                          ? () => {}
                          : tagProps.onDelete
                      }
                      disabled={option === "source"}
                      sx={{
                        backgroundColor:
                          option === "source" ? "default" : "lightblue",
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
                  label="Resource Tags"
                  placeholder="Enter tags"
                />
              )}
              onChange={(event, newValue) => {
                const updatedTags = newValue.includes("source")
                  ? newValue
                  : ["source", ...newValue];
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
                value={resourceSetup.resourceVersionText}
                onChange={(e) =>
                  handleInputChange("resourceVersionText", e.target.value)
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
              label="Resource Description"
              variant="outlined"
              value={resourceSetup.resourceDescription}
              onChange={(e) =>
                handleInputChange("resourceDescription", e.target.value)
              }
              placeholder="Enter resource description"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Choose Resource Type:
            </Typography>
            <RadioGroup
              aria-label="source type"
              name="sourceType"
              defaultValue={"file"}
              value={resourceSetup.resourceType}
              onChange={(e) =>
                handleInputChange("resourceType", e.target.value)
              }
            >
              <Box display="flex">
                <FormControlLabel
                  value="file"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      <FileText style={{ marginRight: "8px" }} />
                      File
                    </Box>
                  }
                />
                <FormControlLabel
                  value="database"
                  control={<Radio />}
                  disabled={true}
                  label={
                    <Box display="flex" alignItems="center">
                      <Database style={{ marginRight: "8px" }} />
                      Database
                    </Box>
                  }
                />
                <FormControlLabel
                  value="api"
                  control={<Radio />}
                  disabled={true}
                  label={
                    <Box display="flex" alignItems="center">
                      <Globe style={{ marginRight: "8px" }} />
                      API
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

export default ResourceTypeSelection;


