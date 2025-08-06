// Property type categories
export const ACCOMMODATION_TYPES = ['hotel', 'guesthouse', 'resort', 'hostel'];
export const DINING_TYPES = ['restaurant', 'cafe'];

// Utility functions for property type management
export const getPropertyType = (): string | null => {
  return localStorage.getItem('propertyType');
};

export const setPropertyType = (propertyType: string): void => {
  localStorage.setItem('propertyType', propertyType);
};

export const isAccommodationType = (propertyType: string): boolean => {
  return ACCOMMODATION_TYPES.includes(propertyType);
};

export const isDiningType = (propertyType: string): boolean => {
  return DINING_TYPES.includes(propertyType);
};

export const getPropertyCategory = (propertyType: string): 'accommodation' | 'dining' | 'unknown' => {
  if (isAccommodationType(propertyType)) return 'accommodation';
  if (isDiningType(propertyType)) return 'dining';
  return 'unknown';
};