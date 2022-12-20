import supertest from "supertest";
import createServer from "../utils/server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const app = createServer();

describe("product", () => {

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("get product", () => {
    describe("given the product does not exist", () => {
      it("should return a 404", async () => {
        const productId = "product123";
        await supertest(app).get(`/api/products/${productId}`);
      });
    });
  });
});
