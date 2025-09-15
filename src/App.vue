<script setup lang="ts">
import Positions from './Positions.vue'

// Demo props - in a real app this would come from route params or store
const demoAccountId = '1'  // Using account ID that exists in database

function handleRowClick(position: any) {
  console.log('Position clicked:', position)
}
</script>

<template>
  <main class="wrapper">
    <Positions 
      :account-id="demoAccountId" 
      :highlight-p-n-l="true"
      @row-click="handleRowClick"
    />
  </main>
</template>

<style>
.wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style>