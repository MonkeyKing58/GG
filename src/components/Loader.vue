<template>
  <el-row class="loader-wrapper">
    <el-col class="loader-icon"></el-col>
    <el-col v-loading="true" style="margin-top: 10vw;"></el-col>
  </el-row>
</template>

<style lang="scss" scoped>

.loader-wrapper {
  height:100vh;
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  justify-content: center;
}

.loader-icon {
  width: 50vw;
  height: 30vw; 
  display: flex;
  background-image: url(../assets/images/GG.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-top: 0;
}

</style>