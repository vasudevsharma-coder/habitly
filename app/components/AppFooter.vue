<script setup lang="ts">
import { format } from 'date-fns';
const config = useRuntimeConfig();
const currentYear = format(new Date(), 'yyyy');
</script>

<template>
  <div class="mt-2 flex items-center justify-center gap-1 text-xs text-slate-400">
    <a class="font-semibold transition hover:text-primary-500" href="#" target="_blank">Habitly v{{ config.public.version }}</a>
    - by
    <a class="font-semibold transition hover:text-primary-500" href="https://github.com/vasudevsharma-coder" target="_blank">Vasu Sharma</a>
    {{ currentYear }}
  </div>
</template>
