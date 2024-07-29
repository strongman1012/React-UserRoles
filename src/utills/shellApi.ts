import axios from "axios";
import { REACT_APP_SERVER_URL } from "./config";

export default class ShellApi {

    /** Excute Test Shell Script */
    excuteTestShell = () => {
        const baseURL = `${REACT_APP_SERVER_URL}/api/v0`;
        return axios.post(`${baseURL}/script/test`);
    }
}