import { provide } from "@expressots/core";
import Axios, { AxiosInstance } from "axios";
import {
    tokenType,
    accessToken,
} from "@providers/middlewares/authentication/ensure-authenticated.middleware";
import ENV from "env";

@provide(AxiosProvider)
export class AxiosProvider {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = Axios.create();
        this.configureAxiosInstance();
    }

    configureAxiosInstance() {
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = `${tokenType} ${accessToken}`;
                if (token) {
                    config.headers["Authorization"] = token;
                    config.headers["Client-ID"] = ENV.Application.CLIENT_ID;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            },
        );
    }

    getInstance(): AxiosInstance {
        return this.axiosInstance;
    }
}
