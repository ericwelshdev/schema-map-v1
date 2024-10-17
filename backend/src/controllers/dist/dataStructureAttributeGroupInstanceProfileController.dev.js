"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var DataStructureAttributeGroupInstanceProfile = require('../models/DataStructureAttributeGroupInstanceProfile');

var dataStructureAttributeGroupInstanceProfileController = {
  // Get all profiles
  getAllProfiles: function getAllProfiles(req, res) {
    var profiles;
    return regeneratorRuntime.async(function getAllProfiles$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(DataStructureAttributeGroupInstanceProfile.findAll());

          case 3:
            profiles = _context.sent;
            res.json(profiles);
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            res.status(500).json({
              message: 'Error fetching profiles',
              error: _context.t0.message
            });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 7]]);
  },
  // Get a single profile by id
  getProfileById: function getProfileById(req, res) {
    var profile;
    return regeneratorRuntime.async(function getProfileById$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(DataStructureAttributeGroupInstanceProfile.findByPk(req.params.id));

          case 3:
            profile = _context2.sent;

            if (profile) {
              res.json(profile);
            } else {
              res.status(404).json({
                message: 'Profile not found'
              });
            }

            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            res.status(500).json({
              message: 'Error fetching profile',
              error: _context2.t0.message
            });

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 7]]);
  },
  // Create a new profile
  createProfile: function createProfile(req, res) {
    var newProfile;
    return regeneratorRuntime.async(function createProfile$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return regeneratorRuntime.awrap(DataStructureAttributeGroupInstanceProfile.create(req.body));

          case 3:
            newProfile = _context3.sent;
            res.status(201).json(newProfile);
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            res.status(400).json({
              message: 'Error creating profile',
              error: _context3.t0.message
            });

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 7]]);
  },
  // Update a profile
  updateProfile: function updateProfile(req, res) {
    var _ref, _ref2, updated, updatedProfile;

    return regeneratorRuntime.async(function updateProfile$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return regeneratorRuntime.awrap(DataStructureAttributeGroupInstanceProfile.update(req.body, {
              where: {
                ds_attr_grp_instc_prof_id: req.params.id
              }
            }));

          case 3:
            _ref = _context4.sent;
            _ref2 = _slicedToArray(_ref, 1);
            updated = _ref2[0];

            if (!updated) {
              _context4.next = 13;
              break;
            }

            _context4.next = 9;
            return regeneratorRuntime.awrap(DataStructureAttributeGroupInstanceProfile.findByPk(req.params.id));

          case 9:
            updatedProfile = _context4.sent;
            res.json(updatedProfile);
            _context4.next = 14;
            break;

          case 13:
            res.status(404).json({
              message: 'Profile not found'
            });

          case 14:
            _context4.next = 19;
            break;

          case 16:
            _context4.prev = 16;
            _context4.t0 = _context4["catch"](0);
            res.status(400).json({
              message: 'Error updating profile',
              error: _context4.t0.message
            });

          case 19:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 16]]);
  },
  // Delete a profile
  deleteProfile: function deleteProfile(req, res) {
    var deleted;
    return regeneratorRuntime.async(function deleteProfile$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return regeneratorRuntime.awrap(DataStructureAttributeGroupInstanceProfile.destroy({
              where: {
                ds_attr_grp_instc_prof_id: req.params.id
              }
            }));

          case 3:
            deleted = _context5.sent;

            if (deleted) {
              res.status(204).send();
            } else {
              res.status(404).json({
                message: 'Profile not found'
              });
            }

            _context5.next = 10;
            break;

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](0);
            res.status(500).json({
              message: 'Error deleting profile',
              error: _context5.t0.message
            });

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[0, 7]]);
  }
};
module.exports = dataStructureAttributeGroupInstanceProfileController;