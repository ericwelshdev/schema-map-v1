const transformCase = (value, params) => {
  if (!value) return value;
  
  switch (params.type) {
    case 'UPPER':
      return value.toUpperCase();
    case 'LOWER':
      return value.toLowerCase();
    case 'TITLE':
      return value.replace(/\w\S*/g, txt => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    case 'CAMEL':
      return value.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => 
        chr.toUpperCase()
      );
    default:
      return value;
  }
};

const formatValue = (value, params) => {
  if (!value) return value;
  
  switch (params.type) {
    case 'DATE':
      return new Date(value).toLocaleDateString(params.locale, params.options);
    case 'NUMBER':
      return Number(value).toLocaleString(params.locale, params.options);
    case 'TRIM':
      return value.trim();
    case 'PAD':
      return value.padStart(params.length, params.char);
    default:
      return value;
  }
};

const replaceValue = (value, params) => {
  if (!value) return value;
  
  const { search, replacement, useRegex } = params;
  if (useRegex) {
    const regex = new RegExp(search, params.flags);
    return value.replace(regex, replacement);
  }
  return value.split(search).join(replacement);
};

export const transformValue = (value, rule) => {
  switch (rule.type) {
    case 'CASE':
      return transformCase(value, rule.params);
    case 'FORMAT':
      return formatValue(value, rule.params);
    case 'REPLACE':
      return replaceValue(value, rule.params);
    case 'CUSTOM':
      return rule.transform(value);
    default:
      return value;
  }
};

export const generateTransformationPreview = (sourceData, rules) => {
  return sourceData.map(value => ({
    original: value,
    steps: rules.map(rule => ({
      rule: rule.type,
      result: transformValue(value, rule)
    })),
    final: rules.reduce((acc, rule) => transformValue(acc, rule), value)
  }));
};