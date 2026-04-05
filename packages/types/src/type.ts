import { Request, RequestHandler, Response, NextFunction } from "express";

// Authenticated request — extends Express's Request with the decoded JWT user.
export interface AuthRequest extends Request {
  user: UserCredentials;
}

// Convenience type for controllers that require an authenticated user.
// Using this in route files removes all the `as any` casts:
//   router.get("/path", handler)  ← no cast needed
export type AuthRequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<unknown> | unknown;

export interface UserCredentials {
  userId: string;
  username: string;
  picture: string;
  token: string;
  email: string;
  isVerified: boolean;
}

// Keep old name for backward compat
export type userCredentials = UserCredentials;

export type GoogleUser = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
};

export type SelectedUser = Pick<
  GoogleUser,
  "access_token" | "name" | "refresh_token" | "picture" | "email"
>;

export type TransactionEventData = {
  transactionId: string;
  senderId: string;
  receiverId: string;

  senderPrimaryAccountId: string;
  receiverPrimaryAccountId: string;

  debit: number;
  credit: number;

  debitType: "ONLINE" | "OFFLINE" | "NONE";
  creditType: "ONLINE" | "OFFLINE" | "NONE";

  balanceAfter: number;

  note: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
};

export type TransactionEventMetadata = {
  idempotencyKey: string;
  causationId: string;
  correlationId: string;
  source: string;
  actorId: string;
};

export type TransactionEvent = {
  type:
    | "TRANSACTION_CREATED"
    | "DEBIT"
    | "CREDIT"
    | "TRANSACTION_FAILED";

  data: TransactionEventData;
  metadata: TransactionEventMetadata;
};
