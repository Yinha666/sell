<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="商品名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="商品分类">
        <el-select v-model="form.type" placeholder="请选择商品分类">
          <el-option label="Art" value="Art"></el-option>
          <el-option label="Books" value="Books"></el-option>
          <el-option label="Cameras" value="Cameras"></el-option>
          <el-option
            label="Cell Phones & Accessories"
            value="Cell Phones & Accessories"
          ></el-option>
          <el-option label="Clothing" value="Clothing"></el-option>
          <el-option
            label="Coins & Paper Money"
            value="Coins & Paper Money"
          ></el-option>
          <el-option label="Collectibles" value="Collectibles"></el-option>
          <el-option
            label="Computers/Tablets & Networking"
            value="Computers/Tablets & Networking"
          ></el-option>
          <el-option
            label="Consumer Electronics"
            value="Consumer Electronics"
          ></el-option>
          <el-option label="Crafts" value="Crafts"></el-option>
          <el-option label="DVDs & Movies" value="DVDs & Movies"></el-option>
          <el-option
            label="Entertainment Memorabilia"
            value="Entertainment Memorabilia"
          ></el-option>
          <el-option
            label="Gift Cards & Coupons"
            value="Gift Cards & Coupons"
          ></el-option>
          <el-option label="Music" value="Music"></el-option>
          <el-option
            label="Musical Instruments & Gear"
            value="Musical Instruments & Gear"
          ></el-option>
          <el-option label="Pet Supplies" value="Pet Supplies"></el-option>
          <el-option
            label="Pottery & Glass"
            value="Pottery & Glass"
          ></el-option>
          <el-option label="Sporting Goods" value="Sporting Goods"></el-option>
          <el-option label="Stamps" value="Stamps"></el-option>
          <el-option label="Tickets" value="Tickets"></el-option>
          <el-option label="Toys & Hobbies" value="Toys & Hobbies"></el-option>
          <el-option label="Video Games" value="Video Games"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="起拍价格">
        <el-input v-model="form.price"></el-input>
      </el-form-item>

      <el-form-item label="商品条件">
        <el-select v-model="form.neworold" placeholder="请选择商品条件">
          <el-option label="新的" value="new"></el-option>
          <el-option label="旧的" value="old"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="起拍时间">
        <el-date-picker
          v-model="form.date"
          type="datetime"
          placeholder="选择日期时间"
          default-time="12:00:00"
          value-format="timestamp"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="拍卖时长">
        <el-select v-model="form.days" placeholder="请选择拍卖时长">
          <!-- <el-opiton v-for="n in 10" label="新的" value="new"></el-opiton> -->
          <el-option
            v-for="i in 7"
            :key="i"
            :label="i + '天'"
            :value="i"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="上传图片">
        <el-upload action="" list-type="picture" :on-change="handleChangeImage">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="商品简介" placeholder="请输入商品的详细信息">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即添加商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

const Web3 = require("web3");
const contract = require("truffle-contract");
const ipfsAPI = require("ipfs-api");

const ecommerce_store_artifacts = require("../abi/EcommerceStore.json");

var EcommerceStore = contract(ecommerce_store_artifacts); //['abi']]

const ipfs = ipfsAPI({
  host: "localhost",
  port: "5001",
  protocol: "http",
});

export default {
  data() {
    return {
      form: {
        name: "",
        type: "",
        price: "",
        neworold: "",
        date: "",
        days: "",
        image: "",
        desc: "",
      },
    };
  },
  methods: {
    handleChangeImage(file) {
      let vue = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function (e) {
        vue.form.image = this.result;
      };
    },
    async onSubmit() {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const defaultAccount = accounts[0];

      if (!defaultAccount){
        return "empty"
      }

      // new Web3(web3.currentProvider)
      EcommerceStore.setProvider(web3.currentProvider);

      console.log(defaultAccount);

      const image = this.form.image
      const desc = this.form.desc

      if (!imageid|| !descid){
        console.log('empty')
        return
      }

      const imagehash = await ipfs.add(Buffer.from(image));
      const deschash = await ipfs.add(Buffer.from(desc, "utf-8"));

      const imageid = imagehash[0].hash;
      const descid = deschash[0].hash;

      console.log(imageid);
      console.log(descid);



      let auctionStartTime = this.form.date / 1000;
      let auctionEndTime = auctionStartTime + this.form.days * 24 * 60 * 60;
      EcommerceStore.deployed()
        .then(function (i) {
          i.addProductToStore(
            this.form.name,
            this.form.type,
            imageid,
            descid,
            auctionStartTime,
            auctionEndTime,
            web3.toWei(this.form.price, "ether"),
            this.form.days
          ),
            {
              from: web3.eth.accounts[0],
              gas: 623164,
            };
        })
        .then(function (f) {
          console.log(f);
        }).catch(err=>{
          console.log(err)
        });
    },
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning",
      });
    },
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>
