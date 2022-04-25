<template>
 <div class="app-container">
  <el-form ref="form" :model="form" label-width="80px">
    
  <el-form-item label="商品名称">
    <el-input v-model="form.name"></el-input>
  </el-form-item>

  <el-form-item label="商品分类">
    <el-select v-model="form.region" placeholder="请选择商品分类">
      <el-option label="Art" value="Art"></el-option>
      <el-option label="Books" value="Books"></el-option>
      <el-option label="Cameras" value="Cameras"></el-option>
      <el-option label="Cell Phones & Accessories" value="Cell Phones & Accessories"></el-option>
      <el-option label="Clothing" value="Clothing"></el-option>
      <el-option label="Coins & Paper Money" value="Coins & Paper Money"></el-option>
      <el-option label="Collectibles" value="Collectibles"></el-option>
      <el-option label="Computers/Tablets & Networking" value="Computers/Tablets & Networking"></el-option>
      <el-option label="Consumer Electronics" value="Consumer Electronics"></el-option>
      <el-option label="Crafts" value="Crafts"></el-option>
      <el-option label="DVDs & Movies" value="DVDs & Movies"></el-option>
      <el-option label="Entertainment Memorabilia" value="Entertainment Memorabilia"></el-option>
      <el-option label="Gift Cards & Coupons" value="Gift Cards & Coupons"></el-option>
      <el-option label="Music" value="Music"></el-option>
      <el-option label="Musical Instruments & Gear" value="Musical Instruments & Gear"></el-option>
      <el-option label="Pet Supplies" value="Pet Supplies"></el-option>
      <el-option label="Pottery & Glass" value="Pottery & Glass"></el-option>
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
    <el-select v-model="form.condition" placeholder="请选择商品条件">
      <el-option label="新的" value="new"></el-option>
      <el-option label="旧的" value="old"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="拍卖时间">
    <el-col :span="11">
      <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
    </el-col>
  </el-form-item>

  <el-form-item label="拍卖时长">
    <el-select v-model="form.condition" placeholder="请选择拍卖时长">
      <!-- <el-opiton v-for="n in 10" label="新的" value="new"></el-opiton> -->
      <el-option v-for="i in 7" :key="i" :label="i + '天'" :value="i"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="上传商品图片">
      <el-upload
    class="upload-demo"
    action="https://jsonplaceholder.typicode.com/posts/"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    multiple
    :limit="3"
    :on-exceed="handleExceed"
    :file-list="fileList">
    <el-button size="small" type="primary">点击上传</el-button>
  </el-upload>
  </el-form-item>

  
  <el-form-item label="商品简介" placeholder="请输入商品的详细信息">
    <el-input type="textarea" v-model="form.desc"></el-input>
  </el-form-item>

  <el-form-item>
    <el-button type="primary" @click="onSubmit">立即添加商品</el-button></el-button>
  </el-form-item>

  </el-form>
  
 
</div>

</template>

<script>
export default {
  data() {
    return {
      fileList: [
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],

      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    onSubmit() {
      this.$message("submit!");
    },
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning",
      });
    },
    saveProductToBlockchain(params, imageId, descId) {
      let auctionStartTime = Date.parse(params["product-auction-start"]) / 1000;
      let auctionEndTime =
        auctionStartTime +
        parseInt(params["product-auction-end"]) * 24 * 60 * 60;
      console.log(EcommerceStore);
      EcommerceStore.deployed().then(function (i) {
        i.addProductToStore(
          params["product-name"],
          params["product-category"],
          imageId,
          descId,
          auctionStartTime,
          auctionEndTime,
          web3.toWei(params["product-price"], "ether"),
          parseInt(params["product-condition"]),
          {
            from: web3.eth.accounts[0],
            gas: 623164,
          }
        ).then(function (f) {
          console.log(f);
          $("#msg").show();
          $("#msg").html("Your product was successfully added to your store!");
        });
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

