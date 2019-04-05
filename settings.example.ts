import { Settings } from "./src/utils/Interfaces";

const tokens = {
    production: "",
    development: ""
};

const settings: Settings = {
    token: process.env.NODE_ENV === "production" ? tokens.production : tokens.development,
    owner: "",
    prefix: ""
};

export default settings;
