<template>
  <div class="card">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.card {
  @apply relative flex h-full w-full flex-col overflow-hidden rounded-[2.375rem] text-white;
  &::before {
    @apply absolute inset-0 rounded-[2.375rem];
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(0, 0, 0, 0.55) 100%);
    box-shadow: inset 2px 4px 16px 0 rgba(139, 92, 246, 0.08);
    -webkit-backdrop-filter: blur(50px);
    backdrop-filter: blur(50px);
    content: '';
  }
  &::after {
    @apply pointer-events-none absolute inset-0 rounded-[2.375rem];
    border: 1.5px solid rgba(167, 139, 250, 0.15);
    -webkit-mask-image: linear-gradient(180deg, #000, transparent);
    mask-image: linear-gradient(180deg, #000, transparent);
    content: '';
  }
}
</style>
