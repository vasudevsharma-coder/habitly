// Clerk user type augmentation
declare module '#clerk' {
  interface ClerkUser {
    id: string;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    fullName: string | null;
    imageUrl: string;
    emailAddresses: { emailAddress: string }[];
  }
}

export { };
