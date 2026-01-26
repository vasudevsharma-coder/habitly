<script setup lang="ts">
// Clerk composables are auto-imported by @clerk/nuxt
const { isSignedIn, user: clerkUser } = useUser();
const route = useRoute();
const login = route.params.user as string;
// Check if this is the current user's profile (match by username or id)
const isMyProfile = computed(() => isSignedIn.value && (clerkUser.value?.username === login || clerkUser.value?.id === login));

const fetchUser = async () => {
  try {
    const response = await $fetch(`/api/users/${login}`);
    return response as unknown as User;
  } catch (error: any) {
    // Return null if user not found, which will be handled in template
    if (error.status === 404) {
      return null;
    }
    throw error; // Re-throw other errors
  }
};

const fetchHabits = async () => {
  try {
    const response = await $fetch(`/api/users/${login}/habits`);
    return response as unknown as Habit[];
  } catch (error) {
    // Return empty array if habits not found
    return [];
  }
};

const fetchMyHabits = async () => {
  try {
    const response = await $fetch('/api/habits');
    return response as unknown as Habit[];
  } catch (error) {
    // Return empty array if habits not found
    return [];
  }
};

const { data: user, error: userError } = useAsyncData(`user-${login}`, fetchUser, {
  default: () => null
});
const { data: habits } = useAsyncData(`habits-${login}`, fetchHabits, {
  default: () => []
});
const { data: myHabits } = useAsyncData(
  `my_habits-${login}`,
  fetchMyHabits,
  {
    immediate: isMyProfile.value,
    default: () => [],
    watch: [isMyProfile]
  }
);

const emptyHabits = computed(() => habits.value?.length === 0);
const emptyMyHabits = computed(() => myHabits.value?.length === 0);
const pageTitle = computed(() => {
  if (user.value?.login && user.value?.name) {
    return `${user.value.name} (@${user.value.login}) · Habits and Todos`;
  } else {
    return 'Page Not Found · Habit';
  }
});

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  ogSiteName: pageTitle,
});
</script>

<template>
  <Card v-if="user">
    <div class="relative z-10">
      <ProfileHeader :user="user" />
      <template v-if="!user.userView && !isMyProfile"><PrivateAccount :user="user" /></template>
      <template v-else>
        <div class="scrollable-card max-h-[calc(100vh-18.875rem)] overflow-y-auto">
          <HabitCard v-for="habit in isMyProfile ? myHabits : habits" :key="habit.id" :habit="habit" :isMyProfile="isMyProfile ?? false" />
        </div>
        <EmptyHabits v-if="isMyProfile ? emptyMyHabits : emptyHabits" :isMyProfile="isMyProfile ?? false" />
      </template>
    </div>
  </Card>
  <Card v-else-if="userError || (user === null && !userError)" class="items-start justify-center gap-7 p-6">
    <div class="relative z-10 flex w-5/6 flex-col gap-5">
      <div class="text-3xl font-semibold">404</div>
      <p class="font-semibold">Sorry, this page isn't available.</p>
      <p class="text-sm text-white/50">The link you followed may be broken, or the page may have been removed.</p>
    </div>
    <NuxtLink to="/" class="button bg-white/20 px-2.5 py-2 hover:bg-white/30">
      <UIcon name="i-heroicons-arrow-left-16-solid" class="h-5 w-5" />
      Go back to Habit
    </NuxtLink>
  </Card>
  <Card v-else class="items-start justify-center gap-7 p-6">
    <!-- Loading state -->
    <div class="relative z-10 flex w-5/6 flex-col gap-5">
      <div class="text-3xl font-semibold">Loading...</div>
    </div>
  </Card>
</template>
