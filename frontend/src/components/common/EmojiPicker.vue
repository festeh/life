<template>
  <div class="emoji-picker" :style="pickerStyle">
    <div class="emoji-categories">
      <button
        v-for="cat in categories"
        :key="cat.name"
        @click="selectedCategory = cat.name"
        :class="['category-btn', { active: selectedCategory === cat.name }]"
        :style="categoryButtonStyle(cat.name)"
        :title="cat.name"
      >
        {{ cat.icon }}
      </button>
    </div>

    <div class="emoji-grid" :style="gridStyle">
      <button
        v-for="emoji in currentEmojis"
        :key="emoji"
        @click="selectEmoji(emoji)"
        :class="['emoji-btn', { selected: modelValue === emoji }]"
        :style="emojiButtonStyle(emoji)"
      >
        {{ emoji }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const { tokens } = useTheme()
const selectedCategory = ref('activities')

const categories = [
  {
    name: 'activities',
    icon: '⚽',
    emojis: ['💪', '🏃', '🧘', '🚴', '🏊', '⚽', '🏀', '🎾', '🏋️', '🤸', '🧗', '🥊', '🎯', '🎮', '🎨', '🎸', '📚', '✍️', '🎭', '🎪']
  },
  {
    name: 'health',
    icon: '❤️',
    emojis: ['❤️', '🧠', '💊', '🩺', '😴', '🥗', '🥤', '🍎', '🥕', '🥦', '🫁', '🦷', '👁️', '🧬', '💉', '🌡️', '⚕️', '🏥', '💆', '🧖']
  },
  {
    name: 'learning',
    icon: '📚',
    emojis: ['📚', '📖', '✏️', '📝', '🎓', '🔬', '🔭', '🧪', '🖥️', '💻', '📱', '⌨️', '🖊️', '📐', '🧮', '🗂️', '📊', '📈', '🎯', '🧩']
  },
  {
    name: 'home',
    icon: '🏠',
    emojis: ['🏠', '🧹', '🧺', '🛁', '🚿', '🧼', '🧽', '🪣', '🔧', '🔨', '🪛', '🛠️', '🪚', '🔩', '⚙️', '🗑️', '♻️', '🌱', '🪴', '🧴']
  },
  {
    name: 'nature',
    icon: '🌿',
    emojis: ['🌿', '🌱', '🌳', '🌲', '🌴', '🌵', '🌾', '🍀', '☘️', '🌺', '🌻', '🌸', '🌼', '🌷', '🦋', '🐝', '🌍', '🌎', '🌏', '♻️']
  },
  {
    name: 'food',
    icon: '🍎',
    emojis: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍑', '🥭', '🥝', '🥑', '🥕', '🥦', '🥗', '🥪', '🍜', '☕', '🥤', '💧']
  },
  {
    name: 'work',
    icon: '💼',
    emojis: ['💼', '👔', '📊', '📈', '📉', '💰', '💵', '💳', '📞', '📧', '📝', '📋', '📌', '📎', '🖇️', '✂️', '🗓️', '📅', '⏰', '⏱️']
  },
  {
    name: 'social',
    icon: '👥',
    emojis: ['👥', '👨‍👩‍👧‍👦', '💬', '📞', '🤝', '🫂', '👋', '🙏', '🤗', '😊', '😃', '❤️', '💝', '🎉', '🎊', '🎈', '🎁', '🍰', '🥳', '🪅']
  },
  {
    name: 'travel',
    icon: '✈️',
    emojis: ['✈️', '🚗', '🚕', '🚙', '🚌', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚘', '🚖', '🚆', '🚊', '🚇', '🚲', '🛴', '🛵', '🏍️']
  },
  {
    name: 'time',
    icon: '⏰',
    emojis: ['⏰', '⏱️', '⏲️', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '📅', '📆', '🗓️', '⌚', '⏳', '⌛', '🌅', '🌄', '🌇']
  }
]

const currentEmojis = computed(() => {
  const category = categories.find(c => c.name === selectedCategory.value)
  return category ? category.emojis : []
})

const selectEmoji = (emoji) => {
  emit('update:modelValue', emoji)
}

const pickerStyle = computed(() => ({
  background: tokens.value.colors.bgSecondary,
  border: `1px solid ${tokens.value.colors.border}`,
  borderRadius: tokens.value.radius.lg,
  padding: tokens.value.spacing.md,
  maxWidth: '320px'
}))

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: tokens.value.spacing.xs,
  maxHeight: '240px',
  overflowY: 'auto',
  padding: tokens.value.spacing.xs
}))

const categoryButtonStyle = (categoryName) => {
  const isActive = selectedCategory.value === categoryName
  return {
    fontSize: tokens.value.typography.sizes.lg,
    padding: tokens.value.spacing.xs,
    background: isActive ? tokens.value.colors.primary : 'transparent',
    border: 'none',
    borderRadius: tokens.value.radius.md,
    cursor: 'pointer',
    transition: tokens.value.transitions.fast,
    opacity: isActive ? 1 : 0.6
  }
}

const emojiButtonStyle = (emoji) => {
  const isSelected = props.modelValue === emoji
  return {
    fontSize: tokens.value.typography.sizes['2xl'],
    padding: tokens.value.spacing.sm,
    background: isSelected ? tokens.value.colors.primaryLight : 'transparent',
    border: `2px solid ${isSelected ? tokens.value.colors.primary : 'transparent'}`,
    borderRadius: tokens.value.radius.md,
    cursor: 'pointer',
    transition: tokens.value.transitions.fast
  }
}
</script>

<style scoped>
.emoji-categories {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid;
  border-color: inherit;
  flex-wrap: wrap;
}

.category-btn:hover {
  opacity: 1 !important;
}

.emoji-btn:hover {
  transform: scale(1.1);
}

.emoji-grid::-webkit-scrollbar {
  width: 6px;
}

.emoji-grid::-webkit-scrollbar-track {
  background: transparent;
}

.emoji-grid::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.emoji-grid::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
