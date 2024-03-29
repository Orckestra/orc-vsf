import { UserGetters } from '@vue-storefront/core';
import type { User } from 'orc-vsf-api';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFirstName(user: User): string {
  return user?.firstName;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getLastName(user: User): string {
  return user?.lastName;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFullName(user: User): string {
  return `${user?.firstName} ${user?.lastName}`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getEmailAddress(user: User): string {
  return user?.email;
}

export const userGetters: UserGetters<User> = {
  getFirstName,
  getLastName,
  getFullName,
  getEmailAddress
};
