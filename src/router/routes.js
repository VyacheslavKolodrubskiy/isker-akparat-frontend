import TheEmptyRouterView from '@/components/TheEmptyRouterView.vue';
import Error500 from '@/pages/errors/Error500.vue';
import { setFromRedirect } from '@/router/guards';
import { DEFAULT_LOGGED_IN_ROUTE_NAME } from '@/config/constants';

export const routes = [
  {
    path: '/logout',
    name: 'logout',
    component: () => import(/* webpackChunkName: "auth" */ '@/pages/auth/Logout.vue'),
  },

  {
    path: '/login',
    meta: {
      onlyLoggedOut: true,
      title: 'Авторизация',
    },
    component: () => import(/* webpackChunkName: "auth" */ '@/layouts/TheLayoutAuth.vue'),
    children: [
      {
        path: '',
        name: 'login',
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "auth" */ '@/pages/auth/Login.vue'),
      },
    ],
  },
  {
    path: '/',
    name: 'default',
    redirect: { name: DEFAULT_LOGGED_IN_ROUTE_NAME },
    component: () => import(/* webpackChunkName: "layout-default" */ '@/layouts/TheLayoutDefault.vue'),
    children: [
      {
        path: '/statistics',
        component: TheEmptyRouterView,
        meta: {
          breadcrumbName: 'Статистика',
          title: 'Главная',
        },
        children: [
          {
            path: '',
            name: 'Statistics',
            component: () => import(/* webpackChunkName: "statistics" */ '@/pages/statistics/StatisticsMain.vue'),
          },
          {
            path: 'suz',
            name: 'StatisticsSuz',
            meta: {
              breadcrumbName: 'Статистика по СУЗ / Печать',
            },
            component: () => import(/* webpackChunkName: "statistics" */ '@/pages/statistics/StatisticsSuz.vue'),
          },
          {
            path: 'npc',
            name: 'StatisticsNpc',
            meta: {
              breadcrumbName: 'Статистика по НКТ',
            },
            component: () => import(/* webpackChunkName: "statistics" */ '@/pages/statistics/StatisticsNpc.vue'),
          },
          {
            path: 'application',
            name: 'StatisticsApplication',
            meta: {
              breadcrumbName: 'Статистика по Заявкам',
            },
            component: () => import(/* webpackChunkName: "statistics" */ '@/pages/statistics/StatisticsApplication.vue'),
          },
        ],
      },
      {
        path: '/npc',
        component: TheEmptyRouterView,
        redirect: { name: 'Groups' },
        meta: {
          breadcrumbName: 'НКТ',
        },
        children: [
          {
            path: 'groups',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Группы товаров',
              title: 'Группы товаров',
            },
            children: [
              {
                path: '',
                name: 'Groups',
                meta: {
                  permissions: ['admin', 'manager'],
                },
                component: () => import(/* webpackChunkName: "npc-group" */ '@/pages/npc/groups/GroupsMain.vue'),
              },
              {
                path: 'add',
                name: 'GroupsAdd',
                meta: {
                  permissions: ['manager'],
                  breadcrumbName: 'Добавить “Группу товаров”',
                  title: 'Добавить группу товаров',
                },
                component: () => import(/* webpackChunkName: "npc-group" */ '@/pages/npc/groups/GroupsAdd.vue'),
              },
              {
                path: ':id/edit',
                name: 'ProductGroupEdit',
                meta: {
                  permissions: ['admin', 'manager'],
                  title: 'Просмотр группы товаров',
                },
                component: () => import(/* webpackChunkName: "npc-group" */ '@/pages/npc/groups/GroupsEdit.vue'),
              },
            ],
          },
          {
            path: 'list',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Список товаров',
              title: 'Список товаров',
            },
            children: [
              {
                path: '',
                name: 'ProductList',
                meta: {
                  permissions: ['admin', 'manager'],
                },
                component: () => import(/* webpackChunkName: "npc-list" */ '@/pages/npc/list/NpcListMain.vue'),
              },
              {
                path: ':id',
                name: 'ProductListView',
                meta: {
                  permissions: ['admin', 'manager'],
                  title: 'Просмотр товара',
                },
                component: () => import(/* webpackChunkName: "npc-list" */ '@/pages/npc/list/NpcListView.vue'),
              },
            ],
          },
        ],
      },

      {
        path: '/application',
        component: TheEmptyRouterView,
        redirect: { name: 'ApplicationIqid' },
        meta: {
          breadcrumbName: 'Заявки',
          title: 'Заявки',
        },
        children: [
          {
            path: 'iqid',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'IQID',
              title: 'Заявки IQID',
            },
            children: [
              {
                path: '',
                name: 'ApplicationIqid',
                component: () => import(/* webpackChunkName: "applicationIqid" */ '@/pages/application/iqid/ApplicationMain.vue'),
              },
              {
                path: 'add',
                name: 'ApplicationAdd',
                meta: {
                  permissions: ['manager', 'client'],
                  breadcrumbName: 'Добавить “Заявку”',
                  title: 'Добавить заявку',
                },
                component: () => import(/* webpackChunkName: "applicationIqid" */ '@/pages/application/iqid/ApplicationAdd.vue'),
              },
              {
                path: ':id',
                name: 'ApplicationView',
                meta: {
                  breadcrumbName: 'Просмотр “Заявки”',
                  title: 'Просмотр заявки',
                },
                component: () => import(/* webpackChunkName: "applicationIqid" */ '@/pages/application/iqid/ApplicationView.vue'),
              },
            ],
          },
          {
            path: 'tanbalau',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Tanbalau',
              title: 'Заявки Tanbalau',
            },
            children: [
              {
                path: '',
                name: 'ApplicationTanbalau',
                component: () => import(/* webpackChunkName: "applicationTanbalau" */ '@/pages/application/tanbalau/ApplicationMain.vue'),
              },
              {
                path: 'add',
                name: 'ApplicationTanbalauAdd',
                meta: {
                  permissions: ['client'],
                  breadcrumbName: 'Добавить “Заявку”',
                  title: 'Добавить заявку',
                },
                component: () => import(/* webpackChunkName: "applicationIqid" */ '@/pages/application/iqid/ApplicationAdd.vue'),
              },
              {
                path: ':id',
                name: 'ApplicationTanbalauView',
                meta: {
                  breadcrumbName: 'Просмотр “Заявки”',
                  title: 'Просмотр заявки',
                },
                component: () => import(/* webpackChunkName: "applicationTanbalau" */ '@/pages/application/tanbalau/ApplicationView.vue'),
              },
            ],
          },
        ],
      },

      {
        path: '/suz',
        component: TheEmptyRouterView,
        redirect: { name: 'Order' },
        meta: {
          breadcrumbName: 'Система управления заказами (СУЗ)',
        },
        children: [
          {
            path: 'order',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Заказы на формирование КМ',
              title: 'Заказы на формирование КМ',
            },
            children: [
              {
                path: '',
                name: 'Order',
                meta: {
                  permissions: ['admin', 'manager'],
                },
                component: () => import(/* webpackChunkName: "orders" */ '@/pages/suz/orders/OrdersMain.vue'),
              },
              {
                path: 'add',
                name: 'OrderAdd',
                meta: {
                  permissions: ['manager'],
                  breadcrumbName: 'Добавить “Заказ на формирование КМ”',
                  title: 'Добавить Заказ на формирование КМ',
                },
                component: () => import(/* webpackChunkName: "orders" */ '@/pages/suz/orders/OrdersAdd.vue'),
              },
              {
                path: ':id/edit',
                name: 'OrderEdit',
                meta: {
                  permissions: ['manager'],
                  breadcrumbName: 'Редактировать  “Заказ на формирование КМ”',
                  title: 'Редактировать Заказ на формирование КМ',
                },
                component: () => import(/* webpackChunkName: "orders" */ '@/pages/suz/orders/OrdersEdit.vue'),
              },
              {
                path: ':id',
                name: 'OrderView',
                meta: {
                  permissions: ['admin', 'manager'],
                  breadcrumbName: 'Просмотр  “Заказ на формирование КМ”',
                  title: 'Просмотр Заказа на формирование КМ',
                },
                component: () => import(/* webpackChunkName: "orders" */ '@/pages/suz/orders/OrdersView.vue'),
              },
            ],
          },

          {
            path: 'print',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Печать КМ',
              title: 'Печать КМ',
            },
            children: [
              {
                path: '',
                name: 'Print',
                meta: {
                  permissions: ['admin', 'manager'],
                },
                component: () => import(/* webpackChunkName: "print" */ '@/pages/suz/print/PrintMain.vue'),
              },
              {
                path: 'add',
                name: 'PrintAdd',
                meta: {
                  permissions: ['manager'],
                  breadcrumbName: 'Добавить ”Форма печати”',
                  title: 'Добавить Печать КМ',
                },
                component: () => import(/* webpackChunkName: "print" */ '@/pages/suz/print/PrintAdd.vue'),
              },
              {
                path: 'reprint-add',
                name: 'RePrintAdd',
                meta: {
                  permissions: ['manager'],
                  breadcrumbName: 'Добавить ”Повторная форма печати”',
                  title: 'Добавить Повторную Печать КМ',
                },
                component: () => import(/* webpackChunkName: "print" */ '@/pages/suz/print/RePrintAdd.vue'),
              },
              {
                path: ':id/edit',
                name: 'PrintEdit',
                meta: {
                  permissions: ['manager'],
                  breadcrumbName: 'Редактировать ”Форма печати”',
                  title: 'Редактировать Печать КМ',
                },
                component: () => import(/* webpackChunkName: "print" */ '@/pages/suz/print/PrintEdit.vue'),
              },
              {
                path: ':id/reprint-edit',
                name: 'RePrintEdit',
                meta: {
                  permissions: ['manager'],
                  breadcrumbName: 'Редактировать ”Повторная форма печати”',
                  title: 'Редактировать Повторную Печать КМ',
                },
                component: () => import(/* webpackChunkName: "print" */ '@/pages/suz/print/RePrintEdit.vue'),
              },
              {
                path: ':id',
                name: 'PrintView',
                meta: {
                  permissions: ['admin', 'manager'],
                  breadcrumbName: 'Просмотр “Форма печати”',
                  title: 'Просмотр Печати КМ',
                },
                component: () => import(/* webpackChunkName: "print" */ '@/pages/suz/print/PrintView.vue'),
              },
            ],
          },

          {
            path: 'reprint',
            component: TheEmptyRouterView,
            redirect: { name: 'Print' },
            meta: {
              breadcrumbName: 'Печать КМ',
              title: 'Печать КМ',
            },
            children: [
              {
                path: ':id/add',
                name: 'RePrintAdd',
                meta: {
                  permissions: ['manager'],
                  breadcrumbName: 'Добавить ”Повторная форма печати”',
                  title: 'Добавить Повторную Печать КМ',
                },
                component: () => import(/* webpackChunkName: "print" */ '@/pages/suz/print/RePrintAdd.vue'),
              },
              {
                path: ':id/edit',
                name: 'RePrintEdit',
                meta: {
                  permissions: ['manager'],
                  breadcrumbName: 'Редактировать ”Повторная форма печати”',
                  title: 'Редактировать Повторную Печать КМ',
                },
                component: () => import(/* webpackChunkName: "print" */ '@/pages/suz/print/RePrintEdit.vue'),
              },
            ],
          },
        ],
      },

      {
        path: '/catalog',
        component: TheEmptyRouterView,
        redirect: { name: 'CatalogBranches' },
        meta: {
          breadcrumbName: 'Справочники',
        },
        children: [
          {
            path: 'branches',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Филиалы',
              title: 'Филиалы',
            },
            children: [
              {
                path: '',
                name: 'CatalogBranches',
                component: () => import(/* webpackChunkName: "catalog-branches" */ '@/pages/catalog/branches/BranchesMain.vue'),
              },
              {
                path: 'add',
                name: 'CatalogBranchesAdd',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Добавить “Филиал”',
                  title: 'Добавить филиал',
                },
                component: () => import(/* webpackChunkName: "catalog-branches" */ '@/pages/catalog/branches/BranchesAdd.vue'),
              },
              {
                path: ':id/edit',
                name: 'CatalogBranchesEdit',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Редактировать “Филиал”',
                  title: 'Редактировать филиал',
                },
                component: () => import(/* webpackChunkName: "catalog-branches" */ '@/pages/catalog/branches/BranchesEdit.vue'),
              },
              {
                path: ':id',
                name: 'CatalogBranchesView',
                meta: {
                  breadcrumbName: 'Просмотр “Филиала”',
                  title: 'Просмотр филиала',
                },
                component: () => import(/* webpackChunkName: "catalog-branches" */ '@/pages/catalog/branches/BranchesView.vue'),
              },
            ],
          },

          {
            path: 'organizations',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Организации клиентов',
              title: 'Организации клиентов',
            },
            children: [
              {
                path: '',
                name: 'CatalogOrganizations',
                component: () => import(/* webpackChunkName: "catalog-organizations" */ '@/pages/catalog/organizations/OrganizationsMain.vue'),
              },
              {
                path: ':id/edit',
                name: 'CatalogOrganizationsEdit',
                meta: {
                  breadcrumbName: 'Редактировать “Организацию клиента”',
                  title: 'Редактировать Организацию клиента',
                },
                component: () => import(/* webpackChunkName: "catalog-organizations" */ '@/pages/catalog/organizations/OrganizationsEdit.vue'),
              },
              {
                path: 'add',
                name: 'CatalogOrganizationsAdd',
                meta: {
                  permissions: ['admin', 'manager'],
                  breadcrumbName: 'Добавить “Организацию клиента”',
                  title: 'Добавить Организацию клиента',
                },
                component: () => import(/* webpackChunkName: "catalog-organizations" */ '@/pages/catalog/organizations/OrganizationsAdd.vue'),
              },
              {
                path: ':id',
                name: 'CatalogOrganizationsView',
                meta: {
                  breadcrumbName: 'Просмотр “Организации клиента”',
                  title: 'Просмотр Организации клиента',
                },
                component: () => import(/* webpackChunkName: "catalog-organizations" */ '@/pages/catalog/organizations/OrganizationsView.vue'),
              },
            ],
          },

          {
            path: 'region',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'ГРЗ/Области',
              title: 'ГРЗ/Область',
            },
            children: [
              {
                path: '',
                name: 'CatalogRegion',
                meta: {
                  permissions: ['admin'],
                },
                component: () => import(/* webpackChunkName: "catalog-regions" */ '@/pages/catalog/regions/RegionsMain.vue'),
              },
              {
                path: ':id/edit',
                name: 'CatalogRegionEdit',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Редактировать “ГРЗ/Область”',
                  title: 'Редактировать ГРЗ/Область',
                },
                component: () => import(/* webpackChunkName: "catalog-regions" */ '@/pages/catalog/regions/RegionsEdit.vue'),
              },
              {
                path: 'add',
                name: 'CatalogRegionAdd',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Добавить “ГРЗ/Область”',
                  title: 'Добавить ГРЗ/Область',
                },
                component: () => import(/* webpackChunkName: "catalog-regions" */ '@/pages/catalog/regions/RegionsAdd.vue'),
              },
            ],
          },

          {
            path: 'city',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Города',
              title: 'Город',
            },
            children: [
              {
                path: '',
                name: 'CatalogCity',
                meta: {
                  permissions: ['admin'],
                },
                component: () => import(/* webpackChunkName: "catalog-city" */ '@/pages/catalog/city/CityMain.vue'),
              },
              {
                path: ':id/edit',
                name: 'CatalogCityEdit',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Редактировать “Город”',
                  title: 'Редактировать город',
                },
                component: () => import(/* webpackChunkName: "catalog-city" */ '@/pages/catalog/city/CityEdit.vue'),
              },
              {
                path: 'add',
                name: 'CatalogCityAdd',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Добавить “Город”',
                  title: 'Добавить город',
                },
                component: () => import(/* webpackChunkName: "catalog-city" */ '@/pages/catalog/city/CityAdd.vue'),
              },
            ],
          },
        ],
      },

      {
        path: '/profile',
        name: 'Profile',
        meta: {
          title: 'Мой профиль',
        },
        component: () => import(/* webpackChunkName: "Profile" */ '@/pages/profile/ProfileMain.vue'),
      },

      {
        path: '/users',
        component: TheEmptyRouterView,
        redirect: { name: 'UsersAdmin' },
        meta: {
          breadcrumbName: 'Пользователи',
        },
        children: [
          {
            path: 'admin',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Администраторы',
              title: 'Пользователи Администратор',
            },
            children: [
              {
                path: '',
                name: 'UsersAdmin',
                meta: {
                  permissions: ['admin'],
                },
                component: () => import(/* webpackChunkName: "users-admin" */ '@/pages/users/admin/AdminMain.vue'),
              },
              {
                path: 'add',
                name: 'UsersAdminAdd',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Добавить “Администратора”',
                  title: 'Добавить пользователя Администратор',
                },
                component: () => import(/* webpackChunkName: "users-admin" */ '@/pages/users/admin/AdminAdd.vue'),
              },
              {
                path: ':id/edit',
                name: 'UsersAdminEdit',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Редактировать “Администратора”',
                  title: 'Редактировать пользователя Администратор',
                },
                component: () => import(/* webpackChunkName: "users-admin" */ '@/pages/users/admin/AdminEdit.vue'),
              },
              {
                path: ':id',
                name: 'UsersAdminView',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Просмотр “Администратора”',
                  title: 'Просмотр пользователя Администратор',
                },
                component: () => import(/* webpackChunkName: "users-admin" */ '@/pages/users/admin/AdminView.vue'),
              },
            ],
          },

          {
            path: 'manager',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Менеджеры',
              title: 'Пользователи Менеджер',
            },
            children: [
              {
                path: '',
                name: 'UsersManager',
                meta: {
                  permissions: ['admin', 'manager'],
                },
                component: () => import(/* webpackChunkName: "user-manager" */ '@/pages/users/manager/ManagerMain.vue'),
              },
              {
                path: 'add',
                name: 'UsersManagerAdd',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Добавить “Менеджера”',
                  title: 'Добавить пользователя Менеджер',
                },
                component: () => import(/* webpackChunkName: "user-manager" */ '@/pages/users/manager/ManagerAdd.vue'),
              },
              {
                path: ':id/edit',
                name: 'UsersManagerEdit',
                meta: {
                  permissions: ['admin'],
                  breadcrumbName: 'Редактировать “Менеджера”',
                  title: 'Редактировать пользователя Менеджер',
                },
                component: () => import(/* webpackChunkName: "user-manager" */ '@/pages/users/manager/ManagerEdit.vue'),
              },
              {
                path: ':id',
                name: 'UsersManagerView',
                meta: {
                  permissions: ['admin', 'manager'],
                  breadcrumbName: 'Просмотр “Менеджера”',
                  title: 'Просмотр пользователя Менеджер',
                },
                component: () => import(/* webpackChunkName: "user-manager" */ '@/pages/users/manager/ManagerView.vue'),
              },
            ],
          },

          {
            path: 'client',
            component: TheEmptyRouterView,
            meta: {
              breadcrumbName: 'Клиенты',
              title: 'Пользователи Клиент',
            },
            children: [
              {
                path: '',
                name: 'UsersClient',
                meta: {
                  permissions: ['admin', 'manager'],
                },
                component: () => import(/* webpackChunkName: "user-customer" */ '@/pages/users/client/ClientMain.vue'),
              },
              {
                path: 'add',
                name: 'UsersClientAdd',
                meta: {
                  permissions: ['admin', 'manager'],
                  breadcrumbName: 'Добавить “Клиента”',
                  title: 'Добавить пользователя Клиент',
                },
                component: () => import(/* webpackChunkName: "user-customer" */ '@/pages/users/client/ClientAdd.vue'),
              },
              {
                path: ':id/edit',
                name: 'UsersClientEdit',
                meta: {
                  permissions: ['admin', 'manager'],
                  breadcrumbName: 'Редактировать “Клиента”',
                  title: 'Редактировать пользователя Клиент',
                },
                component: () => import(/* webpackChunkName: "user-customer" */ '@/pages/users/client/ClientEdit.vue'),
              },
              {
                path: ':id',
                name: 'UsersClientView',
                meta: {
                  permissions: ['admin', 'manager'],
                  breadcrumbName: 'Просмотр “Клиента”',
                  title: 'Просмотр пользователя Клиент',
                },
                component: () => import(/* webpackChunkName: "user-customer" */ '@/pages/users/client/ClientView.vue'),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/forbidden',
    name: 'Error403',
    meta: {
      title: '403',
    },
    component: () => import(/* webpackChunkName: "error" */ '@/pages/errors/Error403.vue'),
  },
  {
    path: '/internal-server-error',
    name: 'Error500',
    meta: {
      title: '500',
    },
    /*
     * Эта страница должна быть загружена заранее,
     * т.к. если будет проблема с интернетом, мы легко сможем на неё редиректнуть
     */
    component: Error500,
    beforeEnter: [setFromRedirect],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Error404',
    meta: {
      title: '404',
    },
    component: () => import(/* webpackChunkName: "error" */ '@/pages/errors/Error404.vue'),
  },
];
