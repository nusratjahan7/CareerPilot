import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { createAccessControl } from "better-auth/plugins/access";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

// Define statements for the access control
const statements = {
  user: ["read", "write"],
  admin: ["read", "write", "delete", "manage-users"]
};

const ac = createAccessControl(statements);

const roles = {
  user: ac.newRole({
    user: ["read", "write"],
    admin: []
  }),
  admin: ac.newRole({
    user: ["read", "write", "delete", "manage-users"],
    admin: ["read", "write", "delete", "manage-users"]
  })
};

export const auth = betterAuth({
  database: mongodbAdapter(db, { databaseName: process.env.AUTH_DB_NAME }),
  plugins: [
    nextCookies(),
    admin({
      ac,
      roles,
      defaultRole: "user",
      adminUserIds: [],
      adminRoles: ["admin"]
    })
  ],
  trustedOrigins: [process.env.BETTER_AUTH_URL],
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});
