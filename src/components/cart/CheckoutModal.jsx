'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import styles from './CheckoutModal.module.scss';
import { $api } from '../../../API/api';

export default function CheckoutModal({ items, allItems, onClose }) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [step, setStep] = useState('loading');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', phone_number: '' });
  const [payment, setPayment] = useState('cash');

  useEffect(() => {
    $api.get('/addressbook/addresses/')
      .then(({ data }) => {
        const list = data?.results || [];
        if (list.length === 0) {
          setStep('no-address');
        } else {
          setAddresses(list);
          const primary = list.find(a => a.is_primary) || list[0];
          setSelectedAddressId(primary.id);
          setForm({
            first_name: primary.first_name || '',
            last_name: primary.last_name || '',
            phone_number: '',
          });
          setStep('form');
        }
      })
      .catch(() => setStep('no-address'));
  }, []);

  const handleAddressChange = (id) => {
    setSelectedAddressId(Number(id));
    const found = addresses.find(a => a.id === Number(id));
    if (found) {
      setForm(f => ({
        ...f,
        first_name: found.first_name || '',
        last_name: found.last_name || '',
      }));
    }
  };

  const orderMutation = useMutation({
    mutationFn: async (orderData) => {
      // Удаляем невыбранные товары из корзины
      const unselectedItems = allItems.filter(
        item => !items.find(selected => selected.id === item.id)
      );

      await Promise.all(
        unselectedItems.map(item => $api.delete(`/cart/cart-items/${item.id}/`))
      );

      // Создаём заказ (бэкенд берёт оставшиеся товары из корзины)
      const { data } = await $api.post('/ordering/orders/', orderData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['cart']);
      setCreatedOrder(data);
      setStep('success');
    },
    onError: (error) => {
      const msg = error?.response?.data?.detail ||
                  error?.response?.data?.message ||
                  JSON.stringify(error?.response?.data) ||
                  t('checkoutModal.messages.orderError');
      toast.error(msg);
    }
  });

  const payMutation = useMutation({
    mutationFn: async (orderId) => {
      const { data } = await $api.post(`/ordering/orders/${orderId}/pay/`);
      return data;
    },
    onSuccess: (data) => {
      if (data?.payment_url) {
        window.location.href = data.payment_url;
      } else {
        toast.success(t('checkoutModal.messages.paymentSuccess'));
        onClose();
        router.push('/orders');
      }
    },
    onError: (error) => {
      const msg = error?.response?.data?.detail ||
                  error?.response?.data?.message ||
                  t('checkoutModal.messages.paymentError');
      toast.error(msg);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !selectedAddressId) {
      toast.error(t('checkoutModal.messages.fillAllFields'));
      return;
    }
    orderMutation.mutate({
      first_name: form.first_name,
      last_name: form.last_name,
      phone_number: form.phone_number,
      address: selectedAddressId,
      payment_method: payment,
    });
  };

  const handlePay = () => {
    if (createdOrder?.id) payMutation.mutate(createdOrder.id);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label={t('checkoutModal.close')}>
          <X size={20} />
        </button>

        {step === 'loading' && (
          <div className={styles.center}><div className="loader" /></div>
        )}

        {step === 'no-address' && (
          <div className={styles.noAddress}>
            <h3 className={styles.noAddressTitle}>{t('checkoutModal.noAddress.title')}</h3>
            <p className={styles.noAddressText}>
              {t('checkoutModal.noAddress.description')}
            </p>
            <button
              className={styles.btnPrimary}
              onClick={() => { onClose(); router.push('/profile?tab=address'); }}
            >
              {t('checkoutModal.noAddress.addButton')}
            </button>
          </div>
        )}

        {step === 'form' && (
          <>
            <h3 className={styles.title}>{t('checkoutModal.form.title')}</h3>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.left}>
                <div className={styles.orderList}>
                  {items.map((item, i) => {
                    const img = item.product?.existing_images?.[0]?.image;
                    return (
                      <div key={item.id} className={styles.orderItem}>
                        <span className={styles.orderNum}>{i + 1}</span>
                        <div className={styles.orderCard}>
                          <div className={styles.orderImg}>
                            {img
                              ? <img src={img} alt={item.product?.name} />
                              : <div className={styles.orderImgPlaceholder} />
                            }
                          </div>
                          <div className={styles.orderInfo}>
                            <p className={styles.orderName}>{item.product?.name}</p>
                            <p className={styles.orderMeta}>
                              {t('checkoutModal.form.amount')}: {(item.product?.price * item.quantity)?.toLocaleString()} {t('checkoutModal.form.currency')}
                            </p>
                            <p className={styles.orderMeta}>
                              {item.product?.name} ({item.quantity} {t('checkoutModal.form.pcs')})
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={styles.right}>
                <div className={styles.field}>
                  <label>* {t('checkoutModal.form.firstName')}</label>
                  <input
                    placeholder={t('checkoutModal.form.firstNamePlaceholder')}
                    value={form.first_name}
                    onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                  />
                </div>
                <div className={styles.field}>
                  <label>* {t('checkoutModal.form.lastName')}</label>
                  <input
                    placeholder={t('checkoutModal.form.lastNamePlaceholder')}
                    value={form.last_name}
                    onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                  />
                </div>
                <div className={styles.field}>
                  <label>* {t('checkoutModal.form.phone')}</label>
                  <input
                    placeholder="+996 XXX XXX XXX"
                    value={form.phone_number}
                    onChange={e => setForm(f => ({ ...f, phone_number: e.target.value }))}
                  />
                </div>
                <div className={styles.field}>
                  <label>* {t('checkoutModal.form.address')}</label>
                  <select
                    value={selectedAddressId || ''}
                    onChange={e => handleAddressChange(e.target.value)}
                  >
                    {addresses.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.address_1}{a.address_2 ? `, ${a.address_2}` : ''}, {a.region}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.paymentSection}>
                  <p className={styles.paymentTitle}>{t('checkoutModal.form.payment')}</p>
                  <label className={styles.paymentOption}>
                    <input type="checkbox" checked={payment === 'cash'} onChange={() => setPayment('cash')} />
                    <span>{t('checkoutModal.form.cash')}</span>
                  </label>
                  <label className={styles.paymentOption}>
                    <input type="checkbox" checked={payment === 'qr'} onChange={() => setPayment('qr')} />
                    <span>{t('checkoutModal.form.qrPayment')}</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={orderMutation.isPending}
                >
                  {orderMutation.isPending ? t('checkoutModal.form.processing') : t('checkoutModal.form.submitButton')}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 'success' && createdOrder && (
          <div className={styles.successBlock}>
            <h3 className={styles.title}>{t('checkoutModal.success.title')}</h3>
            <div className={styles.orderSummary}>
              <p className={styles.summaryRow}>
                <span>{t('checkoutModal.success.deliveryAddress')}:</span>
                <span>{createdOrder.address}</span>
              </p>
              <p className={styles.summaryRow}>
                <span>{t('checkoutModal.success.expectedDate')}:</span>
                <span>{createdOrder.created_at}</span>
              </p>
              <p className={styles.summaryRow}>
                <span>{t('checkoutModal.success.totalAmount')}:</span>
                <span></span>
              </p>
              <p className={styles.summaryTotal}>
                {Number(createdOrder.total_price).toLocaleString()} {t('checkoutModal.form.currency')}
              </p>
            </div>
            <button
              className={styles.btnPrimary}
              onClick={handlePay}
              disabled={payMutation.isPending}
            >
              {payMutation.isPending ? t('checkoutModal.success.processingPayment') : t('checkoutModal.success.payButton')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}