<template>
<div >
  <div class="sf-header__navigation desktop desktop-only">
    <div class="header-navigation" @mouseleave="hideSubcategories"
      >
      <SfHeaderNavigationItem
        v-for="(menu, index) in menus"
        :key="index"
        ref="lvl0CatRefs"
        class="nav-item"
        v-e2e="`app-header-url_${menu.slug}`"
        :label="menu.label"
        :data-index="index"
        @click.native="setCurrentCategory(null)"
        @mouseenter.native.prevent="onMouseEnter(menu)"
        keyup.tab.native.prevent="setFocus($event)"
        @keydown.up.native.prevent="setCurrentCategory(null)"
        @keydown.down.native.prevent="setCurrentCategory(menu)"
        :link="localePath(`/c/${menu.slug}`)"
      />
      <HeaderNavigationSubcategories :currentCategory="currentCategory"
          @hideSubcategories="hideSubcategories"  />
    </div>
  </div>
  <div class="smartphone-only">
  <SfModal :visible="isMobileMenuOpen">
    <div class="sf-header-navigation-item__item sf-header-navigation-item__item--mobile"
      v-for="(menu, index) in menus" :key="index">
      <SfMenuItem
          :label="menu.label"
          class="sf-header-navigation-item__menu-item"
          :link="localePath(`/c/${menu.slug}`)"
          @click.native="toggleMobileMenu"
        />
    </div>
  </SfModal>
  </div>
</div>
</template>

<script>
import { computed, ref } from '@nuxtjs/composition-api';
import { SfMenuItem, SfModal } from '@storefront-ui/vue';
import { useUiState, useUiHelpers } from '~/composables';
import { useCategory, categoryGetters } from '@vue-storefront/orc-vsf';
import { onSSR } from '@vue-storefront/core';
import HeaderNavigationSubcategories from './HeaderNavigationSubcategories.vue';

export default {
  name: 'HeaderNavigation',
  components: {
    SfMenuItem,
    SfModal,
    HeaderNavigationSubcategories
  },
  setup() {
    const { isMobileMenuOpen, toggleMobileMenu } = useUiState();
    const { search: searchCategories, categories, loading } = useCategory('categories');
    const th = useUiHelpers();
    const currentCategory = ref(null);
    const hasFocus = ref(false);
    let focusedElement = null;

    onSSR(async () => {
      await searchCategories({});
    });

    const menus = computed(() => categoryGetters.getCategoryTree(categories.value, th.getFacetsFromURL()?.categorySlug, 3)?.items.slice(0, 5));

    const setCurrentCategory = (category) => {
      currentCategory.value = category;
    };

    const setFocus = (event) => {
      focusedElement = event.target;
      hasFocus.value = true;
    };

    const onMouseEnter = (category) => {
      setCurrentCategory(category);
      hasFocus.value = false;
    };

    const hideSubcategories = () => {
      setCurrentCategory(null);
      if (focusedElement !== null) focusedElement.focus();
    };

    return {
      menus,
      loading,
      isMobileMenuOpen,
      toggleMobileMenu,
      onMouseEnter,
      setFocus,
      currentCategory,
      setCurrentCategory,
      hideSubcategories
    };
  }
};
</script>

<style lang="scss" scoped>
.header-navigation {
  display: flex;

  .nav-item {
      &:hover {
        color: var(--c-primary);
      }
  }
}
.sf-header-navigation-item {
  ::v-deep &__item--mobile {
    display: block;
  }
}
.sf-modal {
  ::v-deep &__bar {
    display: none;
  }
  ::v-deep &__content {
    padding: var(--modal-content-padding, var(--spacer-base) 0);
  }
}
</style>
