<template>
  <div v-if="printOrder" class="show-page">
    <APageHeader
      v-if="printOrder"
      title="Просмотр “Форма печати”"
      @back="() => $router.go(-1)">
      <template #tags>
        <StatusTag :variant="getPrintStatusVariant(printOrder.status.id)">
          {{ printOrder.status.title }}
        </StatusTag>
        <StatusTag v-if="printOrder.is_closed" variant="red">
          Закрыт
        </StatusTag>
      </template>
      <template #extra>
        <template v-if="$canUse(['manager'])">
          <!--          <QBtn-->
          <!--            v-if="!isStatusSentToClient && !isStatusRejected"-->
          <!--            danger-->
          <!--            size="large"-->
          <!--            type="primary"-->
          <!--            @click="showCancelConfirm">-->
          <!--            Отменить форму печати-->
          <!--          </QBtn>-->

          <template v-if="isStatusNew">
            <RouterLink
              class="ant-btn ant-btn-lg ant-btn-primary"
              :to="{ name: isReprint ? 'RePrintEdit' : 'PrintEdit', params: { id: $route.params.id } }">
              Редактировать
            </RouterLink>
            <QBtn
              size="large"
              type="success"
              @click="showAcceptConfirm">
              Принять в работу
            </QBtn>
          </template>

          <template v-if="isStatusInWork">
            <QBtn
              size="large"
              type="success"
              @click="showPaymentReceiptModal">
              Прикрепить счет на оплату
            </QBtn>
          </template>

          <template v-if="isStatusSentReceipt">
            <QBtn
              size="large"
              type="success"
              @click="showPaymentOrderModal">
              Прикрепить платёжное поручение
            </QBtn>
          </template>
        </template>

        <template v-if="isStatusPaid || isStatusOnPrinting || isStatusPrinted || isStatusSentToClient">
          <QBtn
            size="large"
            type="primary"
            @click="showPrintFormatModal">
            Открыть КМ в PDF
          </QBtn>
        </template>

        <template v-if="$canUse(['manager'])">
          <template v-if="isStatusPaid">
            <QBtn
              size="large"
              type="success"
              @click="showPrintOrderConfirm">
              Печать
            </QBtn>
          </template>

          <template v-if="isStatusOnPrinting">
            <QBtn
              size="large"
              type="success"
              @click="showPrintCompleteConfirm">
              Распечатано
            </QBtn>
          </template>

          <template v-if="isStatusPrinted">
            <QBtn
              size="large"
              type="success"
              @click="showPrintSentConfirm">
              Отправлено
            </QBtn>
          </template>

          <template v-if="isStatusSentToClient">
            <RouterLink
              v-if="printOrder.is_closed && !isReprint"
              class="ant-btn ant-btn-lg btn--success"
              :to="{ name: 'RePrintAdd', params: { id: printOrderId } }">
              Повторная печать
            </RouterLink>
            <QBtn
              v-if="!printOrder.is_closed"
              size="large"
              type="success"
              @click="showCloseOrderConfirm">
              Закрыть
            </QBtn>
          </template>
        </template>
      </template>
    </APageHeader>

    <ARow :gutter="[24, 20]">
      <ACol
        :xl="18"
        :xs="24"
        :xxl="16">
        <ACard>
          <ARow :gutter="[24, 24]">
            <ACol
              :md="8"
              :sm="12"
              :xs="24">
              <LabelValue label="Наименование">
                {{ printOrder.title }}
              </LabelValue>
            </ACol>

            <ACol
              :md="8"
              :sm="12"
              :xs="24">
              <LabelValue label="Планируемая дата поставки">
                {{ $format(printOrder.date_planned_delivery, 'date') }}
              </LabelValue>
            </ACol>

            <ACol
              :md="8"
              :sm="12"
              :xs="24">
              <LabelValue label="ГРЗ/Область">
                {{ printOrder.region?.name }}
              </LabelValue>
            </ACol>

            <ACol
              :md="8"
              :sm="12"
              :xs="24">
              <LabelValue label="Город">
                {{ $format(printOrder.city?.name, 'empty', 'Не указан') }}
              </LabelValue>
            </ACol>

            <ACol
              :md="8"
              :sm="12"
              :xs="24">
              <LabelValue label="Адрес поставки">
                {{ printOrder.address_to_delivery }}
              </LabelValue>
            </ACol>

            <ACol :xs="24">
              <LabelValue label="Комментарий">
                {{ printOrder.comment }}
              </LabelValue>
            </ACol>
          </ARow>

          <ATable
            class="print-table mt-5"
            :columns="columns"
            :data-source="printOrderTable"
            :pagination="false"
            raw-key="uiIndex">
            <template #bodyCell="{ column, text, record }">
              <template v-if="column.dataIndex === 'index'">
                <template v-if="record.title">
                  #{{ record.id }} | {{ record.title }}
                </template>
                <template v-else>
                  {{ record.uiIndex }}
                </template>
              </template>
              <template v-if="column.dataIndex === 'gtin'">
                <div v-if="record.code" class="break-all">
                  {{ record.code }}
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'toPrint'">
                <div
                  class="ant-input"
                  disabled>
                  {{ text }}
                </div>
              </template>
            </template>

            <template #summary>
              <ATableSummary fixed>
                <ATableSummaryRow class="bg-gray-200 font-weight-bold">
                  <ATableSummaryCell>Итого</ATableSummaryCell>
                  <ATableSummaryCell>
                    {{ getPrintOrdersGtinCount }}
                  </ATableSummaryCell>
                  <ATableSummaryCell>
                    {{ getPrintOrdersTotal('totalCodes') }}
                  </ATableSummaryCell>
                  <ATableSummaryCell>
                    {{ getPrintOrdersTotal('usedCodes') }}
                  </ATableSummaryCell>
                  <ATableSummaryCell>
                    {{ getPrintOrdersTotal('leftCodes') }}
                  </ATableSummaryCell>
                  <ATableSummaryCell>
                    {{ getPrintOrdersTotal('toPrint') }}
                  </ATableSummaryCell>
                </ATableSummaryRow>
              </ATableSummary>
            </template>
          </ATable>
        </ACard>
      </ACol>

      <ACol
        :xl="6"
        :xs="24"
        :xxl="8">
        <ACard v-if="isReprint" class="mb-4">
          <ATypographyTitle :level="5">
            Информация об основной печати
          </ATypographyTitle>

          <RouterLink :to="{ name: 'PrintView', params: { id: printOrder.parent.id } }">
            #{{ printOrder.parent.id }} | {{ printOrder.parent.title }}
          </RouterLink>
        </ACard>

        <ACard v-if="printOrder.reprints && printOrder.reprints.length" class="mb-4">
          <ATypographyTitle :level="5">
            Информация о повторной печати
          </ATypographyTitle>

          <div v-for="reprint in printOrder.reprints" :key="reprint.id">
            <RouterLink :to="{ name: 'PrintView', params: { id: reprint.id } }">
              #{{ reprint.id }} | {{ reprint.title }}
            </RouterLink>
          </div>
        </ACard>

        <ACard
          v-for="file in printOrderFiles"
          :key="file.id"
          class="mb-4">
          <ATypographyTitle :level="5">
            {{ file.type === 1 ? 'Счёт на оплату' : 'Платёжное поручение' }}
          </ATypographyTitle>

          <p>{{ file.comment }}</p>

          <QFileLink :url="file.path">
            {{ file.name }}
          </QFileLink>
        </ACard>

        <ACard>
          <ATypographyTitle class="font-weight-normal" :level="3">
            Дополнительная информация
          </ATypographyTitle>

          <LabelValue class="mb-3" label="Дата формирования">
            {{ $format(printOrder.created_at, 'datetime') }}
          </LabelValue>

          <LabelValue
            v-if="printOrder.counterparty"
            class="mb-3"
            label="Организация">
            <div>
              <RouterLink :to="{ name: 'CatalogOrganizationsView', params: { id: printOrder.counterparty.id } }">
                “{{ printOrder.counterparty.title }}”
              </RouterLink> ({{ printOrder.counterparty.email }} | {{ $format(printOrder.counterparty.phone, 'phone') }})
            </div>
            <PrintTryToDownload
              v-if="isStatusInWork"
              :check="downloadPrintOrderRequisites"
              :download-url="requisitesUrl">
              Скачать реквизиты
            </PrintTryToDownload>
          </LabelValue>

          <LabelValue
            v-if="printOrder.manager"
            class="mb-3"
            label="Ответственный менеджер">
            {{ printOrder.manager.name }} ({{ printOrder.manager.email }} | {{ $format(printOrder.manager.phone, 'phone') }})
          </LabelValue>

          <!--$canUse(['admin']) && !isStatusRejected && !printOrder.is_closed-->
          <QBtn
            v-if="$canUse(['admin']) && !printOrder.is_closed"
            type="primary"
            @click="showManagerModal">
            Изменить ответственного менеджера
          </QBtn>

          <ATimeline class="mt-7">
            <ATimelineItem v-for="orderLog in printOrder.logs" :key="orderLog.id">
              <div class="fz-12 text-gray-500">
                {{ $format(orderLog.created_at, 'datetime') }}
              </div>
              <div>{{ orderLog.title }}</div>
            </ATimelineItem>
          </ATimeline>
        </ACard>
      </ACol>
    </ARow>

    <PrintManagerModal v-model:visible="managerModalVisible" @submit="attachManager" />
    <PrintPaymentReceiptModal
      v-model:visible="paymentReceiptModalVisible"
      :payment-data="printOrderPaymentData"
      @submit="sendPaymentReceipt" />
    <PrintPaymentOrderModal
      v-model:visible="paymentOrderModalVisible"
      :payment-data="printOrderPaymentData"
      @submit="sendPaymentOrder" />
    <PrintFormatsModal
      v-model:visible="printFormatsModalVisible" />
    <ABackTop />
  </div>
</template>

<script>
import { getPrintStatusVariant, numOr0 } from '@/utils/utils';
import { getAxios, postAxios } from '@/services/http/request';
import { normalizePrintOrders } from '@/pages/suz/print/print-utils';
import { PRINT_STATUSES } from '@/config/types';
import PrintPaymentOrderModal from '@/pages/suz/print/components/PrintPaymentOrderModal.vue';
import PrintPaymentReceiptModal from '@/pages/suz/print/components/PrintPaymentReceiptModal.vue';
import PrintManagerModal from '@/pages/suz/print/components/PrintManagerModal.vue';
import PrintFormatsModal from '@/pages/suz/print/components/PrintFormatsModal.vue';
import PrintTryToDownload from '@/pages/suz/print/components/PrintTryToDownload.vue';

const customRender = ({ record }) => {
  if (!record.title && !record.code) return;

  return { props: { colSpan: 0, rowSpan: 0 } };
};

const shortTableStatuses = [
  PRINT_STATUSES.new.id,
  PRINT_STATUSES.confirm_to_work.id,
  PRINT_STATUSES.sent_receipt_to_pay.id,
  PRINT_STATUSES.paid.id,
];

export default {
  name: 'PrintOrderView',
  components: { PrintTryToDownload, PrintFormatsModal, PrintManagerModal, PrintPaymentReceiptModal, PrintPaymentOrderModal },
  data() {
    return {
      paymentOrderModalVisible: false,
      paymentReceiptModalVisible: false,
      printFormatsModalVisible: false,
      printCompleteModalVisible: false,
      managerModalVisible: false,

      requisitesUrl: null,
      printOrder: null,
      orders: [],

      columns: [
        {
          title: '№',
          dataIndex: 'index',
          customRender: ({ record }) => {
            if (!record.title) return;

            return { props: { colSpan: 6, class: 'bg-gray-100' } };
          },
        },
        {
          title: 'GTIN',
          dataIndex: 'gtin',
          customRender: ({ record }) => {
            if (this.isTableShort) return customRender({ record });

            if (record.gtin) return;

            if (!record.code) {
              return { props: { colSpan: 0, rowSpan: 0 } };
            }

            return { props: { colSpan: 5 } };
          },
        },
        {
          title: 'Общее кол-во КМ',
          dataIndex: 'totalCodes',
          customRender,
        },
        {
          title: 'Использовано',
          dataIndex: 'usedCodes',
          customRender,
        },
        {
          title: 'Осталось',
          dataIndex: 'leftCodes',
          customRender,
        },
        {
          title: 'На печать из остатков',
          dataIndex: 'toPrint',
          customRender,
        },
      ],
    };
  },
  computed: {
    isStatusNew() {
      return this.printOrder.status.id === PRINT_STATUSES.new.id;
    },
    isStatusInWork() {
      return this.printOrder.status.id === PRINT_STATUSES.confirm_to_work.id;
    },
    isStatusSentReceipt() {
      return this.printOrder.status.id === PRINT_STATUSES.sent_receipt_to_pay.id;
    },
    isStatusPaid() {
      return this.printOrder.status.id === PRINT_STATUSES.paid.id;
    },
    // isStatusRejected() {
    //   return this.printOrder.status.id === PRINT_STATUSES.rejected.id;
    // },
    isStatusOnPrinting() {
      return this.printOrder.status.id === PRINT_STATUSES.on_printing.id;
    },
    isStatusPrinted() {
      return this.printOrder.status.id === PRINT_STATUSES.printed.id;
    },
    isStatusSentToClient() {
      return this.printOrder.status.id === PRINT_STATUSES.sent_to_the_client.id;
    },

    printOrderPaymentData() {
      return {
        orderId: this.printOrder.id,
        counterparty: this.printOrder.counterparty?.title,
        orderDate: this.$format(this.printOrder.created_at, 'datetime'),
      };
    },

    isTableShort() {
      return shortTableStatuses.includes(this.printOrder.status.id);
    },

    isReprint() {
      return !!this.printOrder?.parent;
    },
    printOrderTable() {
      return this.isTableShort ?
        this.getPrintOrderData(true) :
        this.getPrintOrderData(false);
    },

    getPrintOrdersGtinCount() {
      return this.printOrderTable.reduce((acc, item) => !!item.gtin ? ++acc : acc, 0);
    },

    printOrderFiles() {
      return this.printOrder.files.filter(file => [1, 2].includes(file.type));
    },

    printOrderId() {
      return this.$route.params.id;
    },
  },
  methods: {
    getPrintStatusVariant,
    // showCancelConfirm() {
    //   this.$confirm({
    //     title: 'Вы действительно хотите отменить печать КМ?',
    //     okText: 'Да',
    //     cancelText: 'Нет',
    //     onOk: () => {
    //       this.setOrderStatusReject();
    //     },
    //   });
    // },
    showAcceptConfirm() {
      this.$confirm({
        title: 'Вы действительно хотите принять в работу?',
        okText: 'Да',
        cancelText: 'Нет',
        content: 'После принятия в работу не будет возможности редактировать данные.',
        onOk: () => {
          this.setOrderStatusDoWork();
        },
      });
    },
    showPrintOrderConfirm() {
      this.$confirm({
        title: 'Вы действительно хотите отправить на печать?',
        okText: 'Да',
        cancelText: 'Нет',
        onOk: () => {
          this.setOrderStatusOnPrinting();
        },
      });
    },
    showPrintCompleteConfirm() {
      this.$confirm({
        title: 'КМ распечатаны и проверены?',
        okText: 'Да',
        cancelText: 'Нет',
        onOk: () => {
          this.setOrderStatusPrinted();
        },
      });
    },
    showPrintSentConfirm() {
      this.$confirm({
        title: 'Распечатанные КМ отправлены Клиенту?',
        okText: 'Да',
        cancelText: 'Нет',
        onOk: () => {
          this.sendPrintOrder();
        },
      });
    },
    showCloseOrderConfirm() {
      this.$confirm({
        title: 'Вы действительно хотите закрыть?',
        okText: 'Да',
        cancelText: 'Нет',
        onOk: () => {
          this.setOrderStatusClose();
        },
      });
    },
    showPaymentOrderModal() {
      this.paymentOrderModalVisible = true;
    },
    showPaymentReceiptModal() {
      this.paymentReceiptModalVisible = true;
    },
    showPrintFormatModal() {
      this.printFormatsModalVisible = true;
    },
    showManagerModal() {
      this.managerModalVisible = true;
    },

    getPrintOrdersTotal(key) {
      return this.printOrderTable.reduce((acc, item) => numOr0(item[key]) + acc, 0);
    },

    getPrintOrderData(short = true) {
      // трансформируем нормализованный массив orders в один массив для отображения в таблцие
      return this.orders.reduce((acc, order, orderIdx) => {
        acc.push({ id: order.id, title: order.title, uiIndex: `${orderIdx + 1}` });

        if (order.items) {
          order.items.forEach((orderItem, index) => {
            const itemIdx = index + 1;
            const { barcodes, ...orderItemFields } = orderItem;
            acc.push({ ...orderItemFields, uiIndex: itemIdx });

            if (short) return;

            const tmpBarcodes = barcodes.map((barcode, barcodeIdx) => {
              return {
                id: barcode.id,
                code: barcode.code,
                uiIndex: `${itemIdx}.${barcodeIdx + 1}`,
              };
            });
            acc.push(...tmpBarcodes);
          });
        }

        return acc;
      }, []);
    },

    readPrintOrder() {
      if (!this.printOrderId) return;
      getAxios(`print-groups/${this.printOrderId}`, {}, { globalLoading: true }).then((res) => {
        this.printOrder = res.data;
        this.orders = normalizePrintOrders(res.data.print_orders);
      });
    },

    setOrderStatusDoWork() {
      // Принять в работу
      getAxios(`print-groups/${this.printOrderId}/do-work`, {}, { globalLoading: true }).then((res) => {
        this.$notification.success({ message: 'Принято в работу' });
        this.readPrintOrder();
      });
    },

    setOrderStatusOnPrinting() {
      // Изменить статус на "Печать"
      getAxios(`print-groups/${this.printOrderId}/on-printing`, {}, { globalLoading: true }).then((res) => {
        this.$notification.success({ message: 'Статус изменён на "Печать"' });
        this.readPrintOrder();
      });
    },

    setOrderStatusPrinted() {
      // Изменить статус на "Распечатано"
      getAxios(`print-groups/${this.printOrderId}/printed`, {}, { globalLoading: true }).then((res) => {
        this.$notification.success({ message: 'Статус изменён на "Распечатано"' });
        this.readPrintOrder();
      });
    },

    downloadPrintOrderRequisites() {
      // Сгенерировать реквизиты, ссылка будет доступна по этому же ендпоинту в течение 30 секунд
      return getAxios(`print-groups/${this.printOrderId}/counterparty-requisites-word`, {}, { globalLoading: true }).then((res) => {
        this.requisitesUrl = res.data.url;
      });
    },

    sendPaymentReceipt(values) {
      // Отправить счет на оплату клиенту по заказу на печать
      postAxios(`print-groups/${this.printOrderId}/send-payment-receipt`, values, { formDataConvert: true, globalLoading: true }).then((res) => {
        this.$notification.success({ message: 'Счёт на оплату отправлен' });
        this.paymentReceiptModalVisible = false;
        this.readPrintOrder();
      });
    },

    sendPaymentOrder(values) {
      // Отправить платежное поручение менеджеру
      postAxios(`print-groups/${this.printOrderId}/send-payment-order`, values, { formDataConvert: true, globalLoading: true }).then((res) => {
        this.$notification.success({ message: 'Платёжное поручение отправлено' });
        this.paymentOrderModalVisible = false;
        this.readPrintOrder();
      });
    },

    setOrderStatusClose() {
      // Закрыть Печать КМ
      getAxios(`print-groups/${this.printOrderId}/close`, {}, { globalLoading: true }).then((res) => {
        this.$notification.success({ message: 'Статус изменён на "Закрыт"' });
        this.readPrintOrder();
      });
    },

    // setOrderStatusReject() {
    //   // Отменить Печать КМ
    //   getAxios(`print-groups/${this.printOrderId}/reject`).then((res) => {
    //     this.$notification.success({ message: 'Печать КМ отменена' });
    //     this.readPrintOrder();
    //   });
    // },

    sendPrintOrder() {
      // Отправить клиенту печать КМ
      getAxios(`print-groups/${this.printOrderId}/send`, {}, { globalLoading: true }).then((res) => {
        this.$notification.success({ message: 'Статус изменён на "Отправлено клиенту' });
        this.readPrintOrder();
      });
    },

    attachManager(values) {
      // Изменить ответственного менеджера
      postAxios(`print-groups/${this.printOrderId}/change-manager`, values, { globalLoading: true }).then((res) => {
        this.$notification.success({ message: 'Ответственный менеджер изменён' });
        this.managerModalVisible = false;
        this.readPrintOrder();
      });
    },
  },
  created() {
    this.$watch('$route.params', () => {
      this.readPrintOrder();
    }, { immediate: true });
  },
};
</script>
