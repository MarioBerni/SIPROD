import Cookies from 'js-cookie';

export function getCookie(name: string): string | undefined {
  const value = Cookies.get(name);
  console.log(`Cookie ${name} value:`, value);
  return value;
}

export function setCookie(name: string, value: string, options: Cookies.CookieAttributes = {}): void {
  const defaultOptions: Cookies.CookieAttributes = {
    expires: 1, // 1 día
    path: '/',
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production',
  };

  const cookieOptions = { ...defaultOptions, ...options };
  console.log(`Setting cookie: ${name}=${value};expires=${cookieOptions.expires};path=${cookieOptions.path};SameSite=${cookieOptions.sameSite};secure=${cookieOptions.secure}`);
  
  Cookies.set(name, value, cookieOptions);
}

export function removeCookie(name: string): void {
  console.log(`Removed cookie: ${name}`);
  Cookies.remove(name, { path: '/' });
}
