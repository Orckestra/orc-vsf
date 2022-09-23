<template>
  <div
    v-if="hasChildren(currentCategory)"
    data-testid="navigation-subcategories"
    class="header-navigation__subcategories"
  >
    <div class="header-navigation__subcategories-inner">
      <div
        v-for="(itemLvl1, idxLvl1) in currentCategory.items"
        :key="idxLvl1"
        class="header-navigation__subcategory"
        aria-haspopup="true"
      >
        <SfLink
          ref="lvl1CatRefs"
          class="header-navigation__link1"
          :link="localePath(getCatLink(itemLvl1))"
          :data-children="itemLvl1.items.length"
          @click.native="$emit('hideSubcategories')"
          @keydown.right.native.prevent="onKeyRight()"
          @keydown.left.native.prevent="onKeyLeft()"
          @keydown.down.native.prevent="onKeyDown()"
          @keydown.up.native.prevent="onKeyUp()"
        >
          <h2 class="sf-heading sf-heading--left sf-heading sf-heading--left header-navigation__lvl1link">
            {{ itemLvl1.label }}
          </h2>
        </SfLink>
        <SfList v-if="hasChildren(itemLvl1)">
          <SfListItem
            v-for="(itemLvl2, idxLvl2) in itemLvl1.items"
            :key="idxLvl2"
          >
            <SfLink
              ref="lvl2CatRefs"
              class="header-navigation__lvl2link"
              :link="localePath(getCatLink(itemLvl2))"
              tabindex="-1"
              @click.native="$emit('hideSubcategories')"
              @keydown.right.native.prevent="onKeyRight()"
              @keydown.left.native.prevent="onKeyLeft()"
              @keydown.down.native.prevent="onKeyDown()"
              @keydown.up.native.prevent="onKeyUp()"
                 >
              {{ itemLvl2.label }}
            </SfLink>
          </SfListItem>
        </SfList>
      </div>
    </div>
  </div>
</template>
<script>
import {
  SfLink, SfList
} from '@storefront-ui/vue';
import { useCategory, categoryGetters, useSearch } from 'orc-vsf';
import { useUiHelpers } from '~/composables';
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'HeaderNavigationSubcategories',
  components: {
    SfLink,
    SfList
  },
  props: {
    currentCategory: {
      type: Object,
      default() {
        return null;
      }
    },
    hasFocus: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const { categories } = useCategory('categories');
    const { result: categoryCounts } = useSearch('categoryCounts');
    const { getCatLink } = useUiHelpers();
    const lvl1CatRefs = ref();
    const lvl2CatRefs = ref();
    const lvl2GroupedCatRefs = ref();

    let lvl1CatFocusIdx = 0;
    let lvl2CatFocusIdx = -1;

    const getGroupedLvl2CatRefs = () => {
      let current = 0;
      const result = [];
      lvl1CatRefs.value.forEach((lvl1CatRef) => {
        const groupCount = Number(lvl1CatRef.$el.dataset.children);
        const group = lvl2CatRefs.value.slice(current, current + groupCount);
        result.push(group);
        current += groupCount;
      });
      return result;
    };

    const subCategories = (current) => categoryGetters.getCategoryTree(categories.value, categoryCounts.value, current, 2);

    const hasChildren = (category) => Boolean(category?.items?.length > 0);

    const onKeyRight = () => {
      if (lvl1CatRefs.value[++lvl1CatFocusIdx]) {
        lvl1CatRefs.value[lvl1CatFocusIdx].$el.focus();
        lvl2CatFocusIdx = -1;
        lvl2GroupedCatRefs.value = getGroupedLvl2CatRefs();
      } else {
        lvl1CatFocusIdx--;
      }
    };
    const onKeyLeft = () => {
      if (lvl1CatRefs.value[--lvl1CatFocusIdx]) {
        lvl1CatRefs.value[lvl1CatFocusIdx].$el.focus();
        lvl2CatFocusIdx = -1;
        lvl2GroupedCatRefs.value = getGroupedLvl2CatRefs();
      } else {
        lvl1CatFocusIdx++;
      }
    };
    const onKeyDown = () => {
      lvl2CatFocusIdx++;
      if (lvl2CatFocusIdx !== -1 && !lvl2GroupedCatRefs.value[lvl1CatFocusIdx][lvl2CatFocusIdx]) {
        lvl2CatFocusIdx--;
        return;
      }
      lvl2GroupedCatRefs.value[lvl1CatFocusIdx][lvl2CatFocusIdx].$el.focus();
    };
    const onKeyUp = () => {
      if (lvl2CatFocusIdx > 0) {
        lvl2CatFocusIdx--;
        lvl2GroupedCatRefs.value[lvl1CatFocusIdx][lvl2CatFocusIdx].$el.focus();
        return;
      }
      if (lvl2CatFocusIdx === 0) {
        lvl1CatRefs.value[lvl1CatFocusIdx].$el.focus();
        lvl2CatFocusIdx = -1;
        return;
      }
      if (lvl2CatFocusIdx === -1) {
        emit('hideSubcategories');
      }
    };

    const setupNavIndexes = () => {
      lvl2CatFocusIdx = -1;
      lvl1CatRefs.value[lvl1CatFocusIdx].$el.focus();
      lvl2GroupedCatRefs.value = getGroupedLvl2CatRefs();
    };

    onMounted(() => {
      if (props.hasFocus) {
        setupNavIndexes();
      }
    });

    return {
      getCatLink,
      hasChildren,
      subCategories,
      onKeyRight,
      onKeyLeft,
      onKeyDown,
      onKeyUp,
      setupNavIndexes,
      lvl1CatRefs,
      lvl2CatRefs
    };
  }
});
</script>
<style lang="scss" scoped>
.header-navigation {
  &__subcategories {
    position: absolute;
    z-index: 1;
    background-color: var(--_c-light-primary);
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    left: 0;
    padding: 30px;
    right: 0;
    top: 84px;
    flex-wrap: wrap;
    justify-content: center;
    display: flex;

    &-inner {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      width: var(--header-width, 77.5rem);
    }
  }

  &__subcategory {
    flex: 0 0 25%;
     margin-bottom: var(--spacer-base);
  }

  &__lvl1link {
      font-size: var(--h5-font-size);
      text-decoration: none;
      &:hover {
        color: var(--c-primary);
      }
  }

  &__lvl2link {
    &:hover {
      color: var(--c-primary);
    }
  }

  .sf-link {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
