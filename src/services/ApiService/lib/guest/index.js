import { GUEST_TYPE } from "../../types";

export default (appOperation) => ({
  login: (data) => appOperation.post("auth/login", data, GUEST_TYPE),
  forgot_password: (data) => appOperation.post("auth/forgot", data, GUEST_TYPE),
});
