export interface IUser {
    id?: number;
    name: string;
    username: string;
    email: string;
    addressStreet: string;
    addressSuite: string;
    addressCity: string;
    addressZipcode: string;
    addressGeoLat: string;
    addressGeoLng: string;
    phone: string;
    website: string;
    companyName: string;
    companyCatchPhrase: string;
    companyBs: string;
    age: number | null;
    salary: number | null;
  }
  