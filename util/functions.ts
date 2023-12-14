import { NextApiRequest } from "next";
import { decode } from "next-auth/jwt";
import { MySession } from "./types";
if (!process.env.JWT_COOKIE_NAME) {
  throw new Error("JWT_COOKIE_NAME not set");
}
export async function decodeReq(
  req: NextApiRequest
): Promise<MySession["user"] | null> {
  const sessionToken = req.cookies[process.env.JWT_COOKIE_NAME as string]!;
  const token = await decode({
    token: sessionToken,
    secret: process.env.NEXTAUTH_SECRET!,
  });
  return token as MySession["user"] | null;
}

// // @ts-ignore
// export const fetcher = (...args) =>
//   // @ts-ignore
//   fetch(...args)
//     .then((res) => res.json())
//     .catch((err) => console.error(err));
