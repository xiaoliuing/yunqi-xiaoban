<script setup lang="ts">
import type { FruitShape } from '@/content/types'

defineProps<{ shape: FruitShape; color: string; label: string }>()
</script>

<template>
  <div class="fruit" :aria-label="label" role="img">
    <div class="halo" />
    <svg width="128" height="148" viewBox="0 0 128 148">
      <g v-if="shape === 'seed'">
        <ellipse cx="64" cy="86" rx="10" ry="13" :fill="color" />
        <path d="M64 73c0-10 6-16 14-18" fill="none" stroke="#6F8F74" stroke-width="3" stroke-linecap="round" />
      </g>
      <g v-else-if="shape === 'berry'">
        <circle cx="54" cy="92" r="18" :fill="color" />
        <circle cx="78" cy="96" r="16" :fill="color" opacity=".85" />
        <path d="M54 74c4-14 14-20 24-22M78 80c0-12 0-20 0-28" fill="none" stroke="#6F8F74" stroke-width="3" stroke-linecap="round" />
      </g>
      <g v-else-if="shape === 'round'">
        <circle cx="64" cy="88" r="36" :fill="color" />
        <ellipse cx="50" cy="74" rx="8" ry="12" fill="#fff" opacity=".25" />
        <path d="M64 52c0-8 4-14 10-16" fill="none" stroke="#7A5D12" stroke-width="3" stroke-linecap="round" />
        <path d="M68 50c10-10 22-8 26-4-8 8-18 8-26 4z" fill="#7C9E80" />
      </g>
      <g v-else-if="shape === 'long'">
        <path d="M64 138C40 128 26 96 34 62c10 20 22 46 30 76z" fill="#8FAE90" />
        <path d="M64 138c24-10 38-42 30-76-10 20-22 46-30 76z" fill="#7C9E80" />
        <rect x="46" y="18" width="36" height="104" rx="18" :fill="color" />
        <g fill="#000" opacity=".08">
          <circle v-for="i in 6" :key="'l' + i" cx="56" :cy="20 + i * 14" r="4.2" />
          <circle v-for="i in 6" :key="'r' + i" cx="72" :cy="20 + i * 14" r="4.2" />
        </g>
        <path d="M64 140c-10-12-16-34-14-56 8 18 12 36 14 56zM64 140c10-12 16-34 14-56-8 18-12 36-14 56z" fill="#5F8466" />
      </g>
      <g v-else>
        <ellipse cx="64" cy="92" rx="40" ry="34" :fill="color" />
        <path d="M36 92c8-20 20-28 28-28s20 8 28 28" fill="none" stroke="#fff" stroke-width="3" opacity=".4" />
        <path d="M64 64v56" stroke="#fff" stroke-width="3" opacity=".4" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.fruit { width: 128px; height: 148px; flex: none; position: relative; margin-bottom: -6px; }
.halo { position: absolute; inset: 14px 0 0 0; border-radius: 50%; background: var(--butter); opacity: .55; }
svg { position: relative; animation: sway 6s ease-in-out infinite; transform-origin: 50% 90%; }
@keyframes sway { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
@media (prefers-reduced-motion: reduce) { svg { animation: none; } }
</style>
