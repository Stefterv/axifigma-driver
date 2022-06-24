<template>
  <div class="select-menu">
    <button class="select-menu__button" @click="visible = true">
      <span class="select-menu__label">{{ value ? value : "-" }}</span>
      <span class="select-menu__caret"></span>
    </button>
    <ul
      class="select-menu__menu "
      :class="{ 'select-menu__menu--active': visible }"
    >
      <li
        class="select-menu__item"
        v-for="option in options"
        :key="option[property]"
        :data-value="option[property]"
        position="6"
        @click="
          $emit('input', option[property]);
          visible = false;
        "
      >
        <span class="select-menu__item-icon"></span>
        <span class="select-menu__item-label">{{ option[property] }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    property: {
      type: String | null,
      default: null,
    },
    value: {
      type: String | null,
      default: null,
    },
  },
  watch: {
    async visible(visible) {
      if (!visible) return;
      let checkEl = () => {};

      await new Promise((resolve) => {
        checkEl = (event) => {
          if (this.$el.contains(event.target)) return;
          resolve();
        };
        this.$nextTick(() => {
          document.addEventListener("click", checkEl);
        });
      });
      this.visible = false;
      document.removeEventListener("click", checkEl);
    },
  },
  data() {
    return {
      visible: false,
    };
  },
};
</script>
