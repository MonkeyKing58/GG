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
      <el-form-item>
        <h1>{{consoleInfo.name}}</h1>
      </el-form-item>
  
      <!-- -----Account----- -->
      <el-form-item>
        <div class="info">
          <div style="display: flex; align-items: center;">Аккаунт:</div>
          <el-button style="width: 100%;" type="primary" plain icon="el-icon-tickets" @click="$router.push('/games/' + consoleInfo.id)">
            {{consoleInfo.account}}
          </el-button>
        </div>
      </el-form-item>

      <!-- -----Client----- -->
      <el-form-item v-if="!free">
        <div class="info">
          <div>Клиент:</div>
          <div>{{consoleInfo.client}}</div>
        </div>
      </el-form-item>

      <el-form-item v-else>
        <div class="info">
          <div>Пост. клиент</div>
          <el-select
            v-model="oldClient"
            :disabled="Boolean(newClient.length)"
            filterable
            placeholder="Введите имя клиента">
            <el-option
              v-for="client in clients"
              :key="client.id"
              :label="client.clName"
              :value="client.id"
              class="font">
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item v-if="free">
        <div class="info">
          <div>Новый</div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 3}"
            v-model="newClient"
            resize="none"
          ></el-input>
        </div>
      </el-form-item>

      <!-- -----Deposit----- -->
      <el-form-item>
        <div class="info">
          <div>Залог:</div>
          <div>
            <el-input placeholder="Залог" v-model="consoleInfo.deposit"></el-input>
          </div>
        </div>
      </el-form-item>

      <el-form-item v-if="free">
        <el-button-group>

          <el-button
            type="primary"
            plain
            @click="consoleInfo.deposit='Паспорт'"
            class="button"
            icon="el-icon-reading"
          >Паспорт</el-button>

          <el-button
            type="primary"
            plain
            @click="consoleInfo.deposit='5000'"
            class="button"
            icon="el-icon-money"
            style="border:solid 1px #b3d8ff"
          >5000р</el-button>

          <el-button
            type="primary"
            plain
            @click="consoleInfo.deposit='ВУ'"
            class="button"
            icon="el-icon-bank-card"
            style="border:solid 1px #b3d8ff"
          >ВУ</el-button>

        </el-button-group>
      </el-form-item>

      <!-- -----Date----- -->
      <el-form-item v-if="!free">
        <div class="info">
          <div>До:</div>
          <div class="info__date">
            <el-button @click="changeDate(false)"><i class="el-icon-minus"></i></el-button>
            <div>{{date | date}}</div>
            <el-button @click="changeDate(true)"><i class="el-icon-plus"></i></el-button>
          </div>
        </div>
      </el-form-item>

      <el-form-item v-else>
        <div class="info">
          <div>Кол. дней</div>
          <div>
            <el-input-number
              style="width:100%;"
              type="number"
              :min="1"
              :step="1"
              @change="changeRentMoney"
              v-model="rentDays"
            ></el-input-number>
          </div>
        </div>
      </el-form-item>

      <!-- -----Money----- -->
      <el-form-item v-if="!free">
        <div class="info">
          <div>Долг:</div>
          <div>
            <el-input-number
              type="number"
              :min="0"
              :step="100"
              v-model="consoleInfo.duty"
            ></el-input-number>
          </div>
        </div>
      </el-form-item>

      <el-form-item v-else>
        <div class="info">
          <div>Кол. денег</div>
          <div>
            <el-input-number
              style="width:100%;"
              type="number"
              :min="0"
              :step="100"
              v-model="rentMoney"
            ></el-input-number>
          </div>
        </div>
      </el-form-item>

      <!-- -----Buttons----- -->
      <el-form-item>
        <el-button-group>

          <el-button
            type="danger"
            @click="handleData('duty')"
            class="button"
            icon="el-icon-sold-out"
          >Долг</el-button>

          <el-button
            type="warning"
            @click="handleData('misha')"
            class="button"
            icon="el-icon-sold-out"
          >Миша</el-button>

          <el-button
            type="success"
            @click="handleData('kostya')"
            class="button"
            icon="el-icon-sold-out"
          >Костя</el-button>

        </el-button-group>
      </el-form-item>
      
      <el-form-item v-if="!free">
        <el-button
          type="primary"
          @click="taker"
          class="button"
          icon="el-icon-bottom"
        >Забрать</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sendToChat from '@/utils/telegram'
import filterDate from '@/filters/date.filter'

export default {
  name: 'Console',
  metaInfo: {
    title: 'GoodGame58 | Console menu'
    },
  data:() => {
    return {
      consoleInfo: null,
      date: '',
      newDate: '',
      test: '',
      rules: null,
      loading: true,
      oldClient: '',
      newClient: '',
      rentDays: 1,
      rentMoney: 500,
      savedDuty: 0
    }
  },
  computed: {    
    ...mapGetters(['fleetById', 'clients', 'money']),

    free() {
      if(this.consoleInfo.free === 'true')
        return true
      return false
    }
  },
  mounted() {
    const {id} = this.$route.params
    this.consoleInfo = this.fleetById(id)
    if (this.consoleInfo.duty !== '') this.savedDuty = this.consoleInfo.duty
    this.date = this.consoleInfo.date
    this.newDate = new Date(this.consoleInfo.date)

    this.loading = false
  },

  methods: {
    changeRentMoney(currentValue) {
      this.rentMoney = currentValue * 500 + this.consoleInfo.duty
    },

    changeDate(operator) {

      if( (this.newDate - new Date(this.consoleInfo.date) > 0) || operator) {

        this.date = operator
          ? this.newDate.setDate(this.newDate.getDate() + 1)
          : this.newDate.setDate(this.newDate.getDate() - 1)
        
        this.consoleInfo.duty = operator
          ? +this.consoleInfo.duty + 500
          : +this.consoleInfo.duty - 500
      }

    },

    async handleData(wallet) {

      let rentClient = this.consoleInfo.client
      let rentDate = this.date

      if(this.free) {
        this.newClient = this.newClient.replace(new RegExp('\\n','g'),' ');
        rentClient = this.newClient.length
          ? this.newClient
          : this.clients.find(i => i.id === this.oldClient).clName

        this.consoleInfo.duty = this.rentMoney

        rentDate = new Date(Date.now())
        rentDate = new Date(rentDate.setDate(rentDate.getDate() + this.rentDays))

        let clMoney = this.consoleInfo.duty
        if (this.newClient.length) {
          try {
            await this.$store.dispatch('addNewClient', {clName: this.newClient, clMoney})
          } catch(e) {
            console.log(e)
          }
        } else {
          try {
            const clBank = this.clients.find(i => i.id === this.oldClient).clMoney
            clMoney += clBank;
            await this.$store.dispatch('editClientData', { id:this.oldClient, clMoney})
          } catch(e) {
            console.log(e)
          }
        }
      }

      let rentDuty = (wallet === 'duty')
        ? this.consoleInfo.duty
        : 0
      
      const data = {
        account: this.consoleInfo.account,
        client: rentClient,
        date: rentDate,
        deposit: this.consoleInfo.deposit,
        duty: rentDuty,
        free: 'false',
        img: this.consoleInfo.img,
        name: this.consoleInfo.name,
        id: this.consoleInfo.id
      }      

      const money = this.consoleInfo.duty + this.money[wallet].money    
  
      this.date = rentDate
      this.loading = true

      let message = this.free
        ? ''
        : '<u>ПРОДЛИЛ%0A%0A</u>'

      const deposit = this.consoleInfo.deposit.length
        ? this.consoleInfo.deposit
        : 'Без'

      message +=
        '<b> Клиент: </b>' + rentClient + '%0A%0A' +
        '<b> Прист: </b>' + this.consoleInfo.name + '%0A' +
        '<b>  Залог: </b>' + deposit + '%0A' +
        '<b>        До: </b>' + filterDate(rentDate) + '%0A%0A'

      if(rentDuty) {
        message += '<b>  Долг: </b>' + rentDuty
      } else {
        if(wallet === 'misha')
          message += '<b>Баланс: </b>' + money + '/' + this.money['kostya'].money
        else
          message += '<b>Баланс: </b>' + this.money['misha'].money + '/' + money
      }
      
      try {
        this.loader = true
        await this.$store.dispatch('editConsoleInfo', data)
        await this.$store.dispatch('editMoney', {id: wallet, money})
        if (this.savedDuty)
          await this.$store.dispatch('editMoney', {id: 'duty', money: +this.money['duty'].money - this.savedDuty})
        await this.$store.dispatch('editMoney', {id: 'date', money: new Date()})

        await sendToChat(message)

        this.$message({
          message: 'Данные записаны',
          type: 'success'
        })

        this.$router.push('/')

      } catch(e) {
        console.log(e)
      }
    },

    async taker() {

      const data = {
        account: this.consoleInfo.account,
        client: '',
        date: '',
        deposit: '',
        duty: '',
        free: 'true',
        img: this.consoleInfo.img,
        name: this.consoleInfo.name,
        id: this.consoleInfo.id
      }

      try {
        await this.$store.dispatch('editConsoleInfo', data)

        this.$message({
          message: 'Приставка свободна',
          type: 'success'
        })

        this.$router.push('/')

      } catch(e) {
        console.log(e)
      }
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
  background-color: #fff

.el-form
  width: 100%

h3
  text-align: left
  padding-left: .5rem 

.info
  display: flex

  & div
    display: flex
    width: 100%

  & div:nth-of-type(1)
    width: 25%
    min-width: 25%
    justify-content: flex-end
    text-align: right
    padding-right: .5rem
    font-weight: bold
    line-height: 20px

  & div:nth-of-type(2)
    justify-content: flex-start
    text-align: left
    line-height: 20px
  
  & div .el-input
    width: 100%
    padding:0
    margin-top: -8px

  & div .el-input-number
    width: 100%
    padding:0
    margin-top: -8px

  &__date
    margin-top: -8px

  &__date .el-button
    width: 35px
    display: flex
    justify-content: center
    box-shadow: 0 0 2px rgba(0, 0, 0, .04)
    background-color: #F5F7FA
    font-size: 13px

  &__date .el-button:nth-of-type(1)
    border-radius: 4px 0 0 4px
    border-right: none

  &__date .el-button:nth-of-type(2)
    border-radius: 0 4px 4px 0
    border-left: none

  &__date div
    width: 100%!important
    height: 100%
    display: flex
    align-items: center
    justify-content: center
    border: 1px solid #DCDFE6
    padding: 0 10px!important
    font:
      weight: normal!important
      size: 13px

.el-button-group
  width: 100%
  display: flex

  & .el-button
    height: 100%
    width: 100%

.font
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif!important
  max-width: calc(100vw - 1rem)

</style>