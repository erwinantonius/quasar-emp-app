<template>
    <q-page class="login-page">
        <div class="login-container">
            <!-- Background decoration -->
            <div class="login-bg-decoration"></div>

            <!-- Login Card -->
            <q-card class="login-card" :class="{ 'mobile-card': $q.screen.lt.md }">
                <div class="row no-wrap full-height">
                    <!-- Left Panel - Brand Section (Desktop Only) -->
                    <div
                        v-if="$q.screen.gt.sm"
                        class="col-6 brand-panel"
                    >
                        <div class="brand-content">
                            <div class="brand-logo">
                                <q-avatar size="80px" class="brand-avatar">
                                    <q-img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/business-logo-design-template-78655edda18bc1196ab28760f1535baa_screen.jpg?ts=1735230095"/>
                                </q-avatar>
                            </div>
                            <div class="brand-text">
                                <h1 class="brand-title">Employee</h1>
                                <h2 class="brand-subtitle">Hub</h2>
                                <p class="brand-description">
                                    Streamline your workplace management with our comprehensive employee hub solution.
                                </p>
                            </div>
                            <div class="brand-features">
                                <div class="feature-item">
                                    <q-icon name="check_circle" color="#606C38" size="sm"/>
                                    <span>Easy Management</span>
                                </div>
                                <div class="feature-item">
                                    <q-icon name="check_circle" color="#606C38" size="sm"/>
                                    <span>Real-time Updates</span>
                                </div>
                                <div class="feature-item">
                                    <q-icon name="check_circle" color="#606C38" size="sm"/>
                                    <span>Secure Platform</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Panel - Form Section -->
                    <div :class="[$q.screen.gt.sm ? 'col-6' : 'col-12', 'form-panel']">
                        <div class="form-content">
                            <!-- Mobile Brand Header -->
                            <div v-if="$q.screen.lt.md" class="mobile-brand">
                                <q-avatar size="60px" class="mobile-brand-avatar">
                                    <q-img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/business-logo-design-template-78655edda18bc1196ab28760f1535baa_screen.jpg?ts=1735230095"/>
                                </q-avatar>
                                <div class="mobile-brand-text">
                                    <h3>Employee Hub</h3>
                                    <p>Welcome back! Please sign in to continue.</p>
                                </div>
                            </div>

                            <!-- Tab Panels -->
                            <q-tab-panels v-model="panel" animated class="form-panels">
                                <!-- Login Panel -->
                                <q-tab-panel name="login" class="login-panel">
                                    <div class="panel-header">
                                        <h4 v-if="$q.screen.gt.sm" class="panel-title">Welcome Back</h4>
                                        <p class="panel-subtitle">Sign in to your account</p>
                                    </div>

                                    <q-form @submit.prevent="login" class="login-form">
                                        <div class="form-group">
                                            <label class="form-label">Email Address</label>
                                            <q-input
                                                outlined
                                                :disable="isProcessing"
                                                v-model="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                class="form-input"
                                            >
                                                <template #prepend>
                                                    <q-icon name="mail" color="primary"/>
                                                </template>
                                            </q-input>
                                        </div>

                                        <div class="form-group">
                                            <label class="form-label">Password</label>
                                            <q-input
                                                outlined
                                                :disable="isProcessing"
                                                v-model="password"
                                                :type="passwordType"
                                                placeholder="Enter your password"
                                                class="form-input"
                                            >
                                                <template #prepend>
                                                    <q-icon name="lock" color="primary"/>
                                                </template>
                                                <template #append>
                                                    <q-btn
                                                        flat
                                                        round
                                                        dense
                                                        :icon="passwordType === 'password' ? 'visibility' : 'visibility_off'"
                                                        @click="changePasswordType"
                                                        class="password-toggle"
                                                    />
                                                </template>
                                            </q-input>
                                        </div>

                                        <div class="form-actions">
                                            <q-btn
                                                flat
                                                no-caps
                                                size="sm"
                                                @click="panel = 'forgot'"
                                                class="forgot-btn"
                                            >
                                                Forgot Password?
                                            </q-btn>
                                        </div>

                                        <q-btn
                                            :loading="isProcessing"
                                            label="Sign In"
                                            class="login-btn"
                                            type="submit"
                                            color="primary"
                                            size="lg"
                                            no-caps
                                        />
                                    </q-form>
                                </q-tab-panel>

                                <!-- Forgot Password Panel -->
                                <q-tab-panel name="forgot" class="forgot-panel">
                                    <div class="panel-header">
                                        <h4 class="panel-title">Reset Password</h4>
                                        <p class="panel-subtitle">Enter your email to receive reset instructions</p>
                                    </div>

                                    <q-form @submit.prevent="sendResetPassword" class="forgot-form">
                                        <div class="form-group">
                                            <label class="form-label">Email Address</label>
                                            <q-input
                                                outlined
                                                :disable="isProcessing"
                                                v-model="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                class="form-input"
                                            >
                                                <template #prepend>
                                                    <q-icon name="mail" color="primary"/>
                                                </template>
                                            </q-input>
                                        </div>

                                        <q-btn
                                            :loading="isProcessing"
                                            label="Send Reset Link"
                                            class="reset-btn"
                                            type="submit"
                                            color="primary"
                                            size="lg"
                                            no-caps
                                        />

                                        <q-btn
                                            flat
                                            no-caps
                                            class="back-btn"
                                            @click="panel = 'login'"
                                        >
                                            <q-icon name="arrow_back" size="sm" class="q-mr-sm"/>
                                            Back to Sign In
                                        </q-btn>
                                    </q-form>
                                </q-tab-panel>
                            </q-tab-panels>
                        </div>
                    </div>
                </div>
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from 'stores/auth.js';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { AuthApi } from 'src/api';
import { getErrorMessage } from '../utils/error.handle';

const email = ref('tony.stark@astra.co.id');
const password = ref('astra123');
const isProcessing = ref(false);
const passwordType = ref('password');

const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();

const panel = ref('login'); // login | forgot

const login = async () => {
    try {
        isProcessing.value = true;
        await authStore.login({
            email: email.value,
            password: password.value,
        });

        await router.push({ name: 'home' });

        $q.notify({
            type: 'positive',
            message: 'Successfully logged in',
        });
        isProcessing.value = false;
    } catch (error) {
        isProcessing.value = false;
        const errorMessage = getErrorMessage(error);
        $q.notify({ type: 'negative', message: errorMessage });
    }

    return;
};

const changePasswordType = () => {
    if (passwordType.value === 'password') {
        passwordType.value = 'text';
    } else if (passwordType.value === 'text') {
        passwordType.value = 'password';
    }
};

const sendResetPassword = async () => {
    try {
        await AuthApi.sendResetPassword({ email: email.value });
        $q.notify({ type: 'positive', message: 'Reset password sent to your email' });
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        $q.notify({ type: 'negative', message: errorMessage });
    }
};

onMounted(() => {
    console.log(process.env.NODE_ENV);
    $q.dark.set(false);
});

</script>
<style scoped>
/* Main Layout */
.login-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f1faee 0%, #a8dadc 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
}

.login-container {
    position: relative;
    width: 100%;
    max-width: 1000px;
    z-index: 10;
}

.login-bg-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: 0;
    pointer-events: none;
}

/* Login Card */
.login-card {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(29, 53, 87, 0.08);
    overflow: hidden;
    min-height: 600px;
    max-height: 90vh;
    position: relative;
    z-index: 20;
}

.mobile-card {
    margin: 10px;
    border-radius: 12px;
    min-height: auto;
}

/* Brand Panel */
.brand-panel {
    background: linear-gradient(180deg, #f1faee 70%, #a8dadc 100%);
    color: #1d3557;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    position: relative;
    overflow: hidden;
    border-right: 1px solid #a8dadc;
    min-height: 600px;
    height: 100%;
}

.brand-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f1faee;
background-image: url("https://www.transparenttextures.com/patterns/crissxcross.png");
/* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
    z-index: 1;
}

.brand-content {
    text-align: center;
    position: relative;
    z-index: 2;
}

.brand-logo {
    margin-bottom: 30px;
}

.brand-avatar {
    border: 4px solid rgba(96, 108, 56, 0.2);
}

.brand-title {
    font-size: 3rem;
    font-weight: 700;
    margin: 0;
    text-shadow: none;
    color: #283618;
}

.brand-subtitle {
    font-size: 2rem;
    font-weight: 300;
    margin: 0 0 20px 0;
    opacity: 0.9;
    color: #DDA15E;
}

.brand-description {
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0 0 30px 0;
    opacity: 0.8;
}

.brand-features {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1rem;
    opacity: 0.9;
}

/* Form Panel */
.form-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: #ffffff;
}

.form-content {
    width: 100%;
    max-width: 400px;
}

/* Mobile Brand */
.mobile-brand {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #e8ede0;
}

.mobile-brand-avatar {
    margin-bottom: 15px;
}

.mobile-brand-text h3 {
    margin: 0 0 10px 0;
    color: #283618;
    font-weight: 600;
}

.mobile-brand-text p {
    margin: 0;
    color: #606C38;
    font-size: 0.9rem;
}

/* Form Panels */
.form-panels {
    background: transparent;
    box-shadow: none;
}

.panel-header {
    text-align: center;
    margin-bottom: 30px;
}

.panel-title {
    margin: 0 0 10px 0;
    color: #283618;
    font-weight: 600;
    font-size: 1.8rem;
}

.panel-subtitle {
    margin: 0;
    color: #606C38;
    font-size: 1rem;
}

/* Form Styles */
.login-form,
.forgot-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-label {
    font-weight: 500;
    color: #283618;
    font-size: 0.9rem;
}

.form-input {
    border-radius: 8px;
}

.form-input :deep(.q-field__control) {
    border-radius: 8px;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: -10px;
}

.forgot-btn {
    color: #BC6C25;
    font-weight: 500;
}

.login-btn,
.reset-btn {
    width: 100%;
    height: 50px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    background: #606C38;
    color: #ffffff;
    margin-top: 10px;
    border: none;
}

.login-btn:hover,
.reset-btn:hover {
    background: #283618;
}

.back-btn {
    width: 100%;
    margin-top: 20px;
    color: #606C38;
    font-weight: 500;
}

.password-toggle {
    color: #BC6C25;
}

/* Responsive Design */
@media (max-width: 768px) {
    .login-page {
        padding: 10px;
    }

    .form-panel {
        padding: 20px;
    }

    .panel-title {
        font-size: 1.5rem;
    }

    .brand-title {
        font-size: 2rem;
    }

    .brand-subtitle {
        font-size: 1.5rem;
    }
}

@media (max-width: 480px) {
    .login-page {
        padding: 5px;
    }

    .form-panel {
        padding: 15px;
    }

    .mobile-brand {
        margin-bottom: 20px;
    }

    .panel-header {
        margin-bottom: 20px;
    }
}
</style>
