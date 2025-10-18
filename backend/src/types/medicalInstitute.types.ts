export type RegisterNewMedicalInstituteBody = {
  name: string;
  address: string;
  contactNumber: string;
  contactEmail: string;
  webhookUrl: string;
  admin: {
    phoneNumber: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }
}
