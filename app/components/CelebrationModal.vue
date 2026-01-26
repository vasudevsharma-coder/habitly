<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const quotes = [
  "Consistency is what transforms average into excellence.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Your future is created by what you do today, not tomorrow.",
  "Discipline is doing what needs to be done, even if you don't want to.",
  "Small daily improvements are the key to staggering long-term results.",
  "The secret of your future is hidden in your daily routine.",
  "Don't watch the clock; do what it does. Keep going.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
];

const randomQuote = computed(() => quotes[Math.floor(Math.random() * quotes.length)]);
</script>

<template>
  <UModal v-model="isOpen" :ui="{ container: 'items-center', width: 'w-full max-w-sm', background: 'bg-white dark:bg-zinc-900', overlay: { background: 'bg-gray-200/75 dark:bg-gray-800/75' } }">
    <div class="relative flex flex-col items-center justify-center gap-6 p-8 text-center ring-1 ring-violet-500/20 rounded-lg bg-gradient-to-br from-violet-900/10 to-transparent">
      
      <!-- Crown Icon/Graphic -->
      <div class="relative">
        <div class="absolute -inset-4 bg-violet-500/20 blur-xl rounded-full animate-pulse"></div>
        <UIcon name="i-heroicons-trophy-20-solid" class="w-16 h-16 text-yellow-500 relative z-10 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
      </div>

      <div class="space-y-2">
        <h2 class="text-3xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent uppercase tracking-wider drop-shadow-sm">
            Well Done!
        </h2>
        <p class="text-white/80 italic font-medium leading-relaxed">
          "{{ randomQuote }}"
        </p>
      </div>

      <UButton 
        class="rounded-full px-8 py-2 font-bold shadow-lg shadow-violet-500/20 transition-transform active:scale-95"
        size="lg"
        color="violet"
        variant="solid"
        @click="isOpen = false"
      >
        Keep it up!
      </UButton>
    </div>
  </UModal>
</template>
