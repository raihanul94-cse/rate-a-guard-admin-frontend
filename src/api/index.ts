import AxiosHelper from "./axios-helper";
import { logout } from "../auth/logout";
import { getAccessToken } from "../auth/auth-token";

const apiClient = new AxiosHelper(import.meta.env.VITE_API_URL, logout);
apiClient.setToken(getAccessToken());

const apiClientInstance = apiClient.getInstance();

export { apiClient };

export default apiClientInstance;
