import base from "./base.js";

const multipartApi = base.create({
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default multipartApi;