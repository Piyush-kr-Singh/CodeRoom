process.env.MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/codeshare-test";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret-for-jest-only";
process.env.CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";
