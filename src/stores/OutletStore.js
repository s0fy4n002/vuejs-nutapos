import { defineStore } from "pinia";

export const useOutletStore = defineStore("outletStore", {
  state: () => {
    return {
      selectedOutlet: null,
      selectedDiscounts: [],
    };
  },

  actions: {
    setSelectedOutlet(outlet) {
      this.selectedOutlet = outlet;
    },

    clearSelectedDiscounts() {
      this.selectedDiscounts = [];
    },
    setSelectedDiscounts(discounts) {
      this.selectedDiscounts = discounts;
    },
  },
  persist: true
});
