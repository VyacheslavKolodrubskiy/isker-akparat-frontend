import AddLink from '@/components/buttons/AddLink.vue';
import ResetButton from '@/components/buttons/ResetButton.vue';
import QLink from '@/components/qlib/QLink.vue';
import LabelValue from '@/components/data-display/LabelValue.vue';

// New
import QBtn from '@/components/qlib/QBtn.vue';
import QIcon from '@/components/qlib/QIcon.vue';
import QTable from '@/components/qlib/QTable.vue';
import QDatePicker from '@/components/qlib/QDatePicker.vue';
import QUpload from '@/components/qlib/QUpload.vue';
import QFileLink from '@/components/qlib/QFileLink.vue';
// import QInput from '@/components/qlib/QInput.vue';
import TableActions from '@/components/tables/TableActions.vue';
import CancelButton from '@/components/buttons/CancelButton.vue';
import SubmitButton from '@/components/buttons/SubmitButton.vue';
import StatusTag from '@/components/data-display/StatusTag.vue';

// Selects
import SelectBranch from '@/components/form/SelectBranch.vue';
import SelectCounterparty from '@/components/form/SelectCounterparty.vue';
import SelectApplicationCategory from '@/components/form/SelectApplicationCategory.vue';
import SelectManager from '@/components/form/SelectManager.vue';
import SelectApplicationStatus from '@/components/form/SelectApplicationStatus.vue';
import SelectCreatedMethod from '@/components/form/SelectCreatedMethod.vue';
import SelectCountry from '@/components/form/SelectCountry.vue';
import SelectNpcCountry from '@/components/form/npc/SelectNpcCountry.vue';
import SelectReleaseMethod from '@/components/form/SelectReleaseMethod.vue';
import SelectMarkingStatus from '@/components/form/SelectMarkingStatus.vue';
import SelectGroupsStatus from '@/components/form/SelectGroupsStatus.vue';
import SelectRegion from '@/components/form/SelectRegion.vue';
import SelectCity from '@/components/form/SelectCity.vue';
import SelectOrder from '@/components/form/SelectOrder.vue';

export function registerGlobalComponents(app) {
  // app.component('QInput', QInput);

  // New
  app.component('QBtn', QBtn);
  app.component('QIcon', QIcon);
  app.component('QTable', QTable);
  app.component('QDatePicker', QDatePicker);
  app.component('QUpload', QUpload);
  app.component('QFileLink', QFileLink);
  app.component('QLink', QLink); // todo ??? refactor

  // Stable
  app.component('TableActions', TableActions);
  app.component('CancelButton', CancelButton);
  app.component('SubmitButton', SubmitButton);
  app.component('StatusTag', StatusTag);
  app.component('AddLink', AddLink);
  app.component('ResetButton', ResetButton);
  app.component('LabelValue', LabelValue);

  // Selects
  app.component('SelectCounterparty', SelectCounterparty);
  app.component('SelectBranch', SelectBranch);
  app.component('SelectApplicationCategory', SelectApplicationCategory);
  app.component('SelectManager', SelectManager);
  app.component('SelectApplicationStatus', SelectApplicationStatus);
  app.component('SelectCreatedMethod', SelectCreatedMethod);
  app.component('SelectCountry', SelectCountry);
  app.component('SelectNpcCountry', SelectNpcCountry);
  app.component('SelectReleaseMethod', SelectReleaseMethod);
  app.component('SelectMarkingStatus', SelectMarkingStatus);
  app.component('SelectGroupsStatus', SelectGroupsStatus);
  app.component('SelectRegion', SelectRegion);
  app.component('SelectCity', SelectCity);
  app.component('SelectOrder', SelectOrder);
}
