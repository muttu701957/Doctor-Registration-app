// Which blood groups can donate to a given recipient group
const COMPATIBLE_DONORS = {
  'O-':  ['O-'],
  'O+':  ['O-', 'O+'],
  'A-':  ['O-', 'A-'],
  'A+':  ['O-', 'O+', 'A-', 'A+'],
  'B-':  ['O-', 'B-'],
  'B+':  ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

// Which blood groups a donor can donate to
const CAN_DONATE_TO = {
  'O-':  ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+':  ['O+', 'A+', 'B+', 'AB+'],
  'A-':  ['A-', 'A+', 'AB-', 'AB+'],
  'A+':  ['A+', 'AB+'],
  'B-':  ['B-', 'B+', 'AB-', 'AB+'],
  'B+':  ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

export const ALL_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/**
 * Given a required blood group, returns all compatible donor groups.
 * E.g. getCompatibleDonors('A+') → ['O-', 'O+', 'A-', 'A+']
 */
export const getCompatibleDonors = (requiredGroup) => {
  return COMPATIBLE_DONORS[requiredGroup] || [requiredGroup];
};

/**
 * Given a donor's blood group, returns all recipient groups they can donate to.
 */
export const getCanDonateTo = (donorGroup) => {
  return CAN_DONATE_TO[donorGroup] || [donorGroup];
};

/**
 * Check if a donor's group is compatible with the required group.
 */
export const isCompatible = (donorGroup, requiredGroup) => {
  const compatible = COMPATIBLE_DONORS[requiredGroup] || [];
  return compatible.includes(donorGroup);
};
