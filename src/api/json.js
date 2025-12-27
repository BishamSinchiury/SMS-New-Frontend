import base from "./base.js";

const jsonApi = base.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export default jsonApi;
