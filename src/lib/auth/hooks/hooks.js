// hooks/mutations/useAuth.js
'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authService } from "../api/api";
import toast from "react-hot-toast";

// Регистрация
export const useRegister = () => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: (formData) => authService.register(formData),
    onSuccess: () => {
      toast.success('Регистрация успешна! Проверьте email для подтверждения.');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 
                     error.response?.data?.detail || 
                     'Ошибка регистрации';
      toast.error(message);
    }
  });
};

export const useVerifyRegistration = () => {
  const router = useRouter();
  
  return useMutation({
    mutationKey: ['verify-registration'],
    mutationFn: ({ email, otp }) => authService.verifyRegistration(email, otp),
    onSuccess: () => {
      toast.success('Email подтвержден! Теперь вы можете войти.');
      router.push('/');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 
                     error.response?.data?.detail || 
                     'Неверный код';
      toast.error(message);
    }
  });
};

// Повторная отправка кода активации
export const useResendActivationCode = () => {
  return useMutation({
    mutationKey: ['resend-activation-code'],
    mutationFn: ({email}) => authService.resendActivationCode(email),
    onSuccess: () => {
      toast.success('Код отправлен повторно на ваш email');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 
                     error.response?.data?.detail || 
                     'Ошибка отправки кода';
      toast.error(message);
    }
  });
};

// Логин
export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['login'],
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      console.log('Login data:', data);
      
      // ✅ СНАЧАЛА очищаем все старые данные
      queryClient.clear();
      localStorage.clear();
      
      // Обновляем кеш пользователя
      if (data.user) {
        queryClient.setQueryData(['auth', 'user'], data.user);
        queryClient.setQueryData(['profile', 'me'], data.user);
      }

      const isAdmin = data.user?.role === 'admin' || 
                      data.role || 
                      data.user?.is_staff || 
                      data.user?.is_superuser;

      if (isAdmin) {
        // ✅ Для админа используем access_token (единообразие)
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAdmin', 'true');
        
        toast.success('Добро пожаловать!');
        
        // Уведомляем об изменении авторизации
        window.dispatchEvent(new Event('authChange'));
        
        router.push('/admin');
      } else {
        // ✅ Для обычного пользователя тоже access_token
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success('Вход выполнен успешно!');
        
        // Уведомляем об изменении авторизации
        window.dispatchEvent(new Event('authChange'));
        
        router.push('/');
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || 
                     error.response?.data?.detail || 
                     'Неверный email или пароль';
      toast.error(message);
    }
  });
};

// Логаут
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: authService.logout,
    onSuccess: () => {
      // ✅ Полная очистка
      queryClient.clear();
      localStorage.clear();
      Cookies.remove('access');
      Cookies.remove('refresh');
      
      // Уведомляем об изменении авторизации
      window.dispatchEvent(new Event('authChange'));
      
      toast.success('Вы вышли из системы');
      router.push('/');
    },
    onError: (error) => {
      // Даже при ошибке logout делаем локальный выход
      queryClient.clear();
      localStorage.clear();
      Cookies.remove('access');
      Cookies.remove('refresh');
      
      // Уведомляем об изменении авторизации
      window.dispatchEvent(new Event('authChange'));
      
      router.push('/login');
    }
  });
};

// Запрос на сброс пароля
export const usePasswordResetRequest = () => {
  return useMutation({
    mutationKey: ['password-reset-request'],
    mutationFn: ({ email }) => authService.passwordResetRequest(email),
    onSuccess: () => {
      toast.success('Код для сброса пароля отправлен на ваш email');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 
                     error.response?.data?.detail || 
                     error.response?.data?.email || 
                     'Ошибка отправки';
      toast.error(message);
    }
  });
};

// Подтверждение кода сброса пароля
export const usePasswordResetVerify = () => {
  return useMutation({
    mutationKey: ['password-reset-verify'],
    mutationFn: ({ email, otp }) => authService.passwordResetVerify(email, otp),
    onSuccess: () => {
      toast.success('Код подтвержден');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 
                     error.response?.data?.detail || 
                     'Неверный код';
      toast.error(message);
    }
  });
};

// Завершение сброса пароля
export const usePasswordResetComplete = () => {
  const router = useRouter();
  
  return useMutation({
    mutationKey: ['password-reset-complete'],
    mutationFn: ({ new_password, confirm_password}) => 
      authService.passwordResetComplete(new_password, confirm_password),
    onSuccess: () => {
      toast.success('Пароль успешно изменен!');
      router.push('/login');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 
                     error.response?.data?.detail || 
                     'Ошибка сброса пароля';
      toast.error(message);
    }
  });
};

export const useAllProfiles = () => {
  return useQuery({
    queryKey: ['profiles', 'all'],
    queryFn: authService.getAllProfiles,
  });
};

// ✅ Получить профиль текущего пользователя
export const useMyProfile = (options = {}) => {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: authService.getMyProfile,
    enabled: options.enabled !== false, // ✅ Поддержка enabled
    retry: false,
    staleTime: 0,
  });
};

// Обновить профиль (полное обновление)
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      toast.success('Профиль успешно обновлен');
    },
    onError: (error) => {
      const errorMessage = 
        error?.response?.data?.message || 
        error?.response?.data?.detail ||
        'Ошибка обновления профиля';
      toast.error(errorMessage);
    }
  });
};

// Обновить профиль (частичное обновление)
export const usePatchProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.patchProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      toast.success('Профиль успешно обновлен');
    },
    onError: (error) => {
      const errorMessage = 
        error?.response?.data?.message || 
        error?.response?.data?.detail ||
        'Ошибка обновления профиля';
      toast.error(errorMessage);
    }
  });
};

// Удалить пользователя (админ)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles', 'all'] });
      toast.success('Пользователь удален');
    },
    onError: (error) => {
      const errorMessage = 
        error?.response?.data?.message || 
        error?.response?.data?.detail ||
        'Ошибка удаления пользователя';
      toast.error(errorMessage);
    }
  });
};