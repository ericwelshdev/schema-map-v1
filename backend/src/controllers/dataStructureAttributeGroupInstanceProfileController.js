const DataStructureAttributeGroupInstanceProfile = require('../models/DataStructureAttributeGroupInstanceProfile');

const dataStructureAttributeGroupInstanceProfileController = {
  // Get all profiles
  getAllProfiles: async (req, res) => {
    try {
      const profiles = await DataStructureAttributeGroupInstanceProfile.findAll();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profiles', error: error.message });
    }
  },

  // Get a single profile by id
  getProfileById: async (req, res) => {
    try {
      const profile = await DataStructureAttributeGroupInstanceProfile.findByPk(req.params.id);
      if (profile) {
        res.json(profile);
      } else {
        res.status(404).json({ message: 'Profile not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
  },

  // Create a new profile
  createProfile: async (req, res) => {
    try {
      const newProfile = await DataStructureAttributeGroupInstanceProfile.create(req.body);
      res.status(201).json(newProfile);
    } catch (error) {
      res.status(400).json({ message: 'Error creating profile', error: error.message });
    }
  },

  // Update a profile
  updateProfile: async (req, res) => {
    try {
      const [updated] = await DataStructureAttributeGroupInstanceProfile.update(req.body, {
        where: { ds_attr_grp_instc_prof_id: req.params.id }
      });
      if (updated) {
        const updatedProfile = await DataStructureAttributeGroupInstanceProfile.findByPk(req.params.id);
        res.json(updatedProfile);
      } else {
        res.status(404).json({ message: 'Profile not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Error updating profile', error: error.message });
    }
  },

  // Delete a profile
  deleteProfile: async (req, res) => {
    try {
      const deleted = await DataStructureAttributeGroupInstanceProfile.destroy({
        where: { ds_attr_grp_instc_prof_id: req.params.id }
      });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Profile not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting profile', error: error.message });
    }
  }
};

module.exports = dataStructureAttributeGroupInstanceProfileController;
