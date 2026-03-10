// services/authService.js
import Cookies from 'js-cookie';
import { $api } from '../../../../API/api';

export const authService = {
  register: async (formData) => {
    const { data } = await $api.post('/api/auth/register/', formData);
    return data;
  },

  // Подтверждение регистрации по OTP
verifyRegistration: async (email, otp) => {
  const { data } = await $api.post('/api/auth/verify-registration/', {
    email,
    otp
  });
  return data;
},
  // Повторная отправка кода активации
  resendActivationCode: async (email) => {
    const { data } = await $api.post('/api/auth/resend-activation-code/', {
      email
    });
    return data;
  },

  // Вход в систему
  login: async (credentials) => {
    const { data } = await $api.post('/api/auth/login/', credentials);
    if (data.access) {
      Cookies.set('access', data.access, { expires: 7 });
    }
    if (data.refresh) {
      Cookies.set('refresh', data.refresh, { expires: 30 });
    }
    return data;
  },

  // Выход из системы
  logout: async () => {
    try {
      const { data } = await $api.post('/api/auth/logout/');
      return data;
    } finally {
      Cookies.remove('access');
      Cookies.remove('refresh');
    }
  },

  // Получение текущего пользователя (если есть такой endpoint)
  getMe: async () => {
    const { data } = await $api.get('/api/profile/me/');
    return data;
  },

  // Запрос сброса пароля
  passwordResetRequest: async (email) => {
    const { data } = await $api.post('/api/password-reset/request/', {
      email
    });
    return data;
  },

  // Подтверждение кода сброса пароля
  passwordResetVerify: async (email, otp) => {
    const { data } = await $api.post('/api/password-reset/verify/', {
      email,
      otp
    });
    return data;
  },

  // Завершение сброса пароля
passwordResetComplete: async (new_password, confirm_password) => {
  const token = localStorage.getItem('reset_access_token');
  const { data } = await $api.post('/api/password-reset/complete/', 
    { new_password, confirm_password },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
},
    // ========== ПРОФИЛЬ ==========

  // Получить все профили (админ)
  getAllProfiles: async () => {
    const { data } = await $api.get('/api/profile/all/');
    return data;
  },

  // Получить профиль текущего пользователя
  getMyProfile: async () => {
    const { data } = await $api.get('/api/profile/me/');
    return data;
  },

  // Полное обновление профиля
  updateProfile: async (profileData) => {
    const { data } = await $api.put('/api/profile/me/', profileData);
    return data;
  },

  // Частичное обновление профиля
  patchProfile: async (profileData) => {
    const { data } = await $api.patch('/api/profile/me/', profileData);
    return data;
  },

  // Удалить пользователя по ID (админ)
  deleteUser: async (userId) => {
    const { data } = await $api.delete(`/api/users/${userId}/`);
    return data;
  }
};