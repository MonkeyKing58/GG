<template>
  <div id="lower-bar" :class="{ min_height_50:lowerBar }">
    <el-row id="lower-bar__head">
      <el-col :span="4" ><router-link id="lower-bar__head__home" to="/"></router-link></el-col>
      <el-col :span="6" class="lower-bar__head__money" style="justify-content:flex-end;">{{money.misha.money | currency}}</el-col>
      <el-col :span="4" id="lower-bar__home__cash-icon"></el-col>
      <el-col :span="6" class="lower-bar__head__money">{{money.kostya.money | currency}}</el-col>
      <el-col :span="4">
      <div
        id="lower-bar__home__switcher"
        :class="{ arrow_up:!lowerBar }"
        @click="lowerBar = !lowerBar"></div></el-col>
    </el-row>

    <el-row>
      <el-col :span="16" :offset="4" id="lower-bar__duty">
        <div>Сумма долгов:</div>
        <div>{{money.duty.money | currency}}</div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" id="lower-bar__body">
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          label-width="70px"
          label-position="right"
        >

          <el-form-item label="Миша">
            <el-input-number
              style="width:100%;"
              type="number"
              pattern="[0-9]*"
              inputmode="numeric"
              :min="0"
              :step="100"
              v-model="money.misha.money"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="Костя">
            <el-input-number
              style="width:100%;"
              type="number"
              :min="0"
              :step="100"
              v-model="money.kostya.money"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="Прим.">
            <el-input
              label="top"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 3}"
              v-model="ruleForm.desc"
              resize="none"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="updateMoney('ruleForm')"
              class="button"
            >Сохранить <i class="el-icon-check"></i></el-button>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sendToChat from '@/utils/telegram'

export default {
  name: 'lowerbar',
  data:() => {
    return {
      ruleForm: {
        desc: ''
      },
      // rules: {
      //   moneyMisha: [
      //     { type: 'number', required: true, message: 'Введите сумму', trigger: 'change' },
      //     { type: 'number', min: 100, required: true, message: 'Сумма не может быть меньше 100', trigger: 'change' }
      //   ],
      //   moneyKostya: [
      //     { type: 'number', required: true, message: 'Введите сумму', trigger: 'change' },
      //     { type: 'number', min: 100, required: true, message: 'Сумма не может быть меньше 100', trigger: 'change' }
      //   ]
      // },
      lowerBar: false,
      savedMisha: 0,
      savedKostya: 0
    }
  },
  
  computed: {    
    ...mapGetters(['money'])
  },

  mounted() {
    this.savedMisha = this.money.misha.money
    this.savedKostya = this.money.kostya.money
  },
  methods: {
    async updateMoney() {
      if(this.savedMisha !== this.money.misha.money || this.savedKostya !== this.money.kostya.money) {

        let message = 
          '<u>Скорректировано</u>%0A%0A'
          + this.money.misha.money
          + '/'
          + this.money.kostya.money

        if (this.ruleForm.desc.length) {
          this.ruleForm.desc = this.ruleForm.desc.replace(new RegExp('\\n','g'),' ')
          message += "%0A%0A<b>Примечание: </b>" + this.ruleForm.desc
          }

        try {
          if(this.savedMisha !== this.money.misha.money )
            await this.$store.dispatch('editMoney', {id: 'misha', money: this.money.misha.money})
          if(this.savedKostya !== this.money.kostya.money )
            await this.$store.dispatch('editMoney', {id: 'kostya', money: this.money.kostya.money})
          await this.$store.dispatch('editMoney', {id: 'date', money: new Date()})

          await sendToChat(message)

          this.$message({
            message: 'Баланс обновлен',
            type: 'success'
          })

          this.lowerBar = false

        } catch(e) {
          console.log(e)
        }
      }
    }
  }
}
</script>


<style lang="sass">

%default-bg-img
  background-size: auto 50%
  background-repeat: no-repeat
  background-position: center

#lower-bar
  background-color: #fff
  height: 4rem
  min-height: 4rem
  display: flex
  flex-wrap: wrap
  align-content: space-between
  box-shadow: 0 2px 10px rgba(0, 0, 0, .35)
  overflow: hidden
  transition-duration: .5s
  animation: ease-out!important
  border-radius:4px 4px 0 0
  margin: 0 .5rem
  z-index: 5

  &>div
    display: flex
    width: 100%

  #lower-bar__head
    height: 3rem
    margin: .5rem
    color: #606266

.min_height_50
  min-height: 365px!important

#lower-bar__head__home
  background-image: url(../assets/images/i-home.png)
  @extend %default-bg-img
  height: 100%
  width: 100%
  display: block

#lower-bar__home__cash-icon
  background-image: url(../assets/images/cash.png)
  @extend %default-bg-img
  background-size: auto 60%

#lower-bar__home__switcher
  @extend %default-bg-img
  height: 100%
  background-image: url(../assets/images/i-arrow.png)

.arrow_up
  background-image: url(../assets/images/i-arrow-reverse.png)!important

.lower-bar__head__money
  font-weight: bold
  align-items: center
  display: flex
  padding: .2rem

#lower-bar__body
  margin: .5rem 1rem
  
.button
  width: 100%

#lower-bar__duty
  display: flex
  justify-content: center
  margin-bottom: 10px

  div
    font:
      weight: bold
      size: 12px

  div:nth-of-type(1)
    padding-right: .5rem

</style>