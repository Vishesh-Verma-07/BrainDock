type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[];

function cnImpl(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  const walk = (value: ClassValue): void => {
    if (typeof value === "string" || typeof value === "number") {
      classes.push(String(value));
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
  };

  inputs.forEach(walk);
  return classes.join(" ");
}

export function cn(...inputs: ClassValue[]): string {
  return cnImpl(...inputs);
}