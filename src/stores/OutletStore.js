// stores/counter.js
import { defineStore } from "pinia";

export const useOutletStore = defineStore("outletStore", {
  state: () => {
    return {
      selectedOutlet: null,
      selectedIds: [],
    };
  },

  actions: {
    setSelectedOutlet(outlet) {
      this.selectedOutlet = outlet;
    },

    clearSelectedIds() {
      this.selectedIds = [];
    },
    setSelectedIds(ids) {
      this.selectedIds = ids;
    },
  },
  persist: true
});
