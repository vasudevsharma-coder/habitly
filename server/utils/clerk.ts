import { clerkClient } from '@clerk/nuxt/server';
import { eq } from 'drizzle-orm';
import type { H3Event } from 'h3';

export interface ClerkUser {
    id: string;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string;
    emailAddresses: { emailAddress: string }[];
}

// Get the Clerk user from the request
export async function getClerkUser(event: H3Event): Promise<ClerkUser | null> {
    const auth = event.context.auth();

    if (!auth.userId) {
        return null;
    }

    try {
        const clerk = clerkClient(event);
        const user = await clerk.users.getUser(auth.userId);

        return {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            emailAddresses: user.emailAddresses.map(e => ({ emailAddress: e.emailAddress })),
        };
    } catch (error) {
        console.error('Error fetching Clerk user:', error);
        return null;
    }
}

// Require authentication - throws error if not authenticated
export async function requireClerkAuth(event: H3Event) {
    const auth = event.context.auth();

    if (!auth.userId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        });
    }

    const clerkUser = await getClerkUser(event);

    if (!clerkUser) {
        throw createError({
            statusCode: 401,
            statusMessage: 'User not found',
        });
    }

    // Get or create the user in our database
    const db = useDB();
    let user = await db.select().from(tables.users).where(eq(tables.users.login, clerkUser.username || clerkUser.id)).limit(1).get();

    if (!user) {
        // Create the user in our database
        const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || clerkUser.username || 'User';

        user = await db.insert(tables.users).values({
            login: clerkUser.username || clerkUser.id,
            name: fullName,
            avatarUrl: clerkUser.imageUrl,
            createdAt: new Date(),
        }).returning().get();
    }

    return { user, clerkUser, auth };
}

// Get the database user ID from Clerk auth (for API routes that need it)
export async function getDbUser(event: H3Event) {
    const auth = event.context.auth();

    if (!auth.userId) {
        return null;
    }

    const clerkUser = await getClerkUser(event);
    if (!clerkUser) {
        return null;
    }

    const db = useDB();
    const user = await db.select().from(tables.users).where(eq(tables.users.login, clerkUser.username || clerkUser.id)).limit(1).get();

    return user;
}
