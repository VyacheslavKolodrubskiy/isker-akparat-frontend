<template>
  <ALayoutSider
    breakpoint="xl"
    class="sidebar"
    collapsed-width="0"
    width="240">
    <RouterLink class="sidebar__logo" to="/">
      <img alt="" src="@/assets/images/logo-iqid-white.svg">
    </RouterLink>
    <AMenu mode="inline" theme="dark">
      <template v-for="item in items">
        <template v-if="item.title">
          <ASubMenu
            v-if="item.children.some((i) => $canUse(i.permissions))"
            :key="`sub-menu-${item.title}`">
            <template #title>
              {{ item.title }}
            </template>
            <template v-for="child in item.children">
              <AMenuItem
                v-if="$canUse(child.permissions)"
                :key="`child_${child.name}_${item.title}`">
                <RouterLink :to="{ name: child.link }" />
                {{ child.name }}
              </AMenuItem>
            </template>
          </ASubMenu>
        </template>
        <template v-else>
          <AMenuItem
            v-if="$canUse(item.permissions)"
            :key="`sub-menu${item.name}`">
            <RouterLink :to="{ name: item.link }" />
            {{ item.name }}
          </AMenuItem>
        </template>
      </template>
    </AMenu>
  </ALayoutSider>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TheSidebar',
  data() {
    return {
      items: [
        {
          link: 'Statistics',
          name: 'Главная',
        },
        {
          title: 'НКТ',
          children: [
            {
              link: 'Groups',
              name: 'Группы товаров',
            },
            {
              link: 'ProductList',
              name: 'Список товаров',
            },
          ],
        },
        {
          title: 'Заявки',
          children: [
            {
              link: 'ApplicationIqid',
              name: 'ERP IQID',
            },
            {
              link: 'ApplicationTanbalau',
              name: 'ERP Tanbalau',
            },
          ],
        },
        {
          title: 'CУЗ',
          children: [
            {
              link: 'Order',
              name: 'Формирование КМ',
            },
            {
              link: 'Print',
              name: 'Печать',
            },
          ],
        },
        {
          title: 'Справочники',
          children: [
            {
              link: 'CatalogBranches',
              name: 'Филиалы',
            },
            {
              link: 'CatalogOrganizations',
              name: 'Организации клиентов',
            },
            {
              link: 'CatalogRegion',
              name: 'ГРЗ/Область',
            },
            {
              link: 'CatalogCity',
              name: 'Город',
            },
          ],
        },
        {
          title: 'Пользователи',
          children: [
            {
              link: 'UsersAdmin',
              name: 'Администратор',
            },
            {
              link: 'UsersManager',
              name: 'Менеджер',
            },
            {
              link: 'UsersClient',
              name: 'Клиент',
            },
          ],
        },
      ],
    };
  },
  created() {
    this.resolvePermissions();
  },
  methods: {
    resolvePermissions() {
      for (const item of this.items) {
        const { meta } = this.$router.resolve({ name: item.link });
        if ('title' in item) {
          for (const child of item.children) {
            const { meta } = this.$router.resolve({ name: child.link });
            child.permissions = meta.permissions;
          }
        } else {
          item.permissions = meta.permissions;
        }
      }
    },
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/current',
    }),
  },
};
</script>
