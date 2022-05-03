<template>
  <div class="home">

    <div class="console-hider">
      <i class="el-icon-caret-top"></i>Активные консоли ({{visibleFleet.length}})
    </div>
    
    <div     
      v-for="item in visibleFleet"
      :key="item.name"
      class="list-item" el.row>

        <div :name="item.id" class="button-effect"></div>

        <el-col
          :span="5"
          :class="item.img"
          class="list-item__img"
        ></el-col>

        <el-col :span="12" class="list-item__info">
          <div class="list-item__info-wrapper" @click="goToConsolePanel(item.id)">
            <div>{{item.name}}</div>
            <div v-if="!(item.free === 'true')">{{remaningTime(item.remaning)}}</div>
          </div>
        </el-col>

        <el-col
          :span="3"
          class="list-item__rent-status"
          :class="{ free:item.free === 'true'}"
        ></el-col>

        <el-col :span="3" :offset="1" class="list-item__copy">
          <el-button type="default" icon="el-icon-copy-document" @click="copyGameList(item.id)" circle></el-button>
        </el-col>

    </div>

    <div class="console-hider" @click="showHidden()">
      <i v-if="hiddenConsoles" class="el-icon-caret-bottom"></i>
      <i v-else class="el-icon-caret-top"></i>
      Скрытые консоли ({{hiddenFleet.length}})
    </div>

    <div class="hidden-list-contaner" :style="styleHiddenConsoles" data-hider>
      <div     
        v-for="item in hiddenFleet"
        :key="item.name"
        class="list-item" el.row>

          <div :name="item.id" class="button-effect"></div>

          <el-col
            :span="5"
            :class="item.img"
            class="list-item__img"
          ></el-col>

          <el-col :span="12" class="list-item__info">
            <div class="list-item__info-wrapper" @click="goToConsolePanel(item.id)">
              <div>{{item.name}}</div>
              <div v-if="!(item.free === 'true')">{{remaningTime(item.remaning)}}</div>
            </div>
          </el-col>

          <el-col
            :span="3"
            class="list-item__rent-status"
            :class="{ free:item.free === 'true'}"
          ></el-col>

          <el-col :span="3" :offset="1" class="list-item__copy">
            <el-button type="default" icon="el-icon-copy-document" @click="copyGameList(item.id)" circle></el-button>
          </el-col>

      </div>
    </div>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'Home',
  metaInfo: {
    title: 'GoodGame58 | Manager'
    },
  data:() => {
    return {
      hiddenConsoles: true
    }
  },
  computed: {    
    ...mapGetters(['fleetById', 'fleet']),

    visibleFleet() {
      return this.fleet.filter(i => !i.hidden)
    },

    hiddenFleet() {
      return this.fleet.filter(i => i.hidden)
    },

    styleHiddenConsoles() {
      if(this.hiddenConsoles)
        return { maxHeight: '0' }
      
      const itemsCount = this.hiddenFleet.length
      return {
        maxHeight: `calc(${itemsCount*20}vw + ${itemsCount*.5}rem)`
      }
    }
  },
  methods: {
    showHidden() {
      this.hiddenConsoles = !this.hiddenConsoles
      
      if(!this.hiddenConsoles) {
        const timer = setInterval(() => {
            document.querySelector('.home').scrollTo(0, 10000)
          }, 1)
        setTimeout(() => { clearInterval(timer) }, 500) 
      }
    },

    remaningTime(time) {

      const prefix = time > 0 ? 'Осталось: ' : 'Просрочено: '
      if(time < 0) time *= -1

      const minutes = Math.floor(time / (1000 * 60)) % 60
      const hours = Math.floor(time / (1000 * 60 * 60)) % 24
      const days = Math.floor(time / (1000 * 60 * 60 * 24))
      
      return prefix + days + ' дн. ' + hours + ' ч. ' + minutes + ' мин.'
    },

    copyGameList(consoleId) {
      
      const consoleInfo  = this.fleetById(consoleId)

      let gameList = 'Приставка: '+consoleInfo.name + '\n'

          gameList += '-------------------------\n'

        
        if(consoleInfo.games) {
          consoleInfo.games.map((i,index) => {
            let strNum = '' + (index+1)       
            gameList += strNum.padStart(2,0) + '. ' + i + '\n'
          })

          
          gameList += '-------------------------\n2⃣ - можно играть вдвоем'
        } else {
          gameList += 'Список игр пуст.'
        }
          
        navigator.clipboard.writeText(gameList)

        this.$message({
          duration: 1500,
          message: `[ ${consoleInfo.name} ] - Игры скопированы`,
          type: 'success'
        })
    },

    goToConsolePanel(id) {
      const item = document.querySelector('[name='+id+']') 
      item.classList.add('button-effect-active')
      
      setTimeout(() => { this.$router.push('/console/' + id) }, 250);
    }
  },
  components: {
  }
}
</script>

<style lang="sass" scoped>

.hidden-list-contaner
  display: flex
  flex-wrap: wrap
  overflow: hidden
  transition-duration: .5s

.hidden-list-contaner-active
  max-height: 400vw

.console-hider
  display: flex
  color: #aaa
  width: 100%
  margin: .25rem 0 .5rem 0
  font-size: .7rem
  font-weight: bold

  i
    margin-right: 0.5rem

.list-item__info-wrapper
  display: flex
  height: 100%
  flex-wrap: wrap
  align-content: center

.free
  background-image: url(../assets/images/free.png)!important

.ones
  background-image: url(../assets/images/ones.png)

.pro
  background-image: url(../assets/images/pro.png)

.slim
  background-image: url(../assets/images/slim.png)

.fat
  background-image: url(../assets/images/fat.png)

.ds4
  background-image: url(../assets/images/ds4.png)

.gp
  background-image: url(../assets/images/gp.png)

.ps5
  background-image: url(../assets/images/ps5.png)

.ps5_2
  background-image: url(../assets/images/ps5_2.png)



</style>
