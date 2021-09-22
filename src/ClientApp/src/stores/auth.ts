import { defineStore } from 'pinia'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

export interface IAuthInfo {
  accessToken: string
  accessTokenExpiration: Date | null
  userName: string
  userRoles: string[]
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authInfo: null as IAuthInfo | null
  }),
  getters: {
    isAuthenticated(): boolean {
      if (this.authInfo !== null && this.authInfo.accessToken) {
        // check exp
        if (new Date() <= (this.authInfo.accessTokenExpiration as Date)) return true
      }

      return false
    },

    userName(): string {
      return this.authInfo?.userName ?? ''
    },

    isUserInRole() {
      return (role: string): boolean => {
        if (this.authInfo === null) return false
        role = role.toLowerCase()
        return !!this.authInfo.userRoles.find(r => r.toLowerCase() === role)
      }
    },

    isUserInAnyRole() {
      return (roles: string[]): boolean => {
        if (this.authInfo === null) return false
        return this.authInfo.userRoles.some(v => roles.find(r => r.toLowerCase() === v.toLowerCase()))
      }
    }
  },
  actions: {
    updateToken(token: string): void {
      const decode = jwt_decode<any>(token)
      let role = decode['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      if (!Array.isArray(role))
        role = [role]

      this.authInfo = {
        accessToken: token,
        userName: decode['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        userRoles: role,
        accessTokenExpiration: new Date(decode.exp * 1000)
      }
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },

    clearToken(): void {
      this.authInfo = null
    },

    login(token: string): void {
      this.updateToken(token)
      localStorage.setItem('token', token)
    },

    logout(): void {
      this.clearToken()
      delete axios.defaults.headers.common.Authorization
      localStorage.removeItem('token')
    }
  }
})
