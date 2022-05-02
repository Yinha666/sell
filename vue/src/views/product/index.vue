<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="this.product.image" class="image" />
          <div style="padding: 14px">
            <span>{{ this.product.name }}</span
            >/<span>{{ this.product.type }}</span>
          </div>
        </el-card>
      </el-col>
      <el-card>
        <el-col :span="22">
          <div v-if="this.formtype == 1">
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
                <el-input
                  v-model="form.pw"
                  placeholder="输入加密密钥"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" click="">确认拍卖</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12">
        <div v-if="this.formtype == 2">
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
        </div>
        </el-col>
      </el-card>
    </el-row>

    <el-card class="desc" style="margin-top: 10px">
      <div slot="header" class="clearfix">
        <span>物品描述</span>
      </div>
      <div>{{ this.product.desc }}</div>
    </el-card>
  </div>
</template>

<script>
// import { getList } from '@/api/table'

function getCurrentTime() {
  return Math.round(new Date());
}

import request from "@/utils/request";
const Web3 = require("web3");

const contract = require("truffle-contract");
const ecommerce_store_artifacts = require("../abi/EcommerceStore.json");
var EcommerceStore = contract(ecommerce_store_artifacts); //['abi']]

const ipfsAPI = require("ipfs-api");
const ipfs = ipfsAPI({
  host: "127.0.0.1",
  port: "5001",
  protocol: "http",
});

import { parseTime } from "@/utils";

export default {
  async created() {
    this.id = this.$route.query.id;

    const a = await ethereum.request({ method: "eth_requestAccounts" });
    let acc = a[0];

    var provider = new Web3.providers.HttpProvider("http://localhost:8545");
    EcommerceStore.setProvider(provider);
    let contract = await EcommerceStore.deployed();

    let productId = this.id;

    // test
    productId = 1;

    var p = await contract.getProductById(productId);

    var productimage = await request("http://localhost:8080/ipfs/" + p[3]);
    var productdesc = await request("http://localhost:8080/ipfs/" + p[4]);

    const productStatus = parseInt(p[8])
    var product = {
      id: p[0],
      name: p[1],
      type: p[2],
      image: productimage,
      desc: productdesc,
      starttime: p[5] * 1000,
      endtime: p[6] * 1000,
      price: Web3.utils.fromWei(p[7], "ether") + " ETH",
      status: productStatus,
    };

    this.product = product;
    console.log(product);

    let currentTime = new Date().getTime()


    if (productStatus == 1){
      console.log("Product sold");
      
    }else if (productStatus == 2){
      console.log("Product was not sold");
      
    }else if (currentTime < parseInt(product.endtime)){
      console.log("bidding show")
      this.formtype = 1
    }


      // let currentTime = getCurrentTimeInSeconds();
      // if (parseInt(p[8]) == 1) {
      //   $("#product-status").html("Product sold");
      // } else if (parseInt(p[8]) == 2) {
      //   $("#product-status").html("Product was not sold");
      // } else if (currentTime < parseInt(p[6])) {
      //   $("#bidding").show();
      // } else if (currentTime < parseInt(p[6]) + 600) {
      //   $("#revealing").show();
      // } else {
      //   $("#finalize-auction").show();
      // }
      // if (p.productStatus == 1) {
      //   EcommerceStore.deployed().then(function (i) {
      //     $("#escrow-info").show();
      //     i.highestBidderInfo.call(productId).then(function (f) {
      //       if (f[2].toLocaleString() == "0") {
      //         $("#product-status").html(
      //           "Auction has ended. No bids were revealed"
      //         );
      //       } else {
      //         $("#product-status").html(
      //           "Auction has ended. Product sold to " +
      //             f[0] +
      //             " for " +
      //             displayPrice(f[2]) +
      //             "The money is in the escrow. Two of the three participants (Buyer, Seller and Arbiter) have to " +
      //             "either release the funds to seller or refund the money to the buyer"
      //         );
      //       }
      //     });
      //     i.escrowInfo.call(productId).then(function (f) {
      //       $("#buyer").html("Buyer: " + f[0]);
      //       $("#seller").html("Seller: " + f[1]);
      //       $("#arbiter").html("Arbiter: " + f[2]);
      //       if (f[3] == true) {
      //         $("#release-count").html(
      //           "Amount from the escrow has been released"
      //         );
      //       } else {
      //         $("#release-count").html(
      //           f[4] + " of 3 participants have agreed to release funds"
      //         );
      //         $("#refund-count").html(
      //           f[5] + " of 3 participants have agreed to refund the buyer"
      //         );
      //       }
      //     });
      //   });
      // }
  },
  data() {
    return {
      formtype: null,
      product: {
        image: null,
      },

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
    };
  },
};
</script>

<style>
.image {
  width: 50%;
}
</style>
