const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    image: "https://booking.demo.fastadmin.net/uploads/20210301/264852e5df946e3347bf1ad8502b4dd5.jpg",
    name: "房子",
    'neworold|1': ["新","旧"],
    price: 100,
    starttime: "@datetime",
    endtime: "@datetime",
  }]
})

const addrbuy = Mock.mock({
  'items|30': [{
    image: "https://booking.demo.fastadmin.net/uploads/20210301/264852e5df946e3347bf1ad8502b4dd5.jpg",
    name: "房子",
    'neworold|1': ["新","旧"],
    price: 100,
    starttime: "@datetime",
    endtime: "@datetime",
    'status|1': ['拍卖中', '拍卖成功', '拍卖失败']
  }]
})

const addrsell = Mock.mock({
  'items|30': [{
    image: "https://booking.demo.fastadmin.net/uploads/20210301/264852e5df946e3347bf1ad8502b4dd5.jpg",
    name: "房子",
    'neworold|1': ["新","旧"],
    price: 100,
    starttime: "@datetime",
    endtime: "@datetime",
    'status|1': ['拍卖中', '拍卖成功', '拍卖失败']
  }]
})

module.exports = [
  {
    url: '/sellList',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: data.items
      }
    }
  },
  {
    url: '/addrbuyList',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: addrbuy.items
      }
    }
  },
  {
    url: '/addrsellList',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: addrsell.items
      }
    }
  }
]
