import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  const token = header?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, ACCESS_SECRET, (err: jwt.VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
    if (err || !decoded) return res.sendStatus(403);

    req.user = decoded;
    next();
  });
};
