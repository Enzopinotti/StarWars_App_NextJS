export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const mapGender = (gender) => {
    return gender === 'n/a' ? 'Indefinido' : capitalizeFirstLetter(gender);
};

export const normalizeString = (input) => {
    return input.toLowerCase().replace(/, /g, '_').replace(/ /g, '_');
  };