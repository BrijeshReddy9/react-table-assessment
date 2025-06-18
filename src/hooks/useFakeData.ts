import { faker } from '@faker-js/faker';
import { User } from '../App';

/**
 * Generates an array of fake user data.
 * - fullName is derived from first and last name.
 * - dsr (Days Since Registered) is calculated from the registration date.
 */
export const generateFakeUsers = (count: number = 500): User[] => {
  return Array.from({ length: count }).map((_, i) => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const registeredDate = faker.date.past();

    return {
      id: i + 1,
      firstName,
      lastName,
      email: faker.internet.email(firstName, lastName),
      city: faker.address.city(),
      registeredDate: registeredDate.toISOString().split('T')[0],
      fullName: `${firstName} ${lastName}`,
      dsr: Math.floor((Date.now() - registeredDate.getTime()) / (1000 * 60 * 60 * 24)),
    };
  });
};