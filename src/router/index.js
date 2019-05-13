import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/common/Login'
import SignInUser from '@/components/login/SignInUser'
import SignInShop from '@/components/login/SignInShop'
import SignUpUser from '@/components/login/SignUpUser'
import SignUpShop from '@/components/login/SignUpShop'
import UserFrame from '@/view/user/UserFrame'
import GeneralList from '@/view/user/GeneralList'
import PersonalData from '@/view/user/PersonalData'
import UserAddress from '@/view/user/UserAddress'
import UserBalance from '@/view/user/UserBalance'
import UserOrder from '@/view/user/UserOrder'
import OrderDetail from '@/view/order/OrderDetail'
import ShopDetail from '@/view/shop/ShopDetail'
import NewOrder from '@/view/order/NewOrder'
import ShopFrame from '@/view/shop/ShopFrame'
import HandleOrder from '@/view/order/HandleOrder'
import SearchOrder from '@/view/order/SearchOrder'
import DishSetting from '@/view/shop/DishSetting'
import ShopInfo from '@/view/shop/ShopInfo'
import ShopData from '@/view/shop/ShopData'
import AdminFrame from '@/view/admin/AdminFrame'
import CheckShop from '@/view/admin/CheckShop'
import CheckSign from '@/view/admin/CheckSign'
import ShopStatistics from '@/view/admin/ShopStatistics'
import UserStatistics from '@/view/admin/UserStatistics'
import FinancialStatistics from '@/view/admin/FinancialStatistics'
import ShopDiscount from '@/view/shop/ShopDiscount'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      redirect: '/login/user',
      children: [
        {
          path: '/login/user',
          name: 'SignInUser',
          component: SignInUser
        },
        {
          path: '/login/shop',
          name: 'SignInShop',
          component: SignInShop
        },
        {
          path: '/sign/user',
          name: 'SignUpUser',
          component: SignUpUser
        },
        {
          path: '/sign/shop',
          name: 'SignUpShop',
          component: SignUpShop
        }

      ]
    },
    {
      path: '/user',
      name: 'UserFrame',
      component: UserFrame,
      redirect: '/user/list',
      children: [
        {
          path: '/user/list',
          name: 'GeneralList',
          component: GeneralList
        },
        {
          path: '/user/data',
          name: 'PersonalData',
          component: PersonalData
        },
        {
          path: '/user/address',
          name: 'UserAddress',
          component: UserAddress
        },
        {
          path: '/user/balance',
          name: 'UserBalance',
          component: UserBalance
        },
        {
          path: '/user/order',
          name: 'UserOrder',
          component: UserOrder
        },
        {
          path: '/order/detail',
          name: 'OrderDetail',
          component: OrderDetail
        },
        {
          path: '/shop/detail',
          name: 'ShopDetail',
          component: ShopDetail
        },
        {
          path: '/order/new',
          name: 'NewOrder',
          component: NewOrder
        }
      ]
    },
    {
      path: '/shop',
      name: 'ShopFrame',
      component: ShopFrame,
      redirect: '/order/handle',
      children: [
        {
          path: '/order/handle',
          name: 'HandleOrder',
          component: HandleOrder
        },
        {
          path: '/order/search',
          name: 'SearchOrder',
          component: SearchOrder
        },
        {
          path: '/shop/dish',
          name: 'DishSetting',
          component: DishSetting
        },
        {
          path: '/shop/info',
          name: 'ShopInfo',
          component: ShopInfo
        },
        {
          path: '/shop/data',
          name: 'ShopData',
          component: ShopData
        },
        {
          path: '/shop/discount',
          name: 'ShopDiscount',
          component: ShopDiscount
        }
      ]
    },
    {
      path: '/admin',
      name: 'AdminFrame',
      component: AdminFrame,
      redirect: '/admin/check',
      children: [
        {
          path: '/admin/check',
          name: 'CheckShop',
          component: CheckShop
        },
        {
          path: '/admin/check/sign',
          name: 'CheckSign',
          component: CheckSign
        },
        {
          path: '/statistics/shop',
          name: 'ShopStatistics',
          component: ShopStatistics
        },
        {
          path: '/statistics/user',
          name: 'UserStatistics',
          component: UserStatistics
        },
        {
          path: '/statistics/finance',
          name: 'FinancialStatistics',
          component: FinancialStatistics
        }
      ]
    }
  ]
})
