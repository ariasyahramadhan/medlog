
export const saveAuth = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
};

export const getToken = () => localStorage.getItem("token");

export const getUser = () =>
    JSON.parse(localStorage.getItem("user"));

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};
