<template>

  <Loader v-if="loading"/>
    
  <el-form
    v-else
    :model="consoleInfo"
    :rules="rules"
    ref="consoleInfo"
  >
    <!-- -----Name----- -->
    <el-form-item> <h1>{{consoleInfo.name}}</h1> </el-form-item>

    <!-- -----Account----- -->
    <el-form-item> <div class="info"> <div>Аккаунт:</div> <div>{{consoleInfo.account}}</div> </div> </el-form-item>

    <!-- -----Client----- -->
    <el-form-item>
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
            :value="client.clName"
            class="font">
          </el-option>
        </el-select>
      </div>
    </el-form-item>

    <el-form-item>
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

    <el-form-item>
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
    <el-form-item>
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
    <el-form-item>
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

  </el-form>
</template>


<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Formfree',
  data:() => {
    return {
      consoleInfo: null,
      date: '',
      rules: null,
      oldClient: '',
      newClient: '',
      rentDays: 1,
      rentMoney: 500,
      loading: true
    }
  },
  computed: {    
    ...mapGetters(['fleetById', 'clients', 'money']),
  },
  mounted() {
    const {id} = this.$route.params
    this.consoleInfo = this.fleetById(id)

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

      console.log(this.date = new Date(this.date))
    },

    async handleData(wallet) {

      let rentClient = this.consoleInfo.client
      let rentDuty = (wallet === 'duty')
        ? this.consoleInfo.duty
        : 0

      let rentDate = this.date

      if(this.free) {
        rentClient = this.newClient.length
          ? this.newClient
          : this.oldClient

        rentDate = new Date(Date.now())
        rentDate = new Date(rentDate.setDate(rentDate.getDate() + this.rentDays))
      }
      
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

      try {
        this.loader = true
        await this.$store.dispatch('editConsoleInfo', data)
        await this.$store.dispatch('editMoney', {id: wallet, money})

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