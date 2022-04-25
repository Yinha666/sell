<template>
  <div class="app-container">
    <div class="filter-container">
      <h2>拍卖中物品</h2>


      <el-input  placeholder="搜索名字" style="width: 200px;" class="filter-item" />

      <!-- <el-select  placeholder="选择类型" clearable class="filter-item" style="width: 130px" :model="type">
        <el-option label="1" :value="a"/>
      </el-select> -->

      <!-- <el-select placeholder="选择新旧" style="width: 140px" class="filter-item" :model="neworold">
        <el-option label="1" :value="a"/>
      </el-select> -->


      <el-button class="filter-item" type="primary" icon="el-icon-search" >
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" >
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

      <el-table-column label="图片"  align="center">
        <template slot-scope="scope">
           <el-image 
            style="width: 100px; height: 100px"
            :src="scope.row.image" 
            :preview-src-list="[scope.row.image]">
          </el-image>
        </template>
      </el-table-column>

      
      <el-table-column label="名字" align="center" >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="新/旧"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.neworold }}</span>
        </template>
      </el-table-column>

      <el-table-column label="起拍价格"  align="center">
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
          <el-button type="primary">商品详情</el-button>
      </el-table-column>
    </el-table>

    <h2>当前账户拍卖记录</h2>
    <el-table
    :data="addrbuyList"
      border
      style="width: 100%">

      <el-table-column label="图片"  align="center">
        <template slot-scope="scope">
           <el-image 
            style="width: 100px; height: 100px"
            :src="scope.row.image" 
            :preview-src-list="[scope.row.image]">
          </el-image>
        </template>
      </el-table-column>

      <el-table-column align="center" label="名字">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="新/旧">
        <template slot-scope="scope">
          {{ scope.row.neworold }}
        </template>
      </el-table-column><el-table-column align="center" label="出价">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column><el-table-column align="center" label="起拍时间">
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
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <h2>当前账户发布拍卖记录</h2>
    <el-table
    :data="addrbuyList"
      border
      style="width: 100%">

      <el-table-column label="图片"  align="center">
        <template slot-scope="scope">
           <el-image 
            style="width: 100px; height: 100px"
            :src="scope.row.image" 
            :preview-src-list="[scope.row.image]">
          </el-image>
        </template>
      </el-table-column>

      <el-table-column align="center" label="名字">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="新/旧">
        <template slot-scope="scope">
          {{ scope.row.neworold }}
        </template>
      </el-table-column><el-table-column align="center" label="出价">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column><el-table-column align="center" label="起拍时间">
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
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { sellList, addrbuyList, addrsellList} from '@/api/sell'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        拍卖中: 'primary',
        拍卖成功: 'success',
        拍卖失败: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      addrbuyList: null,
      addrsellList: null,

      listLoading: true,

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true

      sellList().then(response => {
        this.list = response.data.slice(0,5)
      })

      addrbuyList().then(res => {
        this.addrbuyList = res.data.slice(0,3)
      })

      addrsellList().then(res => {
        this.addrsellList = res.data.slice(0,3)
        this.listLoading = false
      })

    }
  }
}
</script>

<style scoped>
.filter-item{
  margin-right: 10px;
  margin-bottom: 5px;
}

</style>