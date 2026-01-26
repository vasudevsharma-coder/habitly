<template>
  <div class="rmterp">
    <div class="fzypcq">
      <slot />
    </div>
    <div class="iPbnzK"></div>
  </div>
</template>

<style lang="postcss" scoped>
.rmterp {
  @apply relative flex h-dvh items-center justify-center;
  background: linear-gradient(135deg, #0f0a1f 0%, #1a0f2e 25%, #2d1b4e 50%, #1a0f2e 75%, #0f0a1f 100%);
}

.fzypcq {
  @apply z-10 mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-4 p-5;
}

.iPbnzK {
  @apply absolute h-dvh w-screen transition-opacity duration-300;
  background: 
    radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(167, 139, 250, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 50% 20%, rgba(196, 181, 253, 0.08) 0%, transparent 60%);
  filter: blur(40px);
}
</style>
