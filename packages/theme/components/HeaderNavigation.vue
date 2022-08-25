<template>
  <div class="sf-header__navigation desktop" v-if="!isMobile">
    <SfHeaderNavigationItem
      v-for="(menu, index) in menus"
      :key="index"
      class="nav-item"
      v-e2e="`app-header-url_${menu.slug}`"
      :label="menu.label"
      :link="localePath(`/c/${menu.slug}`)"
    />
  </div>
  <SfModal v-else :visible="isMobileMenuOpen">
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
</template>

<script>
import { SfMenuItem, SfModal } from '@storefront-ui/vue';
import { useUiState, useUiHelpers } from '~/composables';
import { useCategory, categoryGetters } from '@vue-storefront/orc-vsf';
import { computed } from '@nuxtjs/composition-api';
import { onSSR } from '@vue-storefront/core';

export default {
  name: 'HeaderNavigation',
  components: {
    SfMenuItem,
    SfModal
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { isMobileMenuOpen, toggleMobileMenu } = useUiState();
    const { search: searchCategories, categories, loading } = useCategory('categories');
    const th = useUiHelpers();

    onSSR(async () => {
      await searchCategories({});
    });

    const menus = computed(() => categoryGetters.getCategoryTree(categories.value, th.getFacetsFromURL()?.categorySlug, 1)?.items.slice(0, 5));

    return {
      menus,
      loading,
      isMobileMenuOpen,
      toggleMobileMenu
    };
  }
};
</script>

<style lang="scss" scoped>
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
