<template>
  <div class="today-notes">
    <div class="header">
      <div class="title">
        <span class="title-icon">📝</span>
        <span class="title-text">Today's Notes</span>
      </div>
      <div class="count" v-if="!loading">
        <span class="count-value">{{ notesCount }}</span>
        <span class="count-label">{{ notesCount === 1 ? 'note' : 'notes' }}</span>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <span class="loading-dot"></span>
      <span class="loading-dot"></span>
      <span class="loading-dot"></span>
    </div>

    <div v-else-if="error" class="error">
      Failed to load notes
    </div>

    <div v-else-if="!hasNotes" class="empty">
      <span class="empty-icon">✨</span>
      <span class="empty-text">No notes yet today</span>
    </div>

    <div v-else class="notes-list">
      <div
        v-for="(note, index) in todayNotes"
        :key="note.id"
        class="note-card"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <div class="note-title" v-if="note.title">{{ note.title }}</div>
        <div class="note-content">{{ truncateContent(note.content) }}</div>
        <div class="note-time">{{ formatTime(note.created_at || note.created) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useNotesStore } from '@/stores/notes'

const notesStore = useNotesStore()

onMounted(() => {
  notesStore.fetchTodayNotes()
})

const loading = computed(() => notesStore.loading)
const error = computed(() => notesStore.error)
const todayNotes = computed(() => notesStore.todayNotes)
const notesCount = computed(() => notesStore.notesCount)
const hasNotes = computed(() => notesStore.hasNotes)

function truncateContent(content) {
  if (!content) return ''
  const maxLength = 150
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength).trim() + '...'
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}
</script>

<style scoped>
.today-notes {
  padding: 20px;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.9));
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  min-width: 280px;
  max-width: 400px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 14px;
}

.title-text {
  font-size: 14px;
  font-weight: 600;
  color: #a78bfa;
  letter-spacing: 0.5px;
}

.count {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.count-value {
  font-size: 16px;
  font-weight: 700;
  color: #a78bfa;
  font-variant-numeric: tabular-nums;
}

.count-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}

/* Loading state */
.loading {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 24px;
}

.loading-dot {
  width: 8px;
  height: 8px;
  background: #a78bfa;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.loading-dot:nth-child(1) { animation-delay: -0.32s; }
.loading-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

/* Error state */
.error {
  text-align: center;
  padding: 24px;
  font-size: 13px;
  color: #fb7185;
}

/* Empty state */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  color: rgba(255, 255, 255, 0.4);
}

.empty-icon {
  font-size: 24px;
  opacity: 0.6;
}

.empty-text {
  font-size: 13px;
}

/* Notes list */
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.notes-list::-webkit-scrollbar {
  width: 4px;
}

.notes-list::-webkit-scrollbar-track {
  background: transparent;
}

.notes-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.note-card {
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border-left: 3px solid rgba(167, 139, 250, 0.4);
  animation: slideIn 0.3s ease forwards;
  opacity: 0;
  transition: all 0.2s ease;
}

.note-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-left-color: #a78bfa;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.note-title {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 6px;
}

.note-content {
  font-size: 12px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
}

.note-time {
  font-size: 10px;
  font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
  color: rgba(255, 255, 255, 0.3);
}
</style>
