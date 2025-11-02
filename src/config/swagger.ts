import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { getMetadataArgsStorage } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";

const setupSwagger = (app: Express): void => {
  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(
    storage,
    { routePrefix: "/api/v1" },
    {
      info: {
        title: "Recipe Tracker DB",
        version: "1.0.0",
        description: "API docs",
      },
      paths: {},
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
      ],
    }
  );
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(spec);
  });
};

export default setupSwagger;
