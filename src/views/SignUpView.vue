
<template>
    <div class="container">
      <div class="bg-overlay"></div>
      <div class="form-container">
        <h2>Sign up your Profile</h2>
        <form @submit.prevent="handleSignUp">

          <div>
            <label>Your Name</label>
            <input v-model="name" type="text" required />
          </div>

          <div>
            <label>Email address</label>
            <input v-model="email" type="email" required />
          </div>

          <div class="password-container">
    <label>Password</label>
    <input :type="showPassword ? 'text' : 'password'" v-model="password" required />
    <span class="toggle-password" @click="togglePasswordVisibility">
      <img :src="showPassword ? 'https://cdn-icons-png.flaticon.com/512/2767/2767146.png' : 'https://cdn-icons-png.flaticon.com/512/159/159604.png'" 
           alt="Toggle Password Visibility" />
    </span>
  </div>
          <button type="submit" @click="bounceEffect" >Sign Up</button>
        </form>
        <div class="divider">
          <span class="line"></span>
          <span>or continue with</span>
          <span class="line"></span>
        </div>
        <button @click="(event) => { signUpWithGoogle(); bounceEffect(event); }" class="google-btn">
  <img src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" alt="Google" />
  Google
</button>
        <button @click="bounceEffect" class="Guest-btn">Guest mode</button>
        <p><a href="#">Already have an account? Log in here!</a></p>
       
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'App', // works at Add.vue with name Add connected main.js
   // name: 'SignUp',
    data() {
      return {
        name: '',
        email: '',
        password: '',
        showPassword: false,
       
      };
    },
    methods: {
      
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    

      handleSignUp() {
        console.log('Signing up with', this.name, this.email, this.password);
      },
      signUpWithGoogle() {
        console.log('Signing up with Google');
      },
     

      bounceEffect(event) {
        event.target.classList.add('bounce');
        setTimeout(() => {
          event.target.classList.remove('bounce');
        }, 500);
      }

    }
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
  
  * {
    font-family: 'Inter', sans-serif;
  }
  
  .container {
    display: flex;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    background: rgb(6,3,16);
    position: relative;
    overflow: hidden;
  }
  
  .bg-overlay {
    position: absolute;
    inset: 0;
    background-size: 20px 20px;
    background: rgb(6,3,16);
    opacity: 0.1;
  }
  
  .form-container {
    position: relative;
    z-index: 10;
    width: 100%;
    padding: 20px;
    border-radius: 8px;
  
    text-align: center; 
  }
  
  h2 {
    color: white;
    font-size: 24px;
    font-weight: bold;
    max-width: 100%;
    height: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-word;
    text-align: center;
    margin-bottom: 50px;
    height: 36px;
    margin-top: 0px;
  }
  
  label {
    display: block;
    text-align: left;
    color: white;
    font-size: 16px;
    font-weight: medium;
    margin-top: 18px;
    width: 384px;
    height: 24px;
  }
  
  input {
    width: 364px;
    padding: 10px;
    margin-top: 8px;
    border-radius: 5px;
    border: none;
    background: white;
    color: black;
  }
  
  button {
    width: 384px;
    height: 36px;
    padding: 10px;
    background: rgb(2, 3, 61);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 30px;
    font-weight: bold;
    font-size: 16px;
    transition: transform 0.2s;
  }
  .bounce {
    animation: bounce 0.5s ease;
  }
  

  @keyframes bounce {
  0%,
  100% {
    transform: scale(1);
  }
  25%,
  75% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(1);
  }
}

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin: 18px 0;
    font-size: 16px;
    font-weight: medium;
    height: 12px;
    margin-top: 18px;
    margin-bottom: 18px;
  }
  
  .line {
    flex-grow: 1;
    height: 1px;
    background: white;
    margin: 0 10px;
    
  }
  
  .google-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
  }
  
  .google-btn img {
    width: 20px;
    height: auto;
  }
  .Guest-btn{
    margin-top: 18px;
  }
  button:hover {
    background: rgb(0, 12, 156);
  }
  
  
.password-container {
    position: relative;
  }
  
  .toggle-password {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(20%);
    cursor: pointer;
  }
  
  .toggle-password img {
    width: 24px;
    height: 24px;
  }
  

  
  p {
      margin-top: 18px;
      width: 384 px;
      height: 24px;
      font-weight: 600;
    }
    
    a {
      color: white;
      text-decoration: none;
    }
  
  
  /* Media queries for responsive design */
  @media (max-width: 425px) {
      .form-container {
        max-width: 280px; 
        padding: 20px; 
        width: 100%; 
        margin: 0 auto; 
      }
    
      h2 {
        font-size: 1.1rem;
        width: 280px;
      }
      
      label,
      input,
      button {
        width: 100%;  
        max-width: 100%; 
      }
    
      input {
        box-sizing: border-box; 
      }
    
      button {
        width: 100%;
      }
    
      .google-btn {
        width: 100%; 
      }
    }
    
    @media (max-width: 768px) and (min-width: 425px) {
      .form-container {
        max-width: 340px; 
        padding: 20px; 
        width: 100%; 
        margin: 0 auto; 
      }
    
      h2 {
        
        width: 340px;
      }
      
      label,
      input,
      button {
        width: 100%;  
        max-width: 100%; 
      }
    
      input {
        box-sizing: border-box; 
      }
    
      button {
        width: 100%;
      }
    
      .google-btn {
        width: 100%; 
      }
    }
    
    @media (max-width: 1024px) and (min-width: 769px) {
      .form-container {
        max-width: 384px;  
        padding: 20px; 
        width: 100%;  
        margin: 0 auto; 
      }
    
     
    
      label,
      input,
      button {
        width: 384;  
        max-width: 100%; 
      }
    
      .google-btn {
        width: 100%;  
      }
    }
    
    @media  (min-width: 1025px) {
      .form-container {
        max-width: 384px;
      }
    }
  </style>
  
  