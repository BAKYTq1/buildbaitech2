import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { $api } from '../../../../API/api';

const AddressModal = ({ address, onClose }) => {
    const queryClient = useQueryClient();
    const isEdit = !!address;

    // Состояние для хранения ошибок валидации
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        first_name: address?.first_name || '',
        last_name: address?.last_name || '',
        email: address?.email || '',
        address_1: address?.address_1 || '',
        address_2: address?.address_2 || '',
        postal_code: address?.postal_code || '',
        country: address?.country || '',
        region: address?.region || '',
        is_primary: address?.is_primary || false,
    });

    const mutation = useMutation({
        mutationFn: (newData) => {
            if (isEdit) {
                return $api.patch(`/addressbook/addresses/${address.id}/`, newData);
            }
            return $api.post('/addressbook/addresses/', newData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['addresses']);
            onClose();
        },
    });

    // Функция валидации
    const validate = () => {
        const newErrors = {};
        const requiredFields = [
            'first_name',
            'last_name',
            'email',
            'address_1',
            'postal_code',
            'country',
            'region'
        ];

        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].trim() === '') {
                newErrors[field] = 'Это поле обязательно';
            }
        });

        // Проверка формата email
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Некорректный формат email';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            mutation.mutate(formData);
        }
    };

    // Вспомогательная функция для классов инпута
    const getInputClass = (fieldName) => {
        const baseClass = "border p-3 rounded-lg transition-colors outline-none focus:border-[#122D52]";
        const errorClass = errors[fieldName] ? "border-red-500 bg-red-50" : "border-gray-300";
        return `${baseClass} ${errorClass}`;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-2xl p-6 lg:p-10 max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-[#1f2937]">
                    {isEdit ? 'Редактировать адрес' : 'Добавить новый адрес'}
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <input
                            placeholder="Имя *"
                            className={getInputClass('first_name')}
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        />
                        {errors.first_name && <span className="text-red-500 text-xs ml-1">{errors.first_name}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <input
                            placeholder="Фамилия *"
                            className={getInputClass('last_name')}
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        />
                        {errors.last_name && <span className="text-red-500 text-xs ml-1">{errors.last_name}</span>}
                    </div>

                    <div className="flex flex-col gap-1 md:col-span-2">
                        <input
                            placeholder="Email *"
                            type="email"
                            className={getInputClass('email')}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {errors.email && <span className="text-red-500 text-xs ml-1">{errors.email}</span>}
                    </div>

                    <div className="flex flex-col gap-1 md:col-span-2">
                        <input
                            placeholder="Адрес 1 *"
                            className={getInputClass('address_1')}
                            value={formData.address_1}
                            onChange={(e) => setFormData({ ...formData, address_1: e.target.value })}
                        />
                        {errors.address_1 && <span className="text-red-500 text-xs ml-1">{errors.address_1}</span>}
                    </div>

                    <input
                        placeholder="Адрес 2 (необязательно)"
                        className="border border-gray-300 p-3 rounded-lg md:col-span-2 outline-none focus:border-[#122D52]"
                        value={formData.address_2}
                        onChange={(e) => setFormData({ ...formData, address_2: e.target.value })}
                    />

                    <div className="flex flex-col gap-1">
                        <input
                            placeholder="Индекс *"
                            className={getInputClass('postal_code')}
                            value={formData.postal_code}
                            onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                        />
                        {errors.postal_code && <span className="text-red-500 text-xs ml-1">{errors.postal_code}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <input
                            placeholder="Регион/Город *"
                            className={getInputClass('region')}
                            value={formData.region}
                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        />
                        {errors.region && <span className="text-red-500 text-xs ml-1">{errors.region}</span>}
                    </div>

                    <div className="flex flex-col gap-1 md:col-span-2">
                        <select
                            className={getInputClass('country')}
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        >
                            <option value="">Выберите страну *</option>
                            <option value="Кыргызстан">Кыргызстан</option>
                            <option value="Узбекистан">Узбекистан</option>
                            <option value="Казахстан">Казахстан</option>
                        </select>
                        {errors.country && <span className="text-red-500 text-xs ml-1">{errors.country}</span>}
                    </div>

                    <label className="flex items-center gap-2 md:col-span-2 cursor-pointer py-2">
                        <input
                            type="checkbox"
                            className="w-4 h-4 accent-[#122D52]"
                            checked={formData.is_primary}
                            onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                        />
                        <span className="text-sm text-[#4b5563]">Сделать основным адресом</span>
                    </label>

                    <div className="flex gap-4 mt-6 md:col-span-2">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="flex-[2] flex items-center justify-center gap-2 bg-[#122D52] text-white px-8 h-[48px] rounded-[8px] disabled:bg-gray-400 hover:bg-[#0d213d] transition-all font-medium"
                        >
                            {mutation.isPending && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {mutation.isPending ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-[#4b5563]"
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;