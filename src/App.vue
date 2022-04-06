<template>
  <div id="app">

    <Loader v-if="loading" />

    <router-view v-else />

    <Lowerbar v-if="!loading" />

  </div>
</template>

<script>
import Lowerbar from '@/components/LowerBar'
// import getUpdates from '@/utils/getUpdates'

export default {
  name: 'home',
  data:() => {
    return {
      loading: true
    }
  },
  async mounted() {    
    
    if(!Object.keys(this.$store.getters.fleet).length) {
      await this.$store.dispatch('fetchFleet')
    }
  
    if(!Object.keys(this.$store.getters.clients).length) {
      await this.$store.dispatch('fetchClients')
    }
  
    if(!Object.keys(this.$store.getters.money).length) {
      await this.$store.dispatch('fetchMoney')
    }
  
    if(!Object.keys(this.$store.getters.allgames).length) {
      await this.$store.dispatch('fetchAllgames')
    }
    //   const chatData = await getUpdates()

    //   const oldDate = Math.floor(new Date(this.$store.getters.money.date.money).getTime() / 1000)

    //   if(oldDate < chatData.chatDate) {
    //     await this.$store.dispatch('editMoney', {id: 'kostya', money: chatData.chatKostya})
    //     await this.$store.dispatch('editMoney', {id: 'misha', money: chatData.chatMisha})
    //   }
    // }

    this.loading = false
  },
  components: {
    Lowerbar
  }
}
</script>

<style scoped lang="scss">

#app {
  width:100%;
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

</style>