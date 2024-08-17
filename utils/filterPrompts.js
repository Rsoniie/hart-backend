function filterNonEmptyValues(obj) {
    let result = {};
  
    Object.entries(obj).forEach(([category, prompts]) => {
      if (typeof prompts === 'object') {
        Object.entries(prompts).forEach(([key, value]) => {
          if (value !== '') {
            result[key] = value; // Directly use key without prefix
          }
        });
      }
    });
  
    return result;
}

module.exports = filterNonEmptyValues