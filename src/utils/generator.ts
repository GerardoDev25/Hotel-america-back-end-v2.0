import { citiesList, countries } from '@src/data/seed';

export class Generator {
  static randomBoolean = (): boolean => Math.random() < 0.5;

  static randomNumberBetween = (min: number, max: number): number => {
    if (min >= max) {
      throw new Error('Min must be less than max.');
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  static randomDate = (): string => {
    const start = new Date(1950, 0, 1);
    const end = new Date();
    const date = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  static randomDateBetween = (startDate: string, endDate: string): string => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (isNaN(start) || isNaN(end)) {
      throw new Error('Invalid date format. Please use YYYY-MM-DD.');
    }

    if (start > end) {
      throw new Error('Start date must be before end date.');
    }

    const randomDate = new Date(start + Math.random() * (end - start));
    return randomDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  static randomPhone = (code = '+1'): string => {
    return code + Math.floor(1000000000 + Math.random() * 9000000000); // Random US-style phone number
  };

  static randomName = (
    names = [
      'John Doe',
      'Jane Smith',
      'Alice Johnson',
      'Bob Brown',
      'Emily White',
    ]
  ): string => {
    return names[Math.floor(Math.random() * names.length)];
  };

  static randomUsername = (
    usernames = ['johndoe', 'janesmith', 'alicej', 'bobb', 'emilyw']
  ): string => {
    return usernames[Math.floor(Math.random() * usernames.length)];
  };

  static randomPassword = (): string => {
    return Math.random().toString(36).slice(-8);
  };

  static randomIdentityNumber(length: number = 9): string {
    if (length <= 0) length = 9;

    const randomIdentity = Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');

    return randomIdentity;
  }

  static randomCity(cities = citiesList): string {
    const randomIndex = Math.floor(Math.random() * cities.length);

    return cities[randomIndex];
  }

  static randomCountryId(c = countries): string {
    const randomIndex = Math.floor(Math.random() * c.length);
    return c[randomIndex].id;
  }
  static randomCountryName(c = countries): string {
    const randomIndex = Math.floor(Math.random() * c.length);
    return c[randomIndex].name;
  }
}
