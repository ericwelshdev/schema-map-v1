/**
 * @typedef {Object} Column
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {string} [description]
 * @property {any[]} [sampleData]
 */

/**
 * @typedef {Object} Mapping
 * @property {string} sourceId
 * @property {string} targetId
 * @property {number} confidence
 * @property {Object[]} [transformations]
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid
 * @property {number} score
 * @property {string} message
 * @property {Object} details
 */

/**
 * @typedef {Object} TransformationRule
 * @property {string} type
 * @property {Object} params
 * @property {Function} transform
 */

import PropTypes from 'prop-types';

export const MappingPropTypes = {
  sourceSchema: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string,
    sampleData: PropTypes.array
  })).isRequired,
  targetSchema: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string
  })).isRequired,
  onMappingComplete: PropTypes.func.isRequired
};
