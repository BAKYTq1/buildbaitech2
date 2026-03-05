'use client'
import { useState, useEffect } from "react";
import "./ProductCard.scss";
import { IoCartOutline, IoCart, IoClose } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { productApi } from "@/lib/products/api/useProducts";
import { useTranslation } from "react-i18next";
import { useCart, useCreateCartItem, useDeleteCartItem } from "@/lib/cart/hooks/hooks";

const ProductCard = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [count, setCount] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { t } = useTranslation();

  const { data: cartItems } = useCart();
  const { mutate: addToCart, isPending: isAdding } = useCreateCartItem();
  const { mutate: deleteFromCart, isPending: isDeleting } = useDeleteCartItem();

  const cartItem = cartItems?.find(item => item.product?.id === product?.id || item.product_id === product?.id);
  const isInCart = !!cartItem;

  useEffect(() => {
    if (cartItem?.quantity) {
      setCount(cartItem.quantity);
    }
  }, [cartItem]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productApi.getById(productId);
        setProduct(data);
        const images = data.existing_images?.map((img) => img.image) || [];
        setActiveImage(images[0] || null);
      } catch (err) {
        console.error("Ошибка загрузки товара:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const images = product?.existing_images?.map((img) => img.image) || [];

  const increment = () => setCount((c) => c + 1);
  const decrement = () => count > 1 && setCount((c) => c - 1);

  const handleCartClick = () => {
    if (!product?.id) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    if (isInCart) {
      deleteFromCart(cartItem.id);
    } else {
      addToCart({ product_id: product.id, quantity: count });
    }
  };

  if (loading) return <div className="loader"></div>;
  if (!product) return <div className="product text-center">{t('productCard.notFound')}</div>;

  return (
    <>
      <div className="product">
        <div className="product__gallery">
          <div className="product__thumbs">
            {images.map((img) => (
              <button
                key={img}
                className={`product__thumb ${activeImage === img ? "active" : ""}`}
                onClick={() => setActiveImage(img)}
              >
                <Image src={img} alt="preview" width={82} height={82} />
              </button>
            ))}
          </div>

          <div className="product__image">
            {activeImage && (
              <Image src={activeImage} alt={product.name} width={471} height={471} />
            )}
          </div>
        </div>

        <div className="product__info">
          <h1>{t('productCard.article')}: {product.article}</h1>
          <p className="product__desc">{product.name}</p>
          <p className="product__descip line-clamp-3" title={product.description}>
            {product.description.slice(0, 150)}...
          </p>
          <div className="product__price">{product.price.toLocaleString()} {t('productCard.currency')}</div>
          <div className="product__bonus">{product.bonus || 0} {t('productCard.bonuses')}</div>

          <div className="product__actions">
            <div className="counter">
              <button onClick={decrement}>−</button>
              <span>{count}</span>
              <button onClick={increment}>+</button>
            </div>

            <button
              className="add-to-cart"
              onClick={handleCartClick}
              disabled={isAdding || isDeleting}
              style={{ backgroundColor: isInCart ? '#0E2E5B' : '', color: isInCart ? '#FFFFFF' : '' }}
            >
              {isInCart ? <IoCart size={20} /> : <IoCartOutline size={20} />}
              {t('productCard.addToCart')}
            </button>
          </div>
        </div>
      </div>

      {showAuthModal && (
        <div
          className="auth-modal__overlay"
          onClick={() => setShowAuthModal(false)}
        >
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="auth-modal__close"
              onClick={() => setShowAuthModal(false)}
              aria-label="Закрыть"
            >
              <IoClose size={20} />
            </button>

            <div className="auth-modal__icon">
              <IoCartOutline size={48} />
            </div>

            <h3 className="auth-modal__title">{t("auth.modal.title")}</h3>
            <p className="auth-modal__text">{t("auth.modal.description")}</p>

            <div className="auth-modal__actions">
              <Link
                href="/register"
                className="auth-modal__btn auth-modal__btn--primary"
                onClick={() => setShowAuthModal(false)}
              >
                {t("auth.modal.register")}
              </Link>
              <Link
                href="/login"
                className="auth-modal__btn auth-modal__btn--secondary"
                onClick={() => setShowAuthModal(false)}
              >
                {t("auth.modal.login")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;