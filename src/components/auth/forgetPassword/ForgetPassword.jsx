"use client"
import React, { useState } from "react";
import "./ForgotPassword.scss";
import CloseRegister from "@/components/ui/auth/closeregister";
import InputField from "@/components/ui/auth/inputFeiled";
import Button from "@/components/ui/auth/buttton";
import { useRouter } from "next/navigation";
import { usePasswordResetRequest } from "@/lib/auth/hooks/hooks";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

function ForgotPassword() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  
  const passwordResetMutation = usePasswordResetRequest();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error(t('forgotPassword.messages.enterEmail'));
      return;
    }

    try {
      await passwordResetMutation.mutateAsync({ email });
      
      toast.success(t('forgotPassword.messages.codeSent') + ' ' + email);
      
      router.push(`/resetpassword?email=${encodeURIComponent(email)}`);
    } catch (error) {
      }
  };

  const isLoading = passwordResetMutation.isPending;

  return (
    <div className="forgot-password-page-container">
      <CloseRegister onClose={() => router.push("/")} />
      <div className="forgot-password-page">
        <h2 className="forgot-password-page__title">
          {t('forgotPassword.title')}
        </h2>
        <h4 className="forgot-password-page__subtitle">
          {t('forgotPassword.subtitle')}
        </h4>
        
        <form className="forgot-password-page__form" onSubmit={handleSubmit}>
          <InputField 
            type="email" 
            required 
            placeholder={t('forgotPassword.placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />

          {passwordResetMutation.isError && (
            <div className="forgot-password-page__error">
              {passwordResetMutation.error?.response?.data?.message || 
               passwordResetMutation.error?.response?.data?.detail ||
               passwordResetMutation.error?.response?.data?.email ||
               t('forgotPassword.messages.sendError')}
            </div>
          )}

          <Button 
            type="submit" 
            variant="dark-blue"
            loading={isLoading}
            disabled={isLoading}
          >
            {t('forgotPassword.button')}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;