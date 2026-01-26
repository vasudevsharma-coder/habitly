<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'icon', href: '/icon.svg' },
    { rel: 'apple-touch-icon', href: '/icon.svg' },
    { rel: 'msapplication-TileImage', href: '/icon.svg' },
  ],
});

useSeoMeta({
  title: 'Habitly - Build Better Habits',
  description: 'A premium, minimalistic habit tracker application to track and manage your daily habits with ease.',
  ogTitle: 'Habitly - Build Better Habits',
  ogDescription: 'A premium, minimalistic habit tracker application to track and manage your daily habits with ease.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  twitterCard: 'summary_large_image',
  ogImage: '/social-card.png',
  twitterImage: '/social-card.png',
  ogType: 'website',
  ogUrl: 'https://habit.vasudevsharma-coder.dev',
  ogSiteName: 'Habitly',
  robots: 'index, follow',
  keywords: 'habit, tracker, daily, habits, management, tool, minimalistic, premium, productivity',
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
