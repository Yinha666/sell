<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card :body-style="{ padding: '0px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div style="padding: 14px">
            <span>好吃的汉堡</span>/<span>新</span>
          </div>
        </el-card>
      </el-col>
      <el-card>
        <el-col :span="12">
          你的出价
          <el-form
            ref="form"
            :model="form"
            label-width="80px"
            label-position="top"
          >
            <el-form-item label="输入您的出价">
              <el-input
                v-model="form.price"
                placeholder="拍卖出价 > 起拍价格"
              ></el-input>
            </el-form-item>

            <el-form-item label="输入您发送的ETH">
              <el-input
                v-model="form.eth"
                placeholder="发送的ETH >= 拍卖出价"
              ></el-input>
            </el-form-item>

            <el-form-item label="设置加密密钥">
              <el-input v-model="form.pw" placeholder="输入加密密钥"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" click="">确认拍卖</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          Reveal Bid
          <el-form
            ref="form"
            :model="form2"
            label-width="80px"
            label-position="top"
          >
            <el-form-item label="Amount You Bid">
              <el-input
                v-model="form2.bid"
                placeholder="Amount > Start Price"
              ></el-input>
            </el-form-item>

            <el-form-item label="Enter Secret Text">
              <el-input
                v-model="form2.secret"
                placeholder="Any random text"
              ></el-input>
            </el-form-item>

            <el-form-item label="user-number">
              <el-input v-model="form2.number" placeholder="1..2..3"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" click="">Reveal Bid</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-card>
    </el-row>

    <el-card class="desc" style="margin-top: 10px">
      <div slot="header" class="clearfix">
        <span>物品描述</span>
      </div>
      <div>内容</div>
    </el-card>
    
  </div>
</template>

<script>
// import { getList } from '@/api/table'

export default {
  data() {
    return {
      form: {
        price: null,
        pw: null,
        eth: null,
      },

      form2: {
        bid: null,
        secret: null,
        number: null,
      },

      list: null,
      listLoading: true,
    };
  }
};
</script>

<style>
.image {
  width: 50%;
}
</style>
