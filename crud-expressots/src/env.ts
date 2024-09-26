import pkg from "../package.json";

const ENV = {
    Application: {
        APP_NAME: pkg.name,
        APP_VERSION: pkg.version,
        ENVIRONMENT: process.env.ENVIRONMENT as string,
        PORT: Number(process.env.PORT),
        CLIENT_ID: process.env.CLIENT_ID as string,
        CLIENT_SECRET: process.env.CLIENT_SECRET as string,
        GRANT_TYPE: process.env.GRANT_TYPE as string,
    },
};

export default ENV;
