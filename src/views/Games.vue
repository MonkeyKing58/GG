<template>
  <div class="console">

    <Loader v-if="loading"/>

    <el-form
      v-else
      :model="consoleInfo"
      :rules="rules"
      ref="consoleInfo"
    >
      <!-- -----Name----- -->
      <el-form-item> <h1>{{consoleInfo.name}}</h1> </el-form-item>
      
      <el-form-item>
        <el-button-group style="width: 100%;">
          <el-button
            :disabled="!changes"
            type="primary"
            @click="refreshInfo"
            style="border-radius: 1rem 0 0 1rem; width: 50%" 
            icon="el-icon-folder-checked"
          >Сохранить</el-button>

          <el-button
            type="default"
            @click="copyGames"
            style="border-radius: 0 1rem 1rem 0; width: 50%" 
            icon="el-icon-copy-document"
          >Копировать</el-button>
        </el-button-group>
      </el-form-item>

      <el-form-item>
        <div class="games">
          <el-row
            v-for="(item, index) in gameArr"
            :key="index"
            class="games__current-item"
          >
            <el-col :span="3" class="games__current-item__index">{{index+1}}</el-col>
            <el-col :span="18" class="games__current-item__name">
              {{item}}</el-col>
            <el-col :span="3">
              <el-button type="danger" icon="el-icon-minus" @click="deleteItemCurrent(index)" circle></el-button>
            </el-col>
          </el-row>
        </div>
      </el-form-item>

      <el-form-item style="border-radius: 1rem!important;">
        <el-input placeholder="Add new game" style="border-radius: 1rem!important;" v-model="newGame">
          <el-button slot="append" type="primary" icon="el-icon-plus" @click="addNewGame()"></el-button>
        </el-input>
      </el-form-item>
  
      <el-form-item>
        <div class="games">
          <el-row
            v-for="(item, index) in allGamesArr"
            :key="index"
            class="games__current-item"
          >
            <el-col :span="3" class="games__current-item__index">              
              <el-button type="default" icon="el-icon-delete" @click="deleteItemAllGames(index)" circle></el-button>
            </el-col>
            <el-col :span="18" class="games__current-item__name">
              {{item.gameName}}</el-col>
            <el-col :span="3">
              <el-button type="success" class="circle-button" icon="el-icon-plus" @click="addToConsoleGames(index)" circle></el-button>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
  
      

    </el-form>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Console',
  metaInfo: {
    title: 'GoodGame58 | Games'
    },
  data:() => {
    return {
      consoleInfo: null,
      rules: null,
      loading: true,
      newGame: null,
      changes: false
    }
  },

  computed: {    
    ...mapGetters(['fleetById', 'allgames']),

    gameArr() {

      let arr = this.consoleInfo.games

      if (arr) 
        arr.sort()

      return arr
    },

    allGamesArr() {

      let arr = this.allgames
      let separateArr = []

      arr.sort()

      if (this.gameArr)
        arr.map(i => {
          let index = this.gameArr.findIndex(x => x === i.gameName)
          
          if(index < 0)
            separateArr.push(i)
        })
      
      else
        separateArr = arr

      return separateArr
    }
  },

  mounted() {
    const {id} = this.$route.params
    this.consoleInfo = this.fleetById(id)

    if(!this.consoleInfo.games)
      this.consoleInfo.games = []

    this.loading = false
  },

  methods: {
    async refreshInfo() {

      const data = {
        games :this.gameArr,
        id: this.consoleInfo.id
      }

      try {
        await this.$store.dispatch('editConsoleInfoGames', data)

        this.$message({
          message: 'Список обновлен',
          type: 'success'
        })

      } catch(e) {
        console.log(e)
      }
      
      this.changes = false
    },

    deleteItemCurrent(index) {
      this.gameArr.splice(index, 1)
      this.changes = true
    },

    async deleteItemAllGames(index) {
      try {
        await this.$store.dispatch('removeGame', { id: this.allGamesArr[index].id })

        this.$message({
          message: 'Игра удалена',
          type: 'success'
        })

      } catch(e) {
        console.log(e)
      }
    },

    async addNewGame() {
      
      if(this.newGame) 
      try {
        await this.$store.dispatch('addNewGame', { gameName: this.newGame })

        this.$message({
          message: 'Новая игра добавлена',
          type: 'success'
        })

      } catch(e) {
        console.log(e)
      }

      this.newGame = ''
    },

    addToConsoleGames(index) {
      this.consoleInfo.games.push(this.allGamesArr[index].gameName)
      this.changes = true
    },

    copyGames() {
      
      let gameList = 'Приставка: '+this.consoleInfo.name + '\n'

         gameList += '-------------------------\n'

      this.gameArr.map((i,index) => {
        let strNum = '' + (index+1)       
        gameList += strNum.padStart(2,0) + '. ' + i + '\n'
      })

      
         gameList += '-------------------------\n2⃣ - можно играть вдвоем'

      navigator.clipboard.writeText(gameList)
      
      this.$message({
        duration: 1500,
        message: 'Игры скопированы',
        type: 'success'
      })
    }
  }
}
</script>

<style lang="sass" scoped>

.console
  display: flex
  flex-wrap: wrap
  padding: 1rem
  flex-grow: 1
  overflow: auto
  align-content: flex-start
  background-color: #eee
  
.el-form
  width: 100%

.games
  background-color: #fff
  width: 100%
  border-radius: 1rem
  box-shadow: inset 0 0 5px #ccc
  display: flex
  flex-wrap: wrap
  padding: 1rem 1rem .5rem 1rem

  &__current-item
    width: 100%
    height: 50px
    margin-bottom: .75rem

    div
      height: 100%
      align-items: center
      display: flex
      justify-content: center
    
    &__index
      font-size: 1rem
      font-weight: bold
      color: #777
    
    &__name
      font-size: 1rem
      font-weight: bold
      justify-content: flex-start!important
      text-align: left
      padding: 0 1rem
      line-height: 1.35rem

  .el-input-group
    border-radius: 1rem!important
    border: solid 1px red!important


</style>