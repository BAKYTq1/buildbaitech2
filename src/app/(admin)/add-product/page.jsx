"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/lib/products/hooks/hooks";
import { Plus, Trash2, X, Camera } from "lucide-react";
import "./AddProduct.scss";

const AddProduct = () => {
  const router = useRouter();
  const {
    categories,
    brands,
    isInitialLoading,
    addProduct,
    addCategory,
    addBrand,
    deleteCategory,
    deleteBrand,
  } = useProducts();

  // Состояние формы товара
  const [formData, setFormData] = useState({
    name: "",
    article: "",
    price: "",
    category: "",
    brand: "",
    bonus: "",
    description: "",
    characteristics: "",
    images: [null, null, null, null],
  });

  // Состояния для модальных окон
  const [modalType, setModalType] = useState(null); // 'category' | 'brand' | null
  // Добавлено поле parent для привязки категории к бренду
  const [modalData, setModalData] = useState({ name: "", description: "", parent: "" });
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "bonus") {
      const num = Number(value);
      if (num > 9999 || num < 0) return;
      setFormData((prev) => ({ ...prev, bonus: num }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImages = [...formData.images];
      newImages[index] = file;
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages[index] = null;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  // Функция для превращения иерархии категорий в плоский список с отступами
  const flattenCategories = (items, depth = 0) => {
    let flat = [];
    items?.forEach((item) => {
      flat.push({ ...item, displayName: "— ".repeat(depth) + item.name });
      if (item.subcategories && item.subcategories.length > 0) {
        flat = flat.concat(flattenCategories(item.subcategories, depth + 1));
      }
    });
    return flat;
  };

  const flatCategories = flattenCategories(categories);

  // Сохранение нового бренда или категории из модалки
  const handleAddQuickInfo = async () => {
    if (!modalData.name.trim()) return alert("Название обязательно");

    setIsSubmittingModal(true);
    try {
      if (modalType === "category") {
        await addCategory({
          name: modalData.name,
          description: modalData.description,
          parent: modalData.parent ? Number(modalData.parent) : null,
        });
      } else if (modalType === "brand") {
        await addBrand({
          name: modalData.name,
          description: modalData.description,
        });
      }
      setModalType(null);
      setModalData({ name: "", description: "", parent: "" });
    } catch (error) {
      console.error("Ошибка при создании:", error);
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const handleSubmit = async () => {
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("article", formData.article);
    payload.append("price", formData.price);
    payload.append("category", formData.category);
    payload.append("brand", formData.brand);
    payload.append("bonus", formData.bonus);
    payload.append("description", formData.description);
    payload.append("characteristics", formData.characteristics);
    payload.append("is_available", "true");

    formData.images.forEach((file) => {
      if (file) payload.append("images", file);
    });

    try {
      await addProduct(payload);
      router.push("/camera");
    } catch (err) {
      console.error("Ошибка публикации:", err);
    }
  };

  if (isInitialLoading) return <div className="loader" />;

  return (
    <div className="add-product-page">
      {/* --- МОДАЛЬНОЕ ОКНО --- */}
      {modalType && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-btn" onClick={() => setModalType(null)}>
              <X size={20} />
            </button>
            {modalType === "manage-category" || modalType === "manage-brand" ? (
              <>
                <h3>Управление {modalType === "manage-category" ? "категориями" : "брендами"}</h3>
                <div className="management-list">
                  {(modalType === "manage-category" ? flatCategories : brands)?.map((item) => (
                    <div key={item.id} className="management-item">
                      <span>{item.displayName || item.name}</span>
                      <button
                        className="delete-item-btn"
                        onClick={async () => {
                          if (window.confirm(`Вы уверены, что хотите удалить ${modalType === "manage-category" ? "категорию" : "бренд"} "${item.name}"?`)) {
                            try {
                              if (modalType === "manage-category") {
                                await deleteCategory(item.id);
                              } else {
                                await deleteBrand(item.id);
                              }
                              setModalType(null);
                              setModalData({ name: "", description: "", parent: "" });
                            } catch (err) {
                              console.error("Ошибка удаления", err);
                            }
                          }
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="modal-actions">
                  <button className="cancel-btn" onClick={() => setModalType(null)}>
                    Закрыть
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>Добавить {modalType === "category" ? "категорию" : "бренд"}</h3>
                <div className="modal-fields">

                  {/* Выбор родительской КАТЕГОРИИ ТОЛЬКО для категории */}
                  {modalType === "category" && (
                    <div className="modal-group">
                      <label>Выберите родительскую категорию (Parent)</label>
                      <select
                        value={modalData.parent}
                        onChange={(e) => setModalData({ ...modalData, parent: e.target.value })}
                      >
                        <option value="">Без родителя (Верхний уровень)</option>
                        {flatCategories?.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.displayName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="modal-group">
                    <label>Название *</label>
                    <input
                      type="text"
                      value={modalData.name}
                      onChange={(e) =>
                        setModalData({ ...modalData, name: e.target.value })
                      }
                      placeholder="Введите название..."
                    />
                  </div>

                  <div className="modal-group">
                    <label>Описание</label>
                    <textarea
                      value={modalData.description}
                      onChange={(e) =>
                        setModalData({ ...modalData, description: e.target.value })
                      }
                      placeholder="Необязательное описание..."
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="cancel-btn" onClick={() => setModalType(null)}>
                    Отмена
                  </button>
                  <button
                    className="confirm-btn"
                    onClick={handleAddQuickInfo}
                    disabled={isSubmittingModal}
                  >
                    {isSubmittingModal ? "..." : "Добавить"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="page-header">
        <div className="header-left">
          <button
            className="back-btn-new"
            onClick={() => router.back()}
            aria-label="Назад"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div className="header-titles">
            <h2>Добавление товара</h2>
            <p>Заполните информацию о новом продукте</p>
          </div>
        </div>
      </div>

      <div className="form-container">
        {/* СЕКЦИЯ ИЗОБРАЖЕНИЙ */}
        <div className="image-upload-section">
          <div className="thumbnail-grid">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="thumbnail-slot">
                {formData.images[idx] ? (
                  <div className="preview-container">
                    <img
                      src={URL.createObjectURL(formData.images[idx])}
                      alt="Превью"
                    />
                    <button
                      type="button"
                      className="remove-btn-top"
                      onClick={() => removeImage(idx)}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, idx)}
                      id={`thumb-${idx}`}
                      hidden
                    />
                    <label
                      htmlFor={`thumb-${idx}`}
                      className="upload-placeholder"
                    >
                      <Camera size={24} />
                    </label>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="main-image-slot">
            {formData.images[3] ? (
              <div className="preview-container main">
                <img
                  src={URL.createObjectURL(formData.images[3])}
                  alt="Главное"
                />
                <button
                  type="button"
                  className="remove-btn-top"
                  onClick={() => removeImage(3)}
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 3)}
                  id="main-image"
                  hidden
                />
                <label htmlFor="main-image" className="upload-placeholder-main">
                  <Camera size={32} />
                  <span>Загрузить главное фото</span>
                </label>
              </>
            )}
          </div>
        </div>

        {/* ПОЛЯ ФОРМЫ */}
        <div className="form-grid">
          <div className="form-group">
            <label>Название</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Артикул</label>
            <input
              name="article"
              type="text"
              value={formData.article}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Цена (сом)</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Категория</label>
            <div className="select-wrapper">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Выберите категорию</option>
                {flatCategories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.displayName}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="add-small-btn"
                onClick={() => setModalType("category")}
              >
                <Plus size={20} />
              </button>
              <button
                type="button"
                className="delete-small-btn"
                onClick={() => setModalType("manage-category")}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Бренд</label>
            <div className="select-wrapper">
              <select
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
              >
                <option value="">Выберите бренд</option>
                {brands?.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="add-small-btn"
                onClick={() => setModalType("brand")}
              >
                <Plus size={20} />
              </button>
              <button
                type="button"
                className="delete-small-btn"
                onClick={() => setModalType("manage-brand")}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Бонусные баллы (%)</label>
            <input
              name="bonus"
              type="number"
              value={formData.bonus}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="full-width-fields">
          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Характеристики</label>
            <textarea
              name="characteristics"
              value={formData.characteristics}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => router.back()}
          >
            Отмена
          </button>
          <button
            type="button"
            className="submit-btn"
            onClick={handleSubmit}
            disabled={addProduct.isPending}
          >
            {addProduct.isPending ? "Публикация..." : "Опубликовать"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;