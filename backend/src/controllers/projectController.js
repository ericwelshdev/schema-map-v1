const Project = require('../models/Project');

// Create a new project
exports.create = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

  
// Get all projects
exports.getAll = async (req, res) => {
    console.log('5. Executing getAll in projectController');
    try {
        console.log('Executing SQL query:', Project.findAll().toString());
              const projects = await Project.findAll({
                logging: console.log
              });
        console.log('7. SQL query result:', projects.toString());
        res.status(200).json(projects);
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(400).json({ error: error.message });
    }
};

// Get project by ID
exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findByPk(id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a project
exports.update = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findByPk(id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        await project.update(req.body);
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a project
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findByPk(id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        await project.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
