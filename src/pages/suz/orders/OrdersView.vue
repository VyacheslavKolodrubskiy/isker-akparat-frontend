<template>
  <div v-if="order">
    <APageHeader
      :title="`Просмотр “#${order.id} | ${order.title} (${order.suz_order_id})”`"
      @back="() => $router.go(-1)">
      <template #tags>
        <StatusTag :variant="getOrderStatusVariant(order.status.id)">
          {{ order.status.title }}
        </StatusTag>
      </template>
      <template #extra>
        <template v-if="showEdit">
          <RouterLink class="ant-btn ant-btn-primary ant-btn-lg" :to="{ name: 'OrderEdit' }">
            Редактировать
          </RouterLink>
          <QBtn
            size="large"
            type="success"
            @click="readOrderStatuses">
            Сформировать КМ
          </QBtn>
        </template>

        <QBtn
          v-if="showClose"
          danger
          size="large"
          type="primary"
          @click="readOrderClose">
          Закрыть заказ
        </QBtn>
      </template>
    </APageHeader>

    <ARow :gutter="[24, 20]">
      <ACol
        :lg="14"
        :xs="24"
        :xxl="16">
        <ACard>
          <div v-if="order.declineReason" class="mb-6">
            <h2 class="section-title">
              Причина отклонения
            </h2>
            <div class="rejected-reason">
              {{ order.declineReason }}
            </div>
          </div>
          <h2 class="section-title">
            Товары
          </h2>
          <QTable
            class="marking-code-view-table table--total-row"
            :columns="columns"
            :data-source="orderItemsWithTotal"
            row-key="id">
            <template #index="text, record">
              <template v-if="isLastRow(record)">
                Итого
              </template>
              <template v-else>
                {{ record.index + 1 }}
              </template>
            </template>
            <template
              v-for="col in ['number', 'gtin', 'quantity']"
              :key="col"
              #[col]="text, record">
              <AInput v-if="record.editable" style="margin: -5px 0" />
              <template v-else>
                {{ text }}
              </template>
            </template>
          </QTable>
        </ACard>
      </ACol>

      <ACol
        :lg="10"
        :xs="24"
        :xxl="8">
        <ACard>
          <h2 class="block-info__title">
            Данные производства
          </h2>
          <div class="block-info__items">
            <div class="block-info__item">
              <h3 class="block-info__item-title">
                Способ формирования индивидуального серийного номера
              </h3>
              <h5 class="block-info__item-subtitle">
                Автоматически
              </h5>
            </div>
            <div class="block-info__item">
              <h3 class="block-info__item-title">
                Способ изготовления
              </h3>
              <h5 class="block-info__item-subtitle">
                {{ order.createMethodType.title }}
              </h5>
            </div>
            <div class="block-info__item">
              <h3 class="block-info__item-title">
                Страна производства
              </h3>
              <h5 class="block-info__item-subtitle">
                {{ order.country.title }}
              </h5>
            </div>
            <div class="block-info__item">
              <h3 class="block-info__item-title">
                Способ выпуска товаров в оборот
              </h3>
              <h5 class="block-info__item-subtitle">
                {{ order.releaseMethodType.title }}
              </h5>
            </div>
            <div class="block-info__item">
              <h3 class="block-info__item-title">
                Организация
              </h3>
              <h5 class="block-info__item-subtitle">
                <RouterLink
                  :to="{
                    name: 'CatalogOrganizationsView',
                    params: { id: order.counterparty.id },
                  }">
                  {{ `“${order.counterparty.title}”` }}
                </RouterLink>
                ({{ order.counterparty.email }} | {{ $format(order.counterparty.phone, "phone") }})
              </h5>
            </div>
            <div class="block-info__item">
              <h3 class="block-info__item-title">
                Контактное лицо
              </h3>
              <h5 class="block-info__item-subtitle">
                {{ order.contactPerson }}
              </h5>
            </div>
            <div class="block-info__item">
              <h3 class="block-info__item-title">
                Ответственный менеджер
              </h3>
              <h5 class="block-info__item-subtitle">
                {{ order.user.name }} ({{ order.user.email }} |
                {{ $format(order.user.phone, "phone") }})
              </h5>
            </div>
            <ATimeline class="mt-7">
              <ATimelineItem v-for="orderLog in order.logs" :key="orderLog.id">
                <div class="fz-12 text-gray-500">
                  {{ $format(orderLog.created_at, "datetime") }}
                </div>
                <div>{{ `“${orderLog.title}”` }}</div>
              </ATimelineItem>
            </ATimeline>
          </div>
        </ACard>
      </ACol>
    </ARow>
  </div>
</template>

<script>
import { ORDER_STATUSES } from '@/config/types';
import { getOrderStatusVariant, numOr0 } from '@/utils/utils';
import { getAxios } from '@/services/http/request';

export default {
  name: 'OrderView',

  data() {
    return {
      ORDER_STATUSES,
      order: null,
      columnsOne: [
        {
          title: '№',
          dataIndex: 'index',
          width: '8%',
        },
        {
          title: 'GTIN',
          dataIndex: 'gtin',
          width: '30%',
        },
        {
          title: 'Количество КМ',
          dataIndex: 'quantity',
          width: '30%',
        },
      ],
      columnsTwo: [
        {
          title: '№',
          dataIndex: 'index',
          width: '8%',
        },
        {
          title: 'GTIN',
          dataIndex: 'gtin',
          width: '30%',
        },
        {
          title: 'Кол-во КМ в заказе',
          dataIndex: 'quantity',
          width: '30%',
        },
        {
          title: 'Сформировано',
          dataIndex: 'usedCodes',
        },
        {
          title: 'Отклонено',
          dataIndex: 'leftCodes',
        },
      ],
      columnsThree: [
        {
          title: '№',
          dataIndex: 'index',
          width: '8%',
        },
        {
          title: 'GTIN',
          dataIndex: 'gtin',
          width: '30%',
        },
        {
          title: 'Количество КМ/Список КМ',
          dataIndex: 'quantity',
          width: '30%',
        },
      ],
    };
  },

  computed: {
    orderItems() {
      return this.order ? this.order.orderItems : [];
    },

    totalRow() {
      return {
        id: 0,
        index: this.orderItems.length,
        gtin: this.orderItems.length,
        quantity: this.getTotal('quantity'),
        usedCodes: this.getTotal('usedCodes'),
        leftCodes: this.getTotal('leftCodes'),
      };
    },

    orderItemsWithTotal() {
      return this.orderItems.concat(this.totalRow);
    },

    countGtin() {
      return this.order ? this.order.orderItems.length : 0;
    },

    showEdit() {
      return this.order.status.id === ORDER_STATUSES.created.id && this.$canUse(['manager']);
    },

    showClose() {
      return this.order.status.id === ORDER_STATUSES.ready.id && this.$canUse(['manager']);
    },

    columns() {
      switch (this.order.status.id) {
        case 0:
        case 1:
        case 3:
          return this.columnsOne;
        case 2:
          return this.columnsTwo;
        case 4:
        case 5:
          return this.columnsThree;
        default:
          return this.columnsOne;
      }
    },
  },

  created() {
    this.readOrder();
  },

  methods: {
    readOrder() {
      return getAxios(`/orders/${this.$route.params.id}`, {}, { globalLoading: true }).then((res) => {
        this.order = res.data;
        this.order.orderItems = this.order.orderItems.map((el, idx) => {
          if (el.hasOwnProperty('usedCodes')) {
            if (el.usedCodes === 0 && el.leftCodes === 0) {
              el.leftCodes = el.quantity;
            }
          }

          return {
            ...el,
            index: idx + 1,
          };
        });
      });
    },

    readOrderStatuses() {
      getAxios(`/orders/${this.$route.params.id}/manual-update`, {}, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'КМ сформирован',
        });
        this.readOrder();
      });
    },

    readOrderClose() {
      getAxios(`/orders/${this.$route.params.id}/close`, {}, { globalLoading: true }).then(() => {
        this.$notification.success({
          message: 'Заказ закрыт',
        });
        this.readOrder();
      });
    },

    getTotal(key) {
      return this.orderItems.reduce((acc, item) => numOr0(item[key]) + acc, 0);
    },

    isLastRow(record) {
      return this.orderItems.length === record.index;
    },

    countFooterValue(value) {
      return this.order ? this.order.orderItems.reduce((acc, item) => item[value] + acc, 0) : 0;
    },
    getOrderStatusVariant,
  },
};
</script>

<style scoped lang="scss">
.block-info {
  &__title {
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 29px;
    color: #323136;
  }
  &__items {
    margin-top: 28px;
  }
  &__item {
    &:not(:last-child) {
      margin-bottom: 21px;
    }
  }
  &__item-title {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #262626;
  }
  &__item-subtitle {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    color: #4f4f4f;
    margin: 0;
    span {
      color: #2d9cdb;
    }
  }
}
.rejected-reason {
  font-family: SFProText;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  color: #333333;
}
.total {
  width: 100%;
  max-width: 80.47px;
}
.total-gtin {
  width: 100%;
  max-width: 301.8px;
}
.total-km {
  width: 100%;
  max-width: 301.8px;
}
.cell {
  font-style: normal;
  font-weight: 900;
  font-size: 14px;
  line-height: 22px;
  color: #262626;
}
</style>
