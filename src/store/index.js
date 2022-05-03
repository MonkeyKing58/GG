import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/compat/app'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fleet: {},
    clients: {},
    money: {},
    allgames: {},
    error: null
  },
  mutations: {
    setFleet(state, fleet) {
      state.fleet = fleet
    },

    setAllgames(state, allgames) {
      state.allgames = allgames
    },

    setMoney(state, money) {
      state.money = money
    },

    addNewClient(state, clName, clMoney, key) {
      state.clients.push({id: key, clName, clMoney})
    },

    addNewGame(state, gameName, key) {
      state.allgames.push({id: key, gameName})
    },

    removeGame(state, id) {
      state.allgames.splice(state.allgames.findIndex(i => i.id == id),1)
    },
  
    editClient(state, id, clMoney) {
      state.clients.find(i => i.id === id).clMoney = clMoney
    },

    setClients(state, clients) {
      state.clients = clients
    },

    setError(state, error) {
      state.error = error
    },

    editFleet(state, {id, client, date, deposit, duty, free, dayOfRent}) {
      state.fleet.find(i => i.id === id).client = client
      state.fleet.find(i => i.id === id).date = date
      state.fleet.find(i => i.id === id).deposit = deposit
      state.fleet.find(i => i.id === id).duty = duty
      state.fleet.find(i => i.id === id).free = free
      state.fleet.find(i => i.id === id).dayOfRent = dayOfRent
      state.fleet.find(i => i.id === id).remaning = new Date(date) - new Date(Date.now()) || -99999999999999
    },

    editHidden(state, {id, hidden}) {
      state.fleet.find(i => i.id === id).hidden = hidden
    },

    editMoney(state, {id, money}) {
      state.money[id].money = money
    }
  },
  actions: {
    async fetchFleet({dispatch, commit}) {
      try {
        const fleetTemp = (await firebase.database().ref(`/fleet/`).once('value')).val() || {}

        const fleet = Object.keys(fleetTemp).map(key => ({
          ...fleetTemp[key],
          remaning: new Date(fleetTemp[key].date) - new Date(Date.now()) || -99999999999999,
          id: key
        }))

        commit('setFleet', fleet)
        dispatch('sortFleet')

      } catch(e) {
        commit('setError', e)
        throw e
      }
    },

    async fetchMoney({commit}) {
      try {

        const money = (await firebase.database().ref(`/money/`).once('value')).val() || {}
        
        commit('setMoney', money)
      } catch(e) {
        commit('setError', e)
        throw e
      }
    },

    async fetchClients({commit}) {
      try {
        const clientsTemp = (await firebase.database().ref(`/clients/`).once('value')).val() || {}
        
        const clients = Object.keys(clientsTemp).map(key => ({...clientsTemp[key], id: key}))

        commit('setClients', clients)
      } catch(e) {
        commit('setError', e)
        throw e
      }
    },

    async fetchAllgames({commit, dispatch}) {
      try {
        const allgamesTemp = (await firebase.database().ref(`/allgames/`).once('value')).val() || {}
        
        const allgames = Object.keys(allgamesTemp).map(key => ({...allgamesTemp[key], id: key}))

        commit('setAllgames', allgames)
        dispatch('sortAllGames')
      } catch(e) {
        commit('setError', e)
        throw e
      }
    },
    
    sortFleet({getters, commit}) {
      const fleet = getters.fleet

      fleet.sort((a,b) => {
        if (a.remaning > b.remaning) { return 1; }
        if (a.remaning < b.remaning) { return -1; }
        return 0;
      });

      commit('setFleet', fleet)
    },
    
    sortAllGames({getters, commit}) {
      const allGames = getters.allgames

      allGames.sort((a,b) => {
        if (a.gameName > b.gameName) { return 1; }
        if (a.gameName < b.gameName) { return -1; }
        return 0;
      });

      commit('setAllgames', allGames)
    },
    
    async editConsoleInfo({commit, dispatch}, {id, client, date, deposit, duty, free, dayOfRent}) {
      try {
        await firebase.database().ref(`/fleet`).child(id).update({client, date, deposit, duty, free, dayOfRent})

        commit('editFleet', {id, client, date, deposit, duty, free, dayOfRent})

        dispatch('sortFleet')
      } catch(e) {
        commit('setError', e)
        throw e
      }
    },
    
    async editConsoleHidden({commit}, {id, hidden}) {
      try {
        await firebase.database().ref(`/fleet`).child(id).update({hidden})

        commit('editHidden', {id, hidden})
      } catch(e) {
        commit('setError', e)
        throw e
      }
    },

    async editConsoleInfoGames({commit}, {id, games}) {
      try {
        await firebase.database().ref(`/fleet`).child(id).update({games})

      } catch(e) {
        commit('setError', e)
        throw e
      }
    },
    
    async editMoney({commit}, {id, money}) {
      try {
        await firebase.database().ref(`/money`).child(id).update({money})
        
        commit('editMoney', {id, money})
      } catch(e) {
        commit('setError', e)
        throw e
      }
    },

    async addNewClient({commit}, { clName, clMoney }) {
      try {
        const newClient =  await firebase.database().ref(`clients`).push({clMoney, clName})
        
        commit('addNewClient', clName, clMoney, newClient.key)
      } catch(e) {
        commit('setError', e)
        throw e
      }
    },

    async addNewGame({commit}, { gameName }) {
      try {
        const newGame =  await firebase.database().ref(`allgames`).push({gameName})
        
        commit('addNewGame', gameName, newGame.key)
      } catch(e) {
        commit('setError', e)
        throw e
      }
    },
    async removeGame({commit}, { id }) {
      try {
        await firebase.database().ref(`allgames/${id}`).remove()
        
        commit('removeGame', id)
      } catch(e) {
        commit('setError', e)
        throw e
      }
    },

    async editClientData({commit}, { id, clMoney }) {
      try {
        await firebase.database().ref(`clients`).child(id).update({clMoney})
        commit('editClient', id, clMoney)
      } catch(e) {
        commit('setError', e)
        throw e
      }
    },
  },
  getters: {
    fleet: s => s.fleet,

    clients: s => s.clients,

    money: s => s.money,

    fleetById: s => id => s.fleet.find(item => item.id === id),

    allgames: s => s.allgames
  }
})
