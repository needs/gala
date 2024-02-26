function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function extractNameFromEmail(email: string) {
  return email
    .split('@')[0]
    .replace(/[0-9]/g, '')
    .split(/[._]+/)
    .map(capitalizeFirstLetter)
    .join(' ');
}

export function getUserName(email?: string, name?: string) {
  if (name !== undefined) {
    return name;
  }

  if (email !== undefined) {
    return extractNameFromEmail(email);
  }

  return 'Anonymous';
}

export function avatarUrl(name: string) {
  return `https://ui-avatars.com/api/?${new URLSearchParams({
    name,
    format: 'svg',
    background: 'random',
  }).toString()}`;
}
