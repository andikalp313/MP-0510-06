import ServerlessHttp from "serverless-http";
import app from "../../src/index";

export const handler = ServerlessHttp(app);
