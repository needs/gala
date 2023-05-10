export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function fullName({ firstName, lastName }: { firstName: string, lastName: string }) {
  return `${capitalizeFirstLetter(firstName)} ${lastName.toUpperCase()}`;
}
