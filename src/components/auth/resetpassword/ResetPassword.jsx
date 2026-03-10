"use client"
import React, { useState, useRef, Suspense, useEffect } from 'react';
import './ResetPasswordCode.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import CloseRegister from '@/components/ui/auth/closeregister';
import Button from '@/components/ui/auth/buttton';
import { usePasswordResetVerify } from '@/lib/auth/hooks/hooks';
import { useTranslation } from 'react-i18next';

export function ResetPasswordCodeContent() {
  const { t } = useTranslation();
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');

  const verifyCodeMutation = usePasswordResetVerify();

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    } else {
      toast.error(t('resetPasswordCode.messages.emailNotFound'));
      setTimeout(() => router.push('/forgot-password'), 2000);
    }
  }, [searchParams, router, t]);  

  const handleChange = (index, value) => {
    if (value !== '' && !/^\d$/.test(value)) return;

    const newCode = [...code];
    
    if (value.length > 1) {
      const digits = value.slice(0, 4).split('');
      digits.forEach((digit, i) => {
        if (index + i < 4 && /^\d$/.test(digit)) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);
      const nextEmptyIndex = newCode.findIndex(d => d === '');
      const focusIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex;
      setTimeout(() => inputRefs.current[focusIndex]?.focus(), 0);
      return;
    }

    newCode[index] = value;
    setCode(newCode);
    if (value !== '' && index < 3) {
      setTimeout(() => inputRefs.current[index + 1]?.focus(), 0);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newCode = [...code];
      if (code[index] !== '') {
        newCode[index] = '';
        setCode(newCode);
      } else if (index > 0) {
        newCode[index - 1] = '';
        setCode(newCode);
        setTimeout(() => inputRefs.current[index - 1]?.focus(), 0);
      }
      return;
    }
    if (e.key === 'Delete') {
      e.preventDefault();
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      return;
    }
    if (e.key === 'ArrowLeft' && index > 0) { e.preventDefault(); inputRefs.current[index - 1]?.focus(); }
    if (e.key === 'ArrowRight' && index < 3) { e.preventDefault(); inputRefs.current[index + 1]?.focus(); }
    if (e.key === 'Enter' && code.join('').length === 4) handleSubmit(e);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const digits = pastedData.replace(/\D/g, '').slice(0, 4);
    if (digits.length === 4) {
      setCode(digits.split(''));
      setTimeout(() => inputRefs.current[3]?.focus(), 0);
    } else {
      toast.error(t('resetPasswordCode.messages.paste4Digits'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (fullCode.length !== 4) {
      toast.error(t('resetPasswordCode.messages.enter4Digits'));
      return;
    }
    if (!email) {
      toast.error(t('resetPasswordCode.messages.emailNotFound'));
      return;
    }

    try {
      const result = await verifyCodeMutation.mutateAsync({ email, otp: fullCode });

      // Сохраняем токены из ответа
      if (result?.access) {
        localStorage.setItem('reset_access_token', result.access);
      }
      if (result?.refresh) {
        localStorage.setItem('reset_refresh_token', result.refresh);
      }

      // Переходим на страницу нового пароля — токен уже в localStorage
      router.push('/reset-password-new');
    } catch (error) {
      const errorMessage = 
        error?.response?.data?.message || 
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        t('resetPasswordCode.messages.invalidCode');
      
      toast.error(errorMessage);
      setCode(['', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    }
  };

  const isLoading = verifyCodeMutation.isPending;

  if (!email) {
    return (
      <div>
        <CloseRegister onClose={() => router.push("/")} />
        <div className="forgot-password-page-container">
          <div className="forgot-password-page">
            <div className="text-center p-6">{t('resetPasswordCode.loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CloseRegister onClose={() => router.push("/")} />
      <div className="forgot-password-page-container">
        <div className="forgot-password-page">
          <h2 className="forgot-password-page__title">
            {t('resetPasswordCode.title')}
          </h2>
          <h4 className="forgot-password-page__subtitle">
            {t('resetPasswordCode.subtitle')} {email}
          </h4>
          
          <form className="forgot-password-page__form" onSubmit={handleSubmit}>
            <div className="code-input-container">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="code-input"
                  autoFocus={index === 0}
                  disabled={isLoading}
                  autoComplete="off"
                />
              ))}
            </div>

            {verifyCodeMutation.isError && (
              <div className="forgot-password-page__error">
                {verifyCodeMutation.error?.response?.data?.message || 
                 verifyCodeMutation.error?.response?.data?.detail || 
                 verifyCodeMutation.error?.response?.data?.error ||
                 verifyCodeMutation.error?.response?.data?.non_field_errors ||
                 t('resetPasswordCode.messages.invalidCode')}
              </div>
            )}
            
            <Button
              type="submit" 
              variant="dark-blue"
              loading={verifyCodeMutation.isPending}
              disabled={isLoading || code.join('').length !== 4}
            >
              {t('resetPasswordCode.button')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordCode() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div>{t('resetPasswordCode.loading')}</div>}>
      <ResetPasswordCodeContent />
    </Suspense>
  );
}