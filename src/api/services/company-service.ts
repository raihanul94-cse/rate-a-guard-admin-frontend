import { ICompany, ISuccessResponse } from "@/types/api";
import apiClientInstance from "../index";

export async function getCompanies({
  licenseNumber,
}: {
  licenseNumber: string;
}): Promise<ISuccessResponse<ICompany[]>> {
  const response = await apiClientInstance.get<ISuccessResponse<ICompany[]>>(
    "/api/admin/companies",
    {
      params: {
        licenseNumber: licenseNumber,
        limit: 1000,
        page: 1,
      },
    }
  );
  return response.data;
}

export async function updateCompanyDefaultUserPassword(
  userUuid: string,
  newPassword: string
): Promise<ISuccessResponse<null>> {
  const response = await apiClientInstance.put<ISuccessResponse<null>>(
    `/api/admin/companies/${userUuid}/password`,
    {
      newPassword: newPassword,
    }
  );
  return response.data;
}

export async function createCompany(
  companyInfo: ICompany
): Promise<ISuccessResponse<null>> {
  const response = await apiClientInstance.post<ISuccessResponse<null>>(
    "/api/admin/companies",
    companyInfo
  );
  return response.data;
}

export async function updateCompany(
  companyUuid: string,
  companyInfo: ICompany
): Promise<ISuccessResponse<null>> {
  const response = await apiClientInstance.put<ISuccessResponse<null>>(
    `/api/admin/companies/${companyUuid}`,
    companyInfo
  );
  return response.data;
}

export async function deleteCompany(
    companyUuid: string
): Promise<ISuccessResponse<null>> {
  const response = await apiClientInstance.delete<ISuccessResponse<null>>(
      `/api/admin/companies/${companyUuid}`
  );
  return response.data;
}

export async function updateAdminPassword(
    currentPassword: string,
    newPassword: string
): Promise<ISuccessResponse<null>> {
  const response = await apiClientInstance.put<ISuccessResponse<null>>(
      `/api/admin/auth/change-password`,
      {
        currentPassword: currentPassword,
        newPassword: newPassword,
      }
  );
  return response.data;
}

export async function updateStatusCompany(
    companyUuid: string,
    status: string,
    rejectionReasons?: string
): Promise<ISuccessResponse<null>> {
  const response = await apiClientInstance.put<ISuccessResponse<null>>(
      `/api/admin/companies/${companyUuid}/status`,
      {
        status: status,
        notify: true,
        rejectionReasons: rejectionReasons,
      }
  );
  return response.data;
}