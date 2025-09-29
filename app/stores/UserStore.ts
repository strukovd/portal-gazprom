import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
	state: () => ({
		token: import.meta.browser ? localStorage.getItem('token') : null as string | null,
		userData: null as any,
	}),
	actions: {
		setData(data: any) {
			if(!data || !data.token) {
				console.error('Token не получен!');
			}
			this.userData = data;
			this.token = data.token;
			localStorage.setItem('token', data.token);
		}
	}
});

// if(import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
// }
