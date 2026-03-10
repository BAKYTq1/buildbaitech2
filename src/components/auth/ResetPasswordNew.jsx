"use client"
import React, { useState, useEffect, Suspense } from "react";
import "./ForgotPassword.scss";
import CloseRegister from "@/components/ui/auth/closeregister";
import InputField from "@/components/ui/auth/inputFeiled";
import Button from "@/components/ui/auth/buttton";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { usePasswordResetComplete } from "@/lib/auth/hooks/hooks";

function ResetPasswordNewContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetMutation = usePasswordResetComplete();

  useEffect(() => {
    const token = localStorage.getItem('reset_access_token');
    if (!token) {
      toast.error("Сессия истекла, начните заново");
      router.push('/forgot-password');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Введите пароль");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }
    if (password.length < 8) {
      toast.error("Пароль должен быть не менее 8 символов");
      return;
    }

    try {
      await resetMutation.mutateAsync({
        new_password: password,
        confirm_password: confirmPassword,
      });

      localStorage.removeItem('reset_access_token');
      localStorage.removeItem('reset_refresh_token');

      toast.success("Пароль успешно изменён");
      router.push("/login");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.response?.data?.new_password ||
        error?.response?.data?.confirm_password ||
        "Ошибка сброса пароля";
      toast.error(message);
    }
  };

  const isLoading = resetMutation.isPending;

  return (
    <div className="forgot-password-page-container">
      <CloseRegister onClose={() => router.push("/")} />
      <div className="forgot-password-page">
        <h2 className="forgot-password-page__title">Создайте новый пароль</h2>
        <h4 className="forgot-password-page__subtitle">Введите новый пароль для вашего аккаунта</h4>

        <form className="forgot-password-page__form" onSubmit={handleSubmit}>
          <InputField
            type="password"
            required
            placeholder="Введите новый пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <InputField
            type="password"
            required
            placeholder="Повторите новый пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />

          {resetMutation.isError && (
            <div className="forgot-password-page__error">
              {resetMutation.error?.response?.data?.message ||
                resetMutation.error?.response?.data?.detail ||
                resetMutation.error?.response?.data?.new_password ||
                "Ошибка сброса пароля"}
            </div>
          )}

          <Button
            type="submit"
            variant="dark-blue"
            loading={isLoading}
            disabled={isLoading}
          >
            Сохранить новый пароль
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordNew() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <ResetPasswordNewContent />
    </Suspense>
  );
}