export interface ICompany {
  uuid: string;
  address: string;
  city: string;
  companyName: string;
  emailAddress: string;
  licenseExpirationDate: string;
  licenseNumber: string;
  licenseType: string;
  phoneNumber: string;
  registeredAgentFirstName: string;
  registeredAgentLastName: string;
  country: string;
  state: string;
  status: string;
  zip: string;
  defaultUser?: {
    uuid: string;
    emailAddress: string;
    password: string;
    status: string;
  };
  defaultUserEmailAddress?: string;
  defaultUserPassword?: string;
}

export interface ISuccessResponse<
  TData = unknown,
  TMeta = Record<string, unknown>,
  TLinks = Record<string, string>
> {
  status: "success";
  data: TData;
  metadata?: TMeta;
  links?: TLinks;
}

interface IAuthToken {
  token: string;
  expires: number;
}

interface IAuthTokens {
  access: IAuthToken;
  refresh: IAuthToken;
}

export interface ILoginResponseData {
  authTokens: IAuthTokens;
}

export interface ITeamMember {
  uuid?: string;
  emailAddress?: string;
  status?: string;
  code?: string;
  password?: string;
}
