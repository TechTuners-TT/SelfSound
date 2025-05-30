<template>
  <div class="email-verification-container">
    <div class="verification-card">
      <!-- Loading State -->
      <div v-if="isVerifying" class="loading-state">
        <div class="spinner"></div>
        <h2>Verifying your email...</h2>
        <p>Please wait while we verify your email address.</p>
      </div>

      <!-- Success State -->
      <div v-else-if="verificationStatus === 'success'" class="success-state">
        <div class="success-icon">✅</div>
        <h2>Email Verified Successfully!</h2>
        <p>
          Your email has been verified. You can now access all features of your
          account.
        </p>
        <div class="action-buttons">
          <button @click="goToLogin" class="primary-button">
            Continue to Login
          </button>
          <button @click="goToDashboard" class="secondary-button">
            Go to Dashboard
          </button>
        </div>
      </div>

      <!-- Already Verified State -->
      <div
        v-else-if="verificationStatus === 'already_verified'"
        class="info-state"
      >
        <div class="info-icon">ℹ️</div>
        <h2>Email Already Verified</h2>
        <p>Your email address has already been verified.</p>
        <div class="action-buttons">
          <button @click="goToLogin" class="primary-button">
            Continue to Login
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="verificationStatus === 'error'" class="error-state">
        <div class="error-icon">❌</div>
        <h2>Verification Failed</h2>
        <p class="error-message">{{ errorMessage }}</p>

        <div v-if="canResendVerification" class="resend-section">
          <p>Need a new verification link?</p>
          <button
            @click="showResendForm = true"
            v-if="!showResendForm"
            class="secondary-button"
          >
            Request New Link
          </button>

          <div v-if="showResendForm" class="resend-form">
            <input
              v-model="resendEmail"
              type="email"
              placeholder="Enter your email address"
              class="email-input"
              :disabled="resendingEmail"
            />
            <button
              @click="resendVerification"
              :disabled="!resendEmail || resendingEmail"
              class="primary-button"
            >
              {{ resendingEmail ? "Sending..." : "Send New Link" }}
            </button>
          </div>

          <div v-if="resendStatus === 'success'" class="resend-success">
            ✅ New verification email sent! Check your inbox.
          </div>
          <div v-if="resendStatus === 'error'" class="resend-error">
            ❌ Failed to send email. Please try again.
          </div>
        </div>

        <div class="action-buttons">
          <button @click="goToSignup" class="secondary-button">
            Back to Signup
          </button>
        </div>
      </div>

      <!-- Invalid Token State -->
      <div v-else class="error-state">
        <div class="error-icon">❌</div>
        <h2>Invalid Verification Link</h2>
        <p>This verification link is invalid or has expired.</p>
        <div class="action-buttons">
          <button @click="goToSignup" class="primary-button">
            Back to Signup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

const route = useRoute();
const router = useRouter();

// Reactive state
const isVerifying = ref(false);
const verificationStatus = ref<"success" | "error" | "already_verified" | null>(
  null,
);
const errorMessage = ref("");
const canResendVerification = ref(false);
const showResendForm = ref(false);
const resendEmail = ref("");
const resendingEmail = ref(false);
const resendStatus = ref<"success" | "error" | null>(null);

const verifyEmail = async (token: string) => {
  isVerifying.value = true;

  try {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.message && data.message.includes("already verified")) {
        verificationStatus.value = "already_verified";
      } else {
        verificationStatus.value = "success";
      }
    } else {
      throw new Error(data.detail || "Verification failed");
    }
  } catch (error) {
    verificationStatus.value = "error";

    if (error instanceof Error) {
      errorMessage.value = error.message;

      // Check if we should show resend option
      if (
        error.message.includes("expired") ||
        error.message.includes("Invalid")
      ) {
        canResendVerification.value = true;
      }
    } else {
      errorMessage.value = "An unexpected error occurred during verification";
    }
  } finally {
    isVerifying.value = false;
  }
};

const resendVerification = async () => {
  if (!resendEmail.value) return;

  resendingEmail.value = true;
  resendStatus.value = null;

  try {
    const response = await fetch(`${API_URL}/auth/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: resendEmail.value }),
    });

    if (response.ok) {
      resendStatus.value = "success";
      showResendForm.value = false;
    } else {
      throw new Error("Failed to send verification email");
    }
  } catch (error) {
    resendStatus.value = "error";
    console.error("Resend verification error:", error);
  } finally {
    resendingEmail.value = false;
  }
};

const goToLogin = () => {
  router.push("/login");
};

const goToDashboard = () => {
  router.push("/dashboard");
};

const goToSignup = () => {
  router.push("/signup");
};

onMounted(async () => {
  const token = route.query.token as string;

  if (!token) {
    verificationStatus.value = "error";
    errorMessage.value = "No verification token provided";
    return;
  }

  await verifyEmail(token);
});
</script>

<style scoped>
.email-verification-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.verification-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.loading-state,
.success-state,
.error-state,
.info-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.success-icon,
.error-icon,
.info-icon {
  font-size: 64px;
  margin-bottom: 8px;
}

h2 {
  color: #333;
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

p {
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.error-message {
  color: #e74c3c;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.primary-button,
.secondary-button {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 14px;
}

.primary-button {
  background: #667eea;
  color: white;
}

.primary-button:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.primary-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.secondary-button {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.secondary-button:hover {
  background: #667eea;
  color: white;
  transform: translateY(-1px);
}

.resend-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.resend-form {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.email-input {
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  min-width: 200px;
}

.email-input:focus {
  outline: none;
  border-color: #667eea;
}

.email-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.resend-success {
  color: #27ae60;
  font-weight: 500;
  margin-top: 12px;
}

.resend-error {
  color: #e74c3c;
  font-weight: 500;
  margin-top: 12px;
}

@media (max-width: 600px) {
  .verification-card {
    padding: 24px;
    margin: 10px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .resend-form {
    flex-direction: column;
  }

  .email-input {
    min-width: unset;
    width: 100%;
  }
}
</style>
