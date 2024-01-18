import request from "supertest";
import app from "../../index.js";
import { Genre } from "../../models/genre.js";
import mongoose from "mongoose";

describe("/api/genres", () => {
	afterEach(async () => {
		await Genre.deleteMany({});
	});

	describe("GET /", () => {
		test("should return all genres", async () => {
			await Genre.insertMany([{ name: "genre1" }, { name: "genre2" }]);

			const res = await request(app).get("/api/genres");

			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
			expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
			expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
		});
	});

	describe("GET /:id", () => {
		test("should return a genre if valid id is passed", async () => {
			const genre = await Genre.create({ name: "genre1" });

			const res = await request(app).get("/api/genres/" + genre._id);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("name", genre.name);
		});

		test("should return 404 if invalid id is passed", async () => {
			const res = await request(app).get("/api/genres/1");

			expect(res.status).toBe(404);
		});

		test("should return 404 if no genre with the given id exists", async () => {
			const id = new mongoose.Types.ObjectId();

			const res = await request(app).get("/api/genres/" + id);

			expect(res.status).toBe(404);
		});
	});

	// TODO: Write Tests for POST, PUT, DELETE requests after implementing authentication & authorization

	describe("POST /", () => {
		test("should create a new genre", async () => {});
	});

	describe("PUT /:id", () => {
		test("should update a genre if valid id is passed", async () => {});

		test("should return 404 if invalid id is passed", async () => {
			const res = await request(app)
				.put("/api/genres/1")
				.send({ name: "newName" });;

			expect(res.status).toBe(404);
		});

		test("should return 404 if no genre with the given id exists", async () => {
			const id = new mongoose.Types.ObjectId();

			const res = await request(app)
				.put("/api/genres/" + id)
				.send({ name: "newName" });;

			expect(res.status).toBe(404);
		});
	});

	describe("DELETE /:id", () => {
		test("should delete a genre if valid id is passed", async () => {});

		test("should return 404 if invalid id is passed", async () => {
			const res = await request(app).delete("/api/genres/1");

			expect(res.status).toBe(404);
		});

		test("should return 404 if no genre with the given id exists", async () => {
			const id = new mongoose.Types.ObjectId();

			const res = await request(app).delete("/api/genres/" + id);

			expect(res.status).toBe(404);
		});
	});
});
