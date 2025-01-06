export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    console.log(`Cookie ${name} value:`, cookieValue); // Debug log
    return cookieValue || null;
  }
  
  console.log(`Cookie ${name} not found`); // Debug log
  return null;
}

export function setCookie(name: string, value: string, days = 1): void {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  const cookieValue = `${name}=${value};${expires};path=/;SameSite=Strict;secure`;
  document.cookie = cookieValue;
  console.log(`Setting cookie: ${cookieValue}`); // Debug log
}

export function removeCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict;secure`;
  console.log(`Removed cookie: ${name}`); // Debug log
}
