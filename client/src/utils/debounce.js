// utils/debounce.js
export const debounce = (callback, delay = 1000) => {
  let timeoutId;
  return (e) => {
    const form = e.currentTarget.form;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(form);
    }, delay);
  };
};
