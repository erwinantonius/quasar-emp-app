import { defineStore } from 'pinia';

export const useSettingStore = defineStore('setting', {
    state: () => ({
        topOfPage: true,
        darkTheme: false,
        miniState: false,
        appVersion: null,
    }),

    persist: true,

    actions: {
        setTopOfPage(payload) {
            this.topOfPage = payload;
        },
        changeTheme() {
            this.darkTheme = !this.darkTheme;
        },
        setMiniState() {
            this.miniState = !this.miniState;
        },
        setVersion(version) {
            this.appVersion = version;
        },
    },
});
