<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card :body-style="{ padding: '0px' }" class="card">
          <img :src="this.product.image" class="image" />
          <div style="padding: 14px">
            <span>{{ this.product.name }}</span
            >/<span>{{ this.product.type }}</span>
          </div>
        </el-card>
      </el-col>
      <el-card class="card">
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
                <el-button type="primary" @click="bid">确认拍卖</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="22">
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
                <el-input
                  v-model="form2.number"
                  placeholder="1..2..3"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="reveal">Reveal Bid</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="22">
          <div v-if="this.formtype == 3">
            finalize-auction
            <el-form :inline="true" class="mid">
              <el-col :span="11" 
                ><el-form-item label=""
                  ><el-button type="primary" @click="final">确认拍卖</el-button></el-form-item
                ></el-col
              >
              <el-col :span="11"
                ><el-form-item label=""
                  ><el-button type="primary" @click="revert">确认退款</el-button></el-form-item
                ></el-col
              >
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
const ethUtil = require("ethereumjs-util");

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

function displayPrice(price) {
  return Web3.utils.fromWei(price.toString(), 'ether') + ' ETH'
}

import { parseTime } from "@/utils";
import detectEthereumProvider from "@metamask/detect-provider";

export default {
  async created() {
    this.id = this.$route.query.id;

    const a = await ethereum.request({ method: "eth_requestAccounts" });
    this.acc = a[0];

    var provider = await detectEthereumProvider();
    EcommerceStore.setProvider(provider);
    let contract = await EcommerceStore.deployed();

    this.contract = contract;

    let productId = this.id;

    // test
    var p = await contract.getProductById(productId);

    var productimage = await request("http://localhost:8080/ipfs/" + p[3]);
    var productdesc = await request("http://localhost:8080/ipfs/" + p[4]);

    const productStatus = parseInt(p[8]);
    var product = {
      id: p[0],
      name: p[1],
      type: p[2],
      image: productimage,
      desc: productdesc,
      starttime: parseInt(p[5]),
      endtime: parseInt(p[6]),
      price: Web3.utils.fromWei(p[7], "ether") + " ETH",
      status: productStatus,
    };

    this.product = product;
    console.log(product);

    let currentTime = new Date().getTime() / 1000;

    if (productStatus == 1) {
      console.log("Product sold");

      this.contract.getHighestBidInfo(this.id).then(info => {
        const {0: highestBidder, 1: highestBid, 2: secondBid} = info
        finalPrice = secondBid
        console.log(`产品状态：揭标已结束，最高价：${displayPrice(highestBid)}, 开始进入仲裁投票阶段!`)
      })

      this.contract.getEscrowInfo(this.id).then(escroInfo => {
        console.log('escroInfo:', escroInfo)
        // return (buyer, seller, arbiter, buyerVotesCount, sellerVotesCount);
        const {0: buyer, 1: seller, 2: arbiter, 3: buyerVotesCount, 4: sellerVotesCount} = escroInfo
        console.log(`<p>买家：${buyer}</p>`)
        console.log(`<p>卖家：${seller}</p>`)
        console.log(`<p>仲裁：${arbiter}</p>`)

        if (parseInt(buyerVotesCount) === 2) {
          console.log(`<p>商品未成交，已退款给买家!`)
          console.log(`<p>产品状态：拍卖已结束!</p>`)
        } else if (parseInt(sellerVotesCount) === 2) {
          console.log(`<p>商品成交，已付款给卖家, 成交价：${Web3.utils.fromWei(finalPrice.toString(), 'ether')} ETH`)
          console.log(`<p>产品状态：拍卖已结束</p>`)
        } else {
          console.log(`<p>买家获得: ${buyerVotesCount}/3 票`)
          console.log(`<p>卖家获得: ${sellerVotesCount}/3 票`)
        }
      })



    } else if (productStatus == 2) {
      // Unsold：没卖掉，自始至终没有竞标（或者是有人竞标但是没人揭标，竞标人损失钱，卖家也得不到）
      //
      // 1. 执行finalize发现没人竞标

      console.log("Product was not sold");
      console.log(`<p>产品状态：拍卖结束，未卖出</p>`)

    } else {
      if (currentTime < parseInt(product.endtime)) {
        console.log("bidding show");
        this.formtype = 1;
      } else if (currentTime < product.endtime + 60) {
        this.formtype = 2;
      } else {
        this.formtype = 3;
      }
    }

    // this is for test
    // this.formtype = 3;

   
  },
  data() {
    return {
      formtype: null,
      id: null,
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
  methods: {
    async final() {
      this.contract
        .finalizeAuction(parseInt(this.id), {
          from: this.acc,
        })
        .then(function (f) {
          console.log("The auction has been finalized and winner declared.");
        })
        .catch(function (e) {
          console.log(
            "The auction can not be finalized by the buyer or seller, only a third party aribiter can finalize it"
          );
        });
    },
    async revert(){

    },
    async reveal() {
      console.log("reaveal");

      let amount = this.form2.bid;
      let secretText = this.form2.secret;
      let productId = this.id;
      this.contract
        .revealBid(parseInt(productId), amount, secretText, {
          from: this.acc,
          gas: 440000,
        })
        .then(function (f) {
          console.log("Your bid has been successfully revealed!");
          console.log(f);
        });
    },
    async bid() {
      let amount = this.form.price;
      let sendAmount = this.form.eth;
      let secretText = this.form.pw;
      console.log(Web3.utils.toWei(amount, "ether"));
      let sealedBid =
        "0x" + ethUtil.sha256(Buffer.from(amount + secretText)).toString("hex");

      let productId = this.id;
      console.log(sealedBid + " for " + productId);

      this.contract.bid(parseInt(productId), sealedBid, {
        value: Web3.utils.toWei(sendAmount),
        from: this.acc,
        gas: 440000,
      });
    },
  },
};
</script>

<style>
.image {
  width: 50%;
}
.mid{
  margin-top: 20px;
}

.card{
  height: 450px;
}

</style>
