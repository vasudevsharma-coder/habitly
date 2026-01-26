<script setup lang="ts">
// Clerk composables and components are auto-imported by @clerk/nuxt
const { isSignedIn, user: clerkUser } = useUser();
const { session } = useSession();
const createHabitModal = ref(false);
defineProps<{ user: User }>();
const isOwnProfile = computed(() => clerkUser.value?.username === useRoute().params.user);
</script>

<template>
  <div class="relative flex p-5">
    <div class="flex flex-col gap-3">
      <UAvatar size="3xl" :src="user?.avatarUrl" :alt="user?.login" />
      <div class="flex flex-col gap-1">
        <div class="text-xl font-medium">{{ user?.name }}</div>
        <div class="text-xs text-white/40">{{ user?.bio }}</div>
      </div>
    </div>
    <div v-if="isOwnProfile" class="absolute right-5 top-5 flex gap-3">
      <button class="button bg-white/20 py-1.5 pl-2 pr-2.5 hover:bg-white/25" @click="createHabitModal = true">
        <UIcon name="i-heroicons-plus-16-solid" class="h-5 w-5" />
        Create
      </button>
      <Dropdown :user="user" />
    </div>
    <div v-else-if="!isSignedIn" class="absolute right-5 top-5 flex gap-3">
      <ClientOnly>
        <SignedOut>
          <SignInButton mode="modal" class="button bg-white/20 px-2 py-1.5 hover:bg-white/25">
            <span class="flex items-center gap-2">
              <UIcon name="i-heroicons-user-circle" class="h-5 w-5" />
              Sign in
            </span>
          </SignInButton>
        </SignedOut>
      </ClientOnly>
    </div>
    <UModal
      v-model="createHabitModal"
      :ui="{ container: 'items-center', width: 'w-96', background: '', shadow: '', overlay: { base: 'backdrop-blur-2xl', background: 'bg-white/5 dark:bg-black/60' } }">
      <HabitForm @habitAdded="createHabitModal = false" />
    </UModal>
  </div>
</template>
