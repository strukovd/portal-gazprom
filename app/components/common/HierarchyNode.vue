<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseIcon from './base/BaseIcon.vue'
import type { HierarchyOption, HierarchySelection } from './HierarchyAutocomplete.vue'

const props = defineProps<{
  node: HierarchyOption
  selected?: HierarchySelection
  searching?: boolean
  depth?: number
}>()

const emit = defineEmits<{
  select: [node: HierarchyOption, mode?: NonNullable<HierarchySelection>['mode']]
}>()

const manuallyOpened = ref(true)
const depth = computed(() => props.depth ?? 0)
const hasChildren = computed(() => props.node.children.length > 0)
const opened = computed(() => props.searching || manuallyOpened.value)
const isSelected = computed(() =>
  props.selected?.id === props.node.id
)

function toggle() {
  manuallyOpened.value = !manuallyOpened.value
}
</script>

<template>
  <div class="hierarchy-node">
    <div
      class="hn-row"
      :class="{ selected: isSelected, parent: hasChildren }"
      :style="{ paddingLeft: `${.5 + depth * 1.375}rem` }"
    >
      <button
        v-if="hasChildren"
        class="hn-toggle"
        type="button"
        :aria-expanded="!!opened"
        :aria-label="opened ? 'Свернуть подчинённых' : 'Развернуть подчинённых'"
        :disabled="searching"
        @click.stop="toggle"
      >
        <BaseIcon v-if="opened" name="mdi-chevron-down" />
        <BaseIcon v-else name="mdi-chevron-right" />
      </button>

      <button class="hn-name" type="button" @click="emit('select', node)">
        <span class="hn-label">{{ node.name }}</span>
        <span v-if="node.groupName" class="hn-group-name">{{ node.groupName }}</span>
      </button>
    </div>

    <div v-if="hasChildren" v-show="opened" class="hn-children">
      <HierarchyNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :selected="selected"
        :searching="searching"
        :depth="depth + 1"
        @select="(option, mode) => emit('select', option, mode)"
      />
    </div>
  </div>
</template>

<style lang="scss">
.hierarchy-node {
  position: relative;

  .hn-row {
    display: grid;
    grid-template-columns: 1.75rem minmax(0, 1fr);
    align-items: center;
    min-height: 2.25rem;
    padding-right: .75rem;

    &:hover {
      background: #f5f5f5;
    }

    &.selected {
      background: #eee;
      font-weight: 500;
    }

    &.parent {
      font-weight: 600;
    }

    .hn-toggle {
      display: grid;
      place-items: center;
      height: 1.75rem;
      padding: 0;
      border: none;
      background: transparent;
      color: inherit;
      cursor: pointer;

      &:disabled {
        cursor: default;
      }
    }

    .hn-name {
      grid-column: 2;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: .25rem .5rem;
      min-width: 0;
      padding: .5rem .25rem;
      border: none;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;

      .hn-label {
        overflow-wrap: anywhere;
      }

      .hn-group-name {
        max-width: 100%;
        padding: .125rem .5rem;
        border-radius: .375rem;
        background: #f1f5f9;
        color: #64748b;
        font-size: .75rem;
        font-weight: 400;
        line-height: 1.4;
        overflow-wrap: anywhere;
      }
    }
  }

  .hn-children {
    position: relative;
  }
}
</style>
