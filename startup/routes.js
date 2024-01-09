import express from "express";


import testRoutes from "../routes/testRoutes.js";
import error from "../middleware/error.js";

const routes = (app) => {
  app.use(express.json());
  app.use("/api/test", testRoutes);
  app.use(error);
};

export default routes;