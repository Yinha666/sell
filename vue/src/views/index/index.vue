<template>
  <div class="app-container">
    <div class="filter-container">
      <h2>拍卖中物品</h2>

      <el-input
        placeholder="搜索名字"
        style="width: 200px"
        class="filter-item"
      />

      <!-- <el-select  placeholder="选择类型" clearable class="filter-item" style="width: 130px" :model="type">
        <el-option label="1" :value="a"/>
      </el-select> -->

      <!-- <el-select placeholder="选择新旧" style="width: 140px" class="filter-item" :model="condition">
        <el-option label="1" :value="a"/>
      </el-select> -->

      <el-button class="filter-item" type="primary" icon="el-icon-search">
        Search
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
      >
        上传拍卖物品
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" min-width="20">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.image"
            :preview-src-list="[scope.row.image]"
          >
          </el-image>
        </template>
      </el-table-column>

      <el-table-column label="名字" align="center" min-width="40">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <!-- <el-table-column label="新/旧" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.condition | conditionFilter }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="起拍价格" align="center" min-width="40">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>

      <el-table-column label="起拍时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.starttime }}
        </template>
      </el-table-column>

      <el-table-column label="结束时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.endtime }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="jumptoDetial(parseInt(scope.row.id))"
            >商品详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <h2>当前账户发布拍卖记录</h2>
    <el-table :data="addrsellList" border style="width: 100%">

      <el-table-column align="center" label="ID" min-width="20">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.image"
            :preview-src-list="[scope.row.image]"
          >
          </el-image>
        </template>
      </el-table-column>

      <el-table-column align="center" label="名字" min-width="40">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="新/旧">
        <template slot-scope="scope">
          {{ scope.row.condition }}
        </template> </el-table-column
      > -->
      <el-table-column align="center" label="出价" min-width="40">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template> </el-table-column
      ><el-table-column align="center" label="起拍时间">
        <template slot-scope="scope">
          {{ scope.row.starttime }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="结束时间">
        <template slot-scope="scope">
          {{ scope.row.endtime }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="拍卖状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{
            scope.row.status | statusTextFilter
          }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <h2>当前账户购买记录</h2>
    <el-table :data="addrbuyList" border style="width: 100%">

      <el-table-column align="center" label="ID" min-width="20">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.image"
            :preview-src-list="[scope.row.image]"
          >
          </el-image>
        </template>
      </el-table-column>

      <el-table-column align="center" label="名字" min-width="40">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="新/旧">
        <template slot-scope="scope">
          {{ scope.row.condition }}
        </template> </el-table-column
      > -->
      <el-table-column align="center" label="出价" min-width="40">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template> </el-table-column
      ><el-table-column align="center" label="起拍时间">
        <template slot-scope="scope">
          {{ scope.row.starttime }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="结束时间">
        <template slot-scope="scope">
          {{ scope.row.endtime }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="拍卖状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{
            scope.row.status | statusTextFilter
          }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    
  </div>
</template>

<script>
import { parseTime } from "@/utils";
import request from '@/utils/request'
import detectEthereumProvider from '@metamask/detect-provider';

const Web3 = require("web3");

const contract = require("truffle-contract");
const ecommerce_store_artifacts = require("@/../../build/contracts/EcommerceStore.json");

var EcommerceStore = contract(ecommerce_store_artifacts); //['abi']]

const ipfsAPI = require("ipfs-api");
const ipfs = ipfsAPI({
  host: "127.0.0.1",
  port: "5001",
  protocol: "http",
});

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "primary",
        1: "success",
        2: "danger",
      };
      return statusMap[status];
    },
    statusTextFilter(status) {
      const statusMap = {
        0: "拍卖中",
        1: "拍卖成功",
        2: "拍卖失败",
      };
      return statusMap[status];
    },
    conditionFilter(status) {
      const statusMap = {
        0: "新",
        1: "旧",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: [],
      addrbuyList: [],
      addrsellList: [],

      listLoading: true,
    };
  },
  async created() {
    console.log(this.$route);
    this.fetchData();
  },
  methods: {
    jumptoDetial(id) {
      this.$router.push({
        path: "/product/index",
        query: {
          id: id,
        },
      });
    },
    async fetchData() {



      const a = await ethereum.request({ method: "eth_requestAccounts" });
      let acc = a[0];
      this.acc = acc
      console.log(acc);

      var provider = await detectEthereumProvider();
      EcommerceStore.setProvider(provider);
      this.contract = await EcommerceStore.deployed();

      
      var productList = [];
      const productNumber = await this.contract.productIndex();
      console.log("产品数量", parseInt(productNumber));

      for (let k = 0; k < parseInt(productNumber); k++) {
        var p = await this.contract.getProductById(k + 1);
        var owner = await this.contract.getAccountOfId(k + 1)
        owner = owner.toLowerCase()

        console.log(owner)

        var productimage = await request("http://localhost:8080/ipfs/" + p[3]);
        var productdesc = await request("http://localhost:8080/ipfs/" + p[4]);

        var product = {
          id: p[0],
          name: p[1],
          type: p[2],
          image: productimage,
          desc: productdesc,
          starttime: parseTime(p[5] * 1000),
          endtime: parseTime(p[6] * 1000),
          price: Web3.utils.fromWei(p[7], "ether") + " ETH",
          status: parseInt(p[8]),
          owner
        };

        productList.push(product);
      }

      this.listLoading = true;



      productList.forEach(ele => {
        if (ele.status == 0){
        this.list.push(ele)
        }
      })

      productList.forEach(ele => {
        this.addrbuyList.push(ele)
      })


      productList.forEach(ele => {
        if (ele.owner == this.acc){
          this.addrsellList.push(ele) 
        }
        this.listLoading = false
      })
      this.listLoading = false


    },
  },
};
</script>

<style scoped>
.filter-item {
  margin-right: 10px;
  margin-bottom: 5px;
}
</style>