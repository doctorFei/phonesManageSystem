import lxUtil from '@/vendor/lxUtil'
let phoneID = lxUtil.queryUrl('phoneID')
let wxcode=lxUtil.queryUrl('code')
const state = {
  user: {},
  phoneID:phoneID,
  wxcode:wxcode
}

export default state