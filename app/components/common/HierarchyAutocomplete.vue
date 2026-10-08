<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseIcon from './base/BaseIcon.vue'
import HierarchyNodeItem from './HierarchyNode.vue'
import type { ControllerGroup } from '~/types/Portal'

export type HierarchyOption = ControllerGroup

export type HierarchySelection = {
  id: number
  mode: 'self' | 'group'
} | null

const props = defineProps<{
  items: HierarchyOption[]
  placeholder?: string
}>()

const model = defineModel<HierarchySelection>({ default: null })

const opened = ref(false)
const search = ref('')

function filterNodes(
  nodes: HierarchyOption[],
  query: string,
): HierarchyOption[] {
  if (!query) {
    return nodes
  }

  return nodes.reduce<HierarchyOption[]>((result, node) => {
    const selfMatches = node.name?.toLowerCase().includes(query)
      || node.groupName?.toLowerCase().includes(query)

    // Совпадение пользователя или отдела сохраняет всё его поддерево.
    if (selfMatches) {
      result.push(node)
      return result
    }

    const children = filterNodes(node.children, query)

    if (children.length) {
      result.push({ ...node, children })
    }

    return result
  }, [])
}

const query = computed(() => search.value.trim().toLowerCase())
const filteredItems = computed(() => filterNodes(props.items, query.value))

function findNode(
  nodes: HierarchyOption[],
  id: number,
): HierarchyOption | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }

    const found = findNode(node.children, id)

    if (found) {
      return found
    }
  }

  return null
}

const selectedNode = computed(() =>
  model.value ? findNode(props.items, model.value.id) : null,
)

const displayValue = computed(() => {
  if (opened.value) {
    return search.value
  }

  return selectedNode.value?.name || selectedNode.value?.groupName || ''
})

function open() {
  if (opened.value) return

  opened.value = true
  search.value = ''
}

function close() {
  opened.value = false
  search.value = ''
}

function select(node: HierarchyOption, mode?: NonNullable<HierarchySelection>['mode']) {
  // Режим можно передать явно, когда появится отдельный выбор самого начальника.
  model.value = {
    id: node.id,
    mode: mode ?? (node.children.length > 0 ? 'group' : 'self'),
  }

  close()
}

function onInput(event: Event) {
  search.value = (event.target as HTMLInputElement).value
  opened.value = true
}
</script>

<template>
  <div class="hierarchy-autocomplete">
    <div
      class="ha-input-wrapper"
      @click="open"
    >
      <input
        class="ha-input"
        :value="displayValue"
        :placeholder="placeholder"
        @input="onInput"
        @focus="open"
      >

      <button
        v-if="model"
        type="button"
        class="ha-clear"
        aria-label="Очистить выбор"
        @click.stop="model = null"
      >
        <BaseIcon name="mdi-close" />
      </button>

      <span class="ha-arrow">
        <BaseIcon name="mdi-chevron-down" />
      </span>
    </div>

    <div
      v-if="opened"
      class="ha-menu"
    >
      <div
        v-if="!filteredItems.length"
        class="ha-empty"
      >
        Ничего не найдено
      </div>

      <HierarchyNodeItem
        v-for="node in filteredItems"
        :key="node.id"
        :node="node"
        :selected="model"
        :searching="!!query"
        @select="select"
      />
    </div>
  </div>
</template>

<style lang="scss">
.hierarchy-autocomplete {
  position: relative;
  width: 100%;

  .ha-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 2.625rem;
    border: 1px solid #ccc;
    border-radius: .375rem;
    background: white;

    .ha-input {
      flex: 1;
      width: 100%;
      min-width: 0;
      padding: .625rem 2.5rem .625rem .75rem;
      border: none;
      outline: none;
      background: transparent;
    }

    .ha-arrow {
      position: absolute;
      right: .75rem;
      pointer-events: none;
    }

    .ha-clear {
      position: absolute;
      right: 2rem;
      display: grid;
      place-items: center;
      border: none;
      background: none;
      cursor: pointer;
    }
  }

  .ha-menu {
    position: absolute;
    z-index: 1000;
    top: calc(100% + .25rem);
    left: 0;
    right: 0;
    max-height: 25rem;
    overflow: auto;
    padding: .375rem 0;
    border: 1px solid #ddd;
    border-radius: .375rem;
    background: white;
    box-shadow: 0 .25rem .5rem rgb(0 0 0 / 8%), 0 .5rem 1.5rem rgb(0 0 0 / 8%);

    .ha-empty {
      padding: 1rem;
      text-align: center;
      color: #888;
    }
  }
}
</style>
