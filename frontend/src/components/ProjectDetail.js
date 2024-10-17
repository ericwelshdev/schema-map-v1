import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { useWorkspace } from '../context/WorkspaceContext';

const ProjectDetail = ({ project, index }) => {
  const [localProject, setLocalProject] = useState(project);
  const { updateTab } = useWorkspace();

  useEffect(() => {
    const saveInterval = setInterval(() => {
      updateTab(index, localProject);
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [localProject, index, updateTab]);

  const handleChange = (e) => {
    setLocalProject({ ...localProject, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <TextField
        name="proj_nm"
        label="Project Name"
        value={localProject.proj_nm}
        onChange={handleChange}
      />
      <TextField
        name="proj_desc"
        label="Description"
        value={localProject.proj_desc}
        onChange={handleChange}
        multiline
      />
      <Button onClick={() => updateTab(index, localProject)}>Save</Button>
    </div>
  );
};

export default ProjectDetail;
