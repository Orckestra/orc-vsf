import type {
  UserAddress as AddressItem
} from 'orc-vsf-api';
import { UserAddressGetters } from '../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDefault(addresses: AddressItem[]): AddressItem {
  return addresses.find(a => a.isPreferredShipping && a.isPreferredBilling);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDefaultShipping(addresses: AddressItem[]): AddressItem {
  return addresses.find(a => a.isPreferredShipping);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDefaultBilling(addresses: AddressItem[]): AddressItem {
  return addresses.find(a => a.isPreferredBilling);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTotal(addresses: AddressItem[]): number {
  return addresses.length;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPostCode(address: AddressItem): string {
  return address.postalCode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getStreetName(address: AddressItem): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getStreetNumber(address: AddressItem): string | number {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCity(address: AddressItem): string {
  return address.city;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFirstName(address: AddressItem): string {
  return address.firstName;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getLastName(address: AddressItem): string {
  return address.lastName;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCountry(address: AddressItem): string {
  return address.countryCode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPhone(address: AddressItem): string {
  return address.phoneNumber;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getEmail(address: AddressItem): string {
  return address.email;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getProvince(address: AddressItem): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCompanyName(address: AddressItem): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTaxNumber(address: AddressItem): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getId(address: AddressItem): string {
  return address.id;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getApartmentNumber(address: AddressItem): string | number {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isDefault(address: AddressItem): boolean {
  return address.isPreferredBilling && address.isPreferredShipping;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isDefaultShipping(address: AddressItem): boolean {
  return address.isPreferredShipping;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isDefaultBilling(address: AddressItem): boolean {
  return address.isPreferredBilling;
}

export const userAddressGetters: UserAddressGetters<AddressItem> = {
  getDefault,
  getDefaultShipping,
  getDefaultBilling,
  getTotal,
  getPostCode,
  getStreetName,
  getStreetNumber,
  getCity,
  getFirstName,
  getLastName,
  getCountry,
  getPhone,
  getEmail,
  getProvince,
  getCompanyName,
  getTaxNumber,
  getId,
  getApartmentNumber,
  isDefault,
  isDefaultShipping,
  isDefaultBilling
};
