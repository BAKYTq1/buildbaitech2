"use client";

import Image from 'next/image';
import styles from './Cart.module.scss';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useDeleteCartItem, useUpdateCartItem } from '@/lib/cart/hooks/hooks';
import { useTranslation } from 'react-i18next';

export default function CartItem({ item, checked, onToggle }) {
  const { t } = useTranslation();
  const product = item.product || {};
  const { mutate: deleteItem } = useDeleteCartItem();
  const { mutate: updateItem, isPending } = useUpdateCartItem();

  const handleDelete = () => {
    if (item.id) deleteItem(item.id);
  };

  const handleIncrement = () => {
    updateItem({ id: item.id, product_id: product.id, quantity: item.quantity + 1 });
  };

  const handleDecrement = () => {
    if (item.quantity <= 1) return;
    updateItem({ id: item.id, product_id: product.id, quantity: item.quantity - 1 });
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageBlock}>
        <span className={styles.badge}>
          {product.is_available ? t('cartItem.inStock') : t('cartItem.outOfStock')}
        </span>
        {product.existing_images?.[0]?.image && (
          <Image
            src={product.existing_images[0].image}
            alt={product.name}
            width={100}
            height={100}
          />
        )}
      </div>

      <div className={styles.infoBlock}>
        <div className={styles.header}>
          <span className={styles.article}>{t('cartItem.article')}: {product.article}</span>
          <button className={styles.deleteBtn} onClick={handleDelete}>
            <Trash2 size={18} />
          </button>
        </div>

        <h4 className={styles.itemTitle}>{product.name}</h4>
        <p className={styles.description}>
          {product.description?.slice(0, 85)}
          {product.description?.length > 85 ? '...' : ''}
        </p>

        <div className={styles.priceRow}>
         <div className={styles.bonus}>{Number((product.bonus || 0) * item.quantity).toLocaleString()} {t('cartItem.bonuses')}</div>
          <div className={styles.price}>
            {Number(item.total_price || product.price || 0).toLocaleString()} {t('cartItem.currency')}
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.counter}>
            <button onClick={handleDecrement} disabled={isPending || item.quantity <= 1}>
              <Minus size={16} />
            </button>
            <span>{item.quantity}</span>
            <button onClick={handleIncrement} disabled={isPending}>
              <Plus size={16} />
            </button>
          </div>

          <input
            type="checkbox"
            className={styles.checkbox}
            checked={checked}
            onChange={e => onToggle(e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
} 