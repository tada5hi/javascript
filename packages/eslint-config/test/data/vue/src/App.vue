<script setup lang="ts">
import { greet } from './utils.ts';

const message = greet('World');
</script>

<template>
    <div>{{ message }}</div>
</template>
