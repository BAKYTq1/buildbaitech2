'use client';
import styles from './Cart.module.scss';
import { ShoppingCart } from 'lucide-react';
import CartItem from '../cartItem/CartItem';
import Link from 'next/link';
import { useCart, useClearCart } from '@/lib/cart/hooks/hooks';
import { useTranslation } from 'react-i18next';
import Under from '../ui/under/Under';
import { useState } from 'react';
import CheckoutModal from './CheckoutModal.jsx';

export default function Cart() {
  const { t } = useTranslation();
  const { data: items = [], isLoading } = useCart();
  const { mutate: clearCart, isPending } = useClearCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const isEmpty = items.length === 0;

  const handleToggle = (id, checked) => {
    setSelectedIds(prev =>
      checked ? [...prev, id] : prev.filter(i => i !== id)
    );
  };

  const selectedItems = items.filter(item => selectedIds.includes(item.id));

  if (isLoading) return <div className="loader"></div>;

  return (
    <div className={`${styles.cartWrapper} container`}>
      <Under text={t('aboutCompany.breadcrumbs.home')} link={'/'} text1={t('cart.card')} />
      <h2 className={styles.title}>{t('cart.title')} ({items.length})</h2>

      {isEmpty ? (
        <div className={styles.emptyCart}>
          <ShoppingCart size={64} strokeWidth={1} />
          <h3>{t('cart.empty.title')}</h3>
          <p>{t('cart.empty.description')}</p>
          <Link href="/">
            <button className={styles.btnPrimary}>{t('cart.empty.goToCatalog')}</button>
          </Link>
        </div>
      ) : (
        <div className={styles.cartContent}>
          <div className={styles.itemsList}>
            {items?.map(item => (
              <CartItem
                key={item.id}
                item={item}
                checked={selectedIds.includes(item.id)}
                onToggle={(checked) => handleToggle(item.id, checked)}
              />
            ))}
          </div>

          <div className={styles.summary}>
            <button
              className={styles.btnPrimary}
              onClick={() => setShowCheckout(true)}
              disabled={selectedItems.length === 0}
            >
              {t('cart.checkout')} {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
            </button>

            <button
              className={styles.btnOutline}
              onClick={() => clearCart()}
              disabled={isPending}
            >
              {t('cart.clearAll')} 🗑️
            </button>
          </div>
        </div>
      )}

      {showCheckout && (
        <CheckoutModal
          items={selectedItems}
          allItems={items}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}