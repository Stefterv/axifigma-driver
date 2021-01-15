<template>
  <div>
    <select v-model="device">
      <option
        v-for="device in state.devices"
        :key="device.unique"
        :value="device"
      >
        <template v-if="device.origin">{{ device.origin }}:</template>
        {{ device.name }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject, Watch } from "nuxt-property-decorator";
import { Device } from "../api/Device";
import { AxiState } from "../api/State";
@Component
export default class DeviceSelect extends Vue {
  @Inject("axistate") state!: AxiState;

  selected?: Device;

  get device() {
    return this.selected || this.state.devices[0];
  }
  set device(device) {
    this.selected = device;
  }
  @Watch("state.devices")
  deviceUpdate(devices) {
    let selected = devices.find(
      (device) => device.unique === this.selected?.unique
    );
    if (selected) return;
    this.selected = devices[0];
  }
}
</script>
