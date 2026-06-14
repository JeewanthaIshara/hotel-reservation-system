export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "admin" | "customer";
    };
  }

  interface UserPublicMetadata {
    role?: "admin" | "customer";
  }
}