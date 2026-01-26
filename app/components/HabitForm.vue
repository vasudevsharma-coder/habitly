<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
  habitView: z.boolean(),
  dailyGoal: z.number().min(1, 'At least 1 time per day').max(100),
  color: z.string().default('violet'),
});

type Schema = z.output<typeof schema>;

const formState = reactive<Schema>({
  title: '',
  description: '',
  habitView: false,
  dailyGoal: 1,
  color: 'violet',
});

const colors = ['violet', 'red', 'green', 'blue', 'orange', 'pink'];

const queryCache = useQueryCache();
const emit = defineEmits<{
  (e: 'habitAdded'): void;
}>();

const { mutate: addHabit, error: mutationError } = useMutation({
  mutation: (data: Schema) => {
    console.log('Submitting habit:', data);
    return $fetch('/api/habits', {
      method: 'POST',
      body: data,
    }) as Promise<Habit>;
  },

  async onSuccess(data) {
    console.log('Habit added successfully:', data);
    // Refresh only the relevant keys
    const route = useRoute();
    const login = route.params.user as string;
    await refreshNuxtData([`my_habits-${login}`, `habits-${login}`]);
    emit('habitAdded');
  },

  onError(error) {
    console.error('Error adding habit:', error);
  },

  onSettled() {
    formState.title = '';
    formState.description = '';
    formState.dailyGoal = 1;
    formState.color = 'violet';
  },
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  addHabit(event.data);
}

const habitVisibilityMessage = computed(() => {
  return formState.habitView
    ? 'This habit is <strong>public</strong> and visible to everyone if your account is public.'
    : 'This habit is <strong>private</strong> and only visible to you.';
});
</script>

<template>
  <div class="p-8">
    <UForm :schema="schema" :state="formState" class="flex flex-col gap-4" @submit="onSubmit">
      <UFormGroup name="title">
        <div class="input-container">
          <input v-model="formState.title" placeholder="Title..." />
        </div>
      </UFormGroup>
      <UFormGroup name="description">
        <div class="input-container">
          <textarea class="scroll-bar" rows="5" v-model="formState.description" placeholder="Description (Markdown supported)..."></textarea>
        </div>
      </UFormGroup>

      <div class="flex gap-4">
        <UFormGroup name="dailyGoal" label="Daily Goal" class="flex-1">
          <div class="input-container">
            <input type="number" min="1" max="100" v-model.number="formState.dailyGoal" placeholder="1" />
          </div>
        </UFormGroup>
        
        <UFormGroup name="color" label="Color" class="flex-1">
          <div class="flex items-center gap-2 pt-2">
            <button
              v-for="color in colors"
              :key="color"
              type="button"
              @click="formState.color = color"
              class="h-6 w-6 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50"
              :class="[
                `bg-${color}-500`,
                formState.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-black/50 scale-110' : 'opacity-70 hover:opacity-100'
              ]"
            ></button>
          </div>
        </UFormGroup>
      </div>
      <UFormGroup name="habitView">
        <div class="toggle flex items-center justify-between gap-20">
          <div class="flex flex-col">
            <div class="text-sm font-semibold text-white">Public Habit</div>
            <div class="text-xs text-white/60" v-html="habitVisibilityMessage"></div>
          </div>
          <UToggle v-model="formState.habitView" />
        </div>
      </UFormGroup>
      <button type="submit" class="button bg-violet-500 px-2.5 py-3 font-semibold text-white outline-none hover:bg-violet-400">Add Habit</button>
    </UForm>
  </div>
</template>

<style lang="postcss" scoped>
.input-container {
  @apply relative flex w-full items-center text-white;
}

input,
textarea,
.toggle {
  box-shadow:
    inset 0.5px 0.5px 1px 0px rgba(255, 255, 255, 0.1),
    inset -0.5px -0.5px 1px 0px rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.2) 0px 3px 10px -5px;
  @apply w-full rounded-2xl bg-white/10 p-4 outline-none transition-all placeholder:text-white/35;
  &:focus {
    @apply bg-white/15;
  }
}
</style>
