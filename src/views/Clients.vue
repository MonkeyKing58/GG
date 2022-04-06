<template>
  <div class="home cl-wrapper">
    
    <h1 style="margin: 1rem 0 1rem 0; width:100%">Clients from 24.09.2021</h1>
    <!-- <h3 style="margin: 0 0 1rem 0; width:100%; color: #777;">Clients from 24.09.2021</h3> -->

    <el-row
      v-for="(item, index) in sortArr"
      :key="index"
      class="cl-item"
    >
      <el-col class="cl__name" :span="19">{{item.clName}}</el-col>
      <el-col class="cl__money" :span="5">
        <div @click="copyClientId(item.id)">{{item.clMoney}}</div>
        </el-col>

      <k-progress class="cl__progress-bar" :percent="Math.floor(item.clMoney*100/sortArr[0].clMoney)" :color="getColor(Math.round(item.clMoney*100/sortArr[0].clMoney))" :show-text="false" :border="false"></k-progress>
      
    </el-row>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'Clients',
  metaInfo: {
    title: 'GoodGame58 | Clients'
    },
  data:() => {
    return {
    }
  },
  computed: {    
    ...mapGetters(['clients']),

    sortArr() {
      let arr = this.clients

      arr.sort((a,b) => {
        if (+a.clMoney > +b.clMoney) { return -1; }
        if (+a.clMoney < +b.clMoney) { return 1; }
        return 0;
      })

      return arr
    }
  },
  methods: {
    getColor(percent) {
      if(percent < 40){
        return '#ffc069';
      } else if(percent < 60) {
        return '#fadb14';
      } else if(percent < 80) {
        return '#13c2c2';
      } else {
        return '#389e0d';
      }
    },

    copyClientId(id) {
      navigator.clipboard.writeText(id)

      this.$message({
        duration: 1500,
        message: 'id клиента скопирован',
        type: 'success'
      })
    }
  },
  components: {
  }
}
</script>

<style lang="sass" scoped>

  .cl-wrapper
    background-color: #f5f5f5

  .cl-item
    width: 100%
    display: flex
    flex-wrap: wrap
    margin-top: 0.5rem
    background-color: #fff
    padding: 1rem 1rem 0 1rem
    border-radius: .5rem

  .cl__progress-bar
    width: 100%
    display: flex
    height: 2rem

  .cl__name
    justify-content: flex-start
    text-align: left
    font-weight: bold
    font-size: .8rem

  .cl__money
    justify-content: flex-end
    text-align: right
    color: #555
    font-weight: bold

</style>
