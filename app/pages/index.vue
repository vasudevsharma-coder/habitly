<script setup lang="ts">
// Clerk components and composables are auto-imported by @clerk/nuxt
const { isSignedIn, user: clerkUser } = useUser();

watchEffect(async () => {
  if (isSignedIn.value && clerkUser.value) {
    try {
      // Ensure user is created in DB
      const user = await $fetch<User>('/api/auth/me');
      // Redirect to profile using the confirmed login from DB
      await navigateTo(user.login);
    } catch (e) {
      console.error('Failed to sync user', e);
      const userSlug = clerkUser.value.username || clerkUser.value.id;
      await navigateTo(userSlug);
    }
  }
});
</script>

<template>
  <Card class="items-start justify-center gap-7 p-6">
    <div class="relative z-10 flex w-5/6 flex-col gap-5">
      <div class="logo-gradient h-12 w-12 rounded-2xl border-4 border-violet-600 shadow-lg shadow-violet-500/50"></div>
      <div class="text-lg font-medium text-violet-400">Habitly</div>
      <div class="text-3xl font-medium">
        An efficient tool to
        <span class="text-violet-400 font-semibold">track</span>
        and manage your
        <span class="text-violet-400 font-semibold">daily habits</span>
      </div>
      <div class="flex flex-col gap-2 text-sm text-slate-400">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-violet-400" />
          <span>Beautiful calendar heatmap visualization</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-violet-400" />
          <span>Track multiple habits with ease</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-violet-400" />
          <span>Dark mode optimized interface</span>
        </div>
      </div>
    </div>
    <ClientOnly>
      <SignedOut>
        <SignInButton mode="modal" class="button bg-violet-600 px-2.5 py-2 hover:bg-violet-700 transition-all duration-200 shadow-lg shadow-violet-500/30">
          <span class="flex items-center gap-2">
            <UIcon name="i-heroicons-user-circle" class="h-5 w-5" />
            Sign in to Continue
          </span>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div class="text-sm text-slate-400">Redirecting...</div>
      </SignedIn>
    </ClientOnly>
  </Card>

</template>

<style lang="postcss" scoped>
.logo-gradient {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%);
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
