import * as antIcons from '@ant-design/icons-vue';

export function registerIcons(app) {
  Object.keys(antIcons).forEach((key) => {
    app.component(key, antIcons[key]);
  });
}
