import Cookies from 'js-cookie';

export function getCookie(name: string): string | undefined {
  try {
    const value = Cookies.get(name);
    console.log(`Getting cookie ${name}:`, value ? 'PRESENT' : 'NOT FOUND');
    return value;
  } catch (error) {
    console.error(`Error getting cookie ${name}:`, error);
    return undefined;
  }
}

export function setCookie(name: string, value: string, options: Cookies.CookieAttributes = {}): void {
  try {
    const defaultOptions: Cookies.CookieAttributes = {
      expires: 1, // 1 día
      path: '/',
      sameSite: 'Strict',
      secure: true
    };

    const cookieOptions = { ...defaultOptions, ...options };
    console.log(`Setting cookie ${name} with options:`, cookieOptions);
    
    Cookies.set(name, value, cookieOptions);
    console.log(`Cookie ${name} set successfully`);
  } catch (error) {
    console.error(`Error setting cookie ${name}:`, error);
    throw error;
  }
}

export function removeCookie(name: string): void {
  try {
    console.log(`Removing cookie ${name}`);
    Cookies.remove(name, { path: '/' });
    console.log(`Cookie ${name} removed successfully`);
  } catch (error) {
    console.error(`Error removing cookie ${name}:`, error);
  }
}
