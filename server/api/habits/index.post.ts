import { useValidatedBody, z } from 'h3-zod';

export default eventHandler(async event => {
  const { title, description, habitView, dailyGoal, color } = await useValidatedBody(event, {
    title: z.string().min(1, 'Title is required').trim(),
    description: z.string().min(1, 'Description is required').trim(),
    habitView: z.boolean(),
    dailyGoal: z.number().min(1).default(1),
    color: z.string().default('violet'),
  });

  const { user } = await requireClerkAuth(event);

  const habit = await useDB()
    .insert(tables.habits)
    .values({
      userId: user.id,
      title,
      description,
      createdAt: new Date(),
      habitView,
      dailyGoal,
      color,
    })
    .returning()
    .get();

  return habit;
});
