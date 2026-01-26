<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
    <div class="text-center p-8">
      <h1 class="text-6xl font-bold mb-4">{{ error?.statusCode || 404 }}</h1>
      <h2 class="text-2xl font-semibold mb-4">{{ error?.statusMessage || 'Page Not Found' }}</h2>
      <p class="mb-8 text-gray-300">{{ error?.message || "Sorry, the page you're looking for doesn't exist." }}</p>
      <button 
        @click="handleError"
        class="button bg-violet-600 px-6 py-3 rounded-full hover:bg-violet-700 transition-all duration-200 shadow-lg shadow-violet-500/30"
      >
        Go Back Home
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode?: number;
    statusMessage?: string;
    message?: string;
  }
}>();

const handleError = () => clearError({ redirect: '/' });
</script>

<style scoped>
.button {
  box-shadow:
    inset 0.5px 0.5px 1px 0px rgba(255, 255, 255, 0.1),
    inset -0.5px -0.5px 1px 0px rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.2) 0px 3px 10px -5px;
  @apply flex items-center justify-center gap-2 text-sm backdrop-blur-sm transition-all;
  &:active {
    @apply scale-95;
  }
}
</style>