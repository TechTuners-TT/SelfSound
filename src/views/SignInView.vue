<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Welcome back
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Signing you in...</p>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccess" class="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">
              Successfully signed in! 
            </p>
            <p class="text-sm text-green-700 mt-1">
              You can now continue to the app.
            </p>
          </div>
        </div>
        <button 
          @click="continueToApp"
          class="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Continue to App
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">
              Sign in failed
            </p>
            <p class="text-sm text-red-700 mt-1">
              {{ errorMessage }}
            </p>
          </div>
        </div>
        <button 
          @click="errorMessage = ''"
          class="mt-3 text-sm text-red-600 hover:text-red-500 underline"
        >
          Try again
        </button>
      </div>

      <!-- Sign In Form -->
      <div v-if="!isLoading && !showSuccess" class="bg-white py-8 px-6 shadow-lg rounded-lg">
        <div class="space-y-6">
          <!-- Google Sign In -->
          <button
            @click="signInWithGoogle"
            :disabled="isLoading"
            class="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <!-- Email Form -->
          <form @submit.prevent="signInWithEmail" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              :disabled="isLoading || !email || !password"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              Sign in with Email
            </button>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center text-sm text-gray-600">
        <p>
          Don't have an account? 
          <router-link to="/signup" class="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'SignInView',
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      errorMessage: '',
      showSuccess: false
    }
  },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    return { authStore, router }
  },
  methods: {
    async signInWithGoogle() {
      this.isLoading = true
      this.errorMessage = ''
      
      try {
        await this.authStore.signInWithGoogle()
        this.showSuccess = true
        
        // Optional: Auto-redirect after 3 seconds
        setTimeout(() => {
          if (this.showSuccess) {
            this.continueToApp()
          }
        }, 3000)
        
      } catch (error) {
        console.error('Google sign in error:', error)
        this.errorMessage = error.message || 'Google sign in failed. Please try again.'
      } finally {
        this.isLoading = false
      }
    },

    async signInWithEmail() {
      this.isLoading = true
      this.errorMessage = ''
      
      try {
        await this.authStore.signInWithEmail(this.email, this.password)
        this.showSuccess = true
        
        // Optional: Auto-redirect after 3 seconds
        setTimeout(() => {
          if (this.showSuccess) {
            this.continueToApp()
          }
        }, 3000)
        
      } catch (error) {
        console.error('Email sign in error:', error)
        this.errorMessage = error.message || 'Sign in failed. Please check your credentials.'
      } finally {
        this.isLoading = false
      }
    },

    continueToApp() {
      // Redirect to intended page or dashboard
      const redirect = this.$route.query.redirect || '/dashboard'
      this.$router.push(redirect)
    }
  }
}
</script>
