<script setup lang="ts">
import { marked } from 'marked';
import { isSameDay, parseISO, format } from 'date-fns';
import DOMPurify from 'isomorphic-dompurify';

const props = defineProps<{ habit: Habit; isMyProfile: boolean }>();

const renderMarkdown = (text: string) => DOMPurify.sanitize(marked.parse(text) as string);

const queryCache = useQueryCache();

// -- Local state for optimistic updates --
const localCompleteDays = ref([...props.habit.completeDays]);

watch(() => props.habit.completeDays, (newDays) => {
  localCompleteDays.value = [...newDays];
});

const getCompletionRate = () => Math.round((localCompleteDays.value.length / 40) * 100);

const { calculateCurrentStreak, calculateBestStreak } = useStreaks();
const currentStreak = computed(() => calculateCurrentStreak(localCompleteDays.value));
const bestStreak = computed(() => calculateBestStreak(localCompleteDays.value));

const isTodayCompleted = () => localCompleteDays.value.some(day => isSameDay(parseISO(day), new Date()));

const displayedHabit = computed(() => ({
  ...props.habit,
  completeDays: localCompleteDays.value
}));

// -- UI State --
const openHabitModal = ref(false);
const showCelebration = ref(false);

// -- Delete Habit Logic --
const confirmDeleteHabit = ref(false);
const confirmationText = ref('');

const openDeleteConfirmation = (habit: Habit) => {
  confirmDeleteHabit.value = true;
};

const closeDeleteConfirmation = () => {
  confirmationText.value = '';
  confirmDeleteHabit.value = false;
};

const { mutate: deleteHabit } = useMutation({
  mutation: async (habit: Habit) => {
    // 1. Optimistic Update
    const route = useRoute();
    const login = route.params.user as string;
    const keys = [`my_habits-${login}`, `habits-${login}`];
    
    keys.forEach(key => {
      const { data } = useNuxtData<Habit[]>(key);
      if (data.value) {
        data.value = data.value.filter(h => h.id !== habit.id);
      }
    });

    // 2. Send API request
    try {
      await $fetch(`/api/habits/${habit.id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete habit', error);
      await refreshNuxtData(keys);
    }
  },
});

// -- Edit Habit Logic --
const editingHabit = ref<number | null>(null);
const edit = ref<{ title: string; description: string; habitView: boolean }>({ title: '', description: '', habitView: false });

const editHabit = (habit: Habit) => {
  editingHabit.value = habit.id;
  edit.value = { title: habit.title, description: habit.description || '', habitView: habit.habitView };
};

const { mutate: saveHabit } = useMutation({
  mutation: () =>
    $fetch(`/api/habits/${editingHabit.value}`, {
      method: 'PATCH',
      body: {
        title: edit.value.title,
        description: edit.value.description,
        habitView: edit.value.habitView,
      },
    }),

  async onSuccess() {
    const route = useRoute();
    const login = route.params.user as string;
    await refreshNuxtData([`my_habits-${login}`, `habits-${login}`]);
    editingHabit.value = null;
  },
});

const cancelEdit = () => {
  editingHabit.value = null;
};

// -- Completion Logic (Optimistic) --
const { mutate: toggleTodayCompletion } = useMutation({
  mutation: async (habit: Habit) => {
    // 1. Calculate new state
    const isCompleted = isTodayCompleted();
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    
    // 2. Optimistic Update (Local only)
    const originalDays = [...localCompleteDays.value];
    const updatedDays = isCompleted
      ? localCompleteDays.value.filter(day => !isSameDay(parseISO(day), new Date()))
      : [...localCompleteDays.value, todayStr];
      
    localCompleteDays.value = updatedDays;

    // 3. Trigger confetti locally if completed
    if (!isCompleted) {
       startConfettiAnimation();
       showCelebration.value = true;
    }

    // 4. Send API request
    try {
      await $fetch(`/api/habits/${habit.id}`, {
        method: 'PATCH',
        body: { completeDays: updatedDays },
      });
      // Refresh strictly in background to sync
      const route = useRoute();
      const login = route.params.user as string;
      refreshNuxtData([`my_habits-${login}`, `habits-${login}`]);
    } catch (error) {
      console.error('Failed to toggle completion', error);
      // Revert local change on error
      localCompleteDays.value = originalDays;
    }
  },
});
</script>

<template>
  <ContentBox class="mx-4 mb-4 flex cursor-pointer gap-3 bg-neutral-400/5 p-3 transition hover:bg-white/5 active:scale-[.975]" @click="openHabitModal = true">
    <div class="flex flex-1 flex-col justify-center gap-1">
      <div class="text-md line-clamp-1 font-medium text-white">{{ habit.title }}</div>
      <div class="line-clamp-3 text-xs text-white/70" v-html="renderMarkdown(habit.description || '')"></div>
    </div>
    <HabitHeatmap :habit="habit" :habitDays="49" />
  </ContentBox>
  <UModal
    v-model="openHabitModal"
    :ui="{ container: 'items-center', background: '', shadow: '', overlay: { base: 'backdrop-blur-2xl', background: 'bg-white/5 dark:bg-black/60' } }">
    <div class="flex flex-col gap-4">
      <ContentBox class="flex flex-col gap-2.5 bg-white/10 p-2.5 dark:bg-neutral-400/5">
        <div class="flex w-full items-center justify-between gap-2.5 px-0.5 text-white/25 dark:text-white/15">
          <div class="text-xs">
            Completion Rate:
            <strong>{{ getCompletionRate() }}%</strong>
          </div>
          <UProgress
            :value="getCompletionRate()"
            size="xs"
            :ui="{
              wrapper: 'flex-1',
              progress: {
                color: 'text-white/25 dark:text-white/15',
                track:
                  '[&::-webkit-progress-bar]:bg-white/10 [&::-webkit-progress-bar]:dark:bg-white/5 [@supports(selector(&::-moz-progress-bar))]:bg-white/10 [@supports(selector(&::-moz-progress-bar))]:dark:bg-white/5',
              },
            }" />
          <div class="flex items-center gap-4 text-xs">
            <div title="Current Streak">
              🔥 <strong>{{ currentStreak }}</strong>
            </div>
            <div title="Best Streak">
              🏆 <strong>{{ bestStreak }}</strong>
            </div>
            <div>
              Today:
              <strong>
                {{ isTodayCompleted() ? 'Completed' : 'Pending' }}
              </strong>
            </div>
          </div>
        </div>
        <HabitHeatmap :habit="displayedHabit" :habitDays="343" />
      </ContentBox>
      <div class="flex flex-col gap-4 px-3 text-white">
        <div class="flex items-center justify-between gap-3">
          <UInput v-if="editingHabit === habit.id" :ui="{ wrapper: 'flex-1', rounded: 'rounded-full', size: { sm: 'text-sm font-semibold' } }" v-model="edit.title" />
          <div v-else class="line-clamp-1 text-xl font-semibold">{{ habit.title }}</div>
          <div v-if="isMyProfile" class="flex items-center gap-3">
            <button
              @click="toggleTodayCompletion(habit)"
              class="button px-2.5 py-1.5 font-semibold outline-none"
              :class="isTodayCompleted() ? 'bg-white/10 hover:bg-white/25' : `bg-${habit.color}-500 hover:bg-${habit.color}-400 dark:bg-${habit.color}-400 dark:text-${habit.color}-950 dark:hover:bg-${habit.color}-300`">
              <UIcon v-if="!isTodayCompleted()" name="i-heroicons-check-16-solid" class="h-5 w-5" />
              {{ isTodayCompleted() ? 'Undo' : 'Complete' }}
            </button>

            <UPopover :popper="{ placement: 'bottom-end' }" :ui="{ background: '', shadow: '', ring: '' }">
              <button class="button bg-white/10 p-1.5 hover:bg-white/25">
                <UIcon name="i-heroicons-ellipsis-horizontal-20-solid" class="h-5 w-5" />
              </button>
              <template #panel="{ close }">
                <div class="dropdown">
                  <div
                    @click="
                      () => {
                        close();
                        editHabit(habit);
                      }
                    "
                    class="m-1 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-black/30">
                    <UIcon name="i-heroicons-pencil-square-20-solid" class="h-5 w-5" />
                    <span>Edit</span>
                  </div>
                  <div class="border-b border-white/5"></div>
                  <div
                    @click="
                      () => {
                        close();
                        openDeleteConfirmation(habit);
                      }
                    "
                    class="m-1 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-black/30 dark:text-red-500 dark:hover:bg-red-900/30">
                    <UIcon name="i-heroicons-trash-20-solid" class="h-5 w-5" />
                    <span>Delete</span>
                  </div>
                </div>
              </template>
            </UPopover>
          </div>
        </div>
        <ContentBox class="flex flex-col gap-2 bg-white/10 p-4 backdrop-blur-2xl dark:bg-neutral-200/5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-xs font-medium text-white/50">
              <p>{{ format(habit.createdAt, 'MMM d, yyyy') }}</p>
              <UIcon v-if="isMyProfile" :name="habit.habitView ? 'i-heroicons-eye-20-solid' : 'i-heroicons-eye-slash-20-solid'" class="-mt-0.5 h-4 w-4" />
            </div>
          </div>
          <div class="max-h-[calc(100vh-23rem)] overflow-y-auto">
            <UTextarea v-if="editingHabit === habit.id" v-model="edit.description" autoresize />
            <div v-else class="prose prose-sm prose-invert" v-html="renderMarkdown(habit.description || '')"></div>
          </div>
          <div v-if="editingHabit === habit.id" class="mt-2 flex items-center justify-between">
            <div></div>
            <div class="flex items-center gap-4 text-sm">
              <div>
                Visibility:
                <strong>{{ edit.habitView ? 'Public' : 'Private' }}</strong>
              </div>
              <UToggle v-model="edit.habitView" />
            </div>
          </div>
        </ContentBox>
        <div v-if="editingHabit === habit.id" class="flex items-center justify-between">
          <div></div>
          <div class="flex gap-2">
            <UButton :ui="{ rounded: 'rounded-full' }" @click="cancelEdit" color="white" variant="link">Cancel</UButton>
            <UButton :ui="{ rounded: 'rounded-full' }" @click="saveHabit" trailing>Save changes</UButton>
          </div>
        </div>
      </div>
    </div>
    <UModal v-model="confirmDeleteHabit" :ui="{ width: 'w-80', rounded: 'rounded-2xl' }">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Are you sure?</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeDeleteConfirmation" />
          </div>
        </template>
        <div class="flex flex-col gap-4">
          <p v-if="habit.completeDays.length > 1" class="text-sm text-red-500">
            Warning: This habit has been completed for {{ habit.completeDays.length }} days. Deleting it will remove all progress.
          </p>
          <p class="text-sm text-neutral-400">
            To confirm deletion, please type
            <strong>DELETE</strong>
            in the box below.
          </p>
          <UInput color="red" v-model="confirmationText" placeholder="Type DELETE here..." />
          <UButton block color="red" :disabled="confirmationText.toLowerCase() !== 'delete'" @click="deleteHabit(habit)">I understand, delete this habit</UButton>
        </div>
      </UCard>
    </UModal>
  </UModal>
  <CelebrationModal v-model="showCelebration" />
</template>
