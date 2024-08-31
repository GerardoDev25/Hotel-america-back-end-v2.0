export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleanedObj: Partial<T> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (value !== undefined && value !== null && !Number.isNaN(value)) {
        cleanedObj[key] = value;
      }
    }
  }

  return cleanedObj;
}
