export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};
export const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role || null;
};

