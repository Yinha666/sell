import request from '@/utils/request'

export function sellList(params) {
  return request({
    url: '/sellList',
    method: 'get',
    params
  })
}

export function addrbuyList(params) {
  return request({
    url: '/addrbuyList',
    method: 'get',
    params
  })
}

export function addrsellList(params) {
  return request({
    url: '/addrsellList',
    method: 'get',
    params
  })
}


