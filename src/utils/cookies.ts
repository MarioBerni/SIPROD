import Cookies from 'js-cookie';

export const getCookie = (name) => {
    console.log(`Getting cookie ${name}:`, Cookies.get(name));
    return Cookies.get(name);
};

export const setCookie = (name, value, options) => {
    console.log(`Setting cookie ${name} with options:`, { ...options, value });
    Cookies.set(name, value, options);
    console.log(`Cookie ${name} set successfully`);
};

// ...existing code...
