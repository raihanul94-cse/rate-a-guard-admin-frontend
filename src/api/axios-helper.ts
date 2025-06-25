import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

type LogoutFunction = () => void;

class AxiosHelper {
  private instance: AxiosInstance;
  private token: string | null = null;
  private readonly logoutFn: LogoutFunction;

  constructor(baseURL: string, logoutFn: LogoutFunction) {
    this.logoutFn = logoutFn;

    this.instance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        if (this.token && config.headers) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logoutFn();
          window.location.href = "/admin/login";
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getInstance(): AxiosInstance {
    return this.instance;
  }
}

export default AxiosHelper;
