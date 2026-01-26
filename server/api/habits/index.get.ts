import { eq } from 'drizzle-orm';

export default eventHandler(async event => {
  const { user } = await requireClerkAuth(event);

  const habits = await useDB().select().from(tables.habits).where(eq(tables.habits.userId, user.id)).all();

  return habits as Habit[];
});

