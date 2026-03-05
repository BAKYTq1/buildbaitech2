import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { productApi } from '../api/useProducts';

export const useProductById = (id) => {
    const productQuery = useQuery({
        queryKey: ['product', id],
        queryFn: () => productApi.getById(id),
        enabled: !!id, // запрос не идёт, если id не передан
    });

    return {
        product: productQuery.data,
        isLoading: productQuery.isLoading,
        isError: productQuery.isError,
    };
};
export const useProducts = () => {
    const queryClient = useQueryClient();

    // Запрос на получение данных
    const productsQuery = useQuery({
        queryKey: ['products'],
        queryFn: productApi.getAll,
    });

    // Мутация на удаление
    const deleteMutation = useMutation({
        mutationFn: (id) => productApi.delete(id),
        onSuccess: () => {
            // Инвалидация кэша, чтобы список обновился автоматически
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    // Мутация на обновление
    const updateMutation = useMutation({
        mutationFn: ({ id, payload }) => productApi.put(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error) => {
            console.error('Update product error:', error);
        },
    });

    const changeAvailabilityMutation = useMutation({
        mutationFn: ({ id, is_available }) => productApi.changeAvailability(id, is_available),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const addProductMutation = useMutation({
        mutationFn: (newProduct) => productApi.create(newProduct),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const addCategoryMutation = useMutation({
        mutationFn: (newCat) => productApi.createCategory(newCat), // Путь: /products/categories/
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    const addBrandMutation = useMutation({
        mutationFn: (newBrand) => productApi.createBrand(newBrand), // Путь: /products/brands/
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
        },
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: (id) => productApi.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    const deleteBrandMutation = useMutation({
        mutationFn: (id) => productApi.deleteBrand(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
        },
    });

    const categoriesQuery = useQuery({
        queryKey: ['categories'],
        queryFn: productApi.getCategories,
    });

    const brandsQuery = useQuery({
        queryKey: ['brands'],
        queryFn: productApi.getBrands,
    });

    return {
        products: productsQuery.data?.results || productsQuery.data || [],
        isLoading: productsQuery.isLoading,
        isError: productsQuery.isError,
        deleteProduct: deleteMutation.mutate,
        updateProduct: updateMutation.mutate,
        changeAvailability: changeAvailabilityMutation.mutate,
        addProduct: addProductMutation.mutateAsync,
        categories: categoriesQuery.data?.results || (Array.isArray(categoriesQuery.data) ? categoriesQuery.data : []),
        brands: brandsQuery.data?.results || (Array.isArray(brandsQuery.data) ? brandsQuery.data : []),
        isInitialLoading: categoriesQuery.isLoading || brandsQuery.isLoading,
        addCategory: addCategoryMutation.mutateAsync,
        addBrand: addBrandMutation.mutateAsync,
        deleteCategory: deleteCategoryMutation.mutateAsync,
        deleteBrand: deleteBrandMutation.mutateAsync,
    };
};
export const useSimilarProducts = (productId) => {
    return useQuery({
        queryKey: ['similar-products', productId],
        queryFn: () => productApi.getSimilar(productId),
        enabled: !!productId,
    });
};

// Infinite scroll для продуктов
export const useInfiniteProducts = (filters = {}) => {
    return useInfiniteQuery({
        queryKey: ['products-infinite', filters],
        queryFn: ({ pageParam = 1 }) =>
            productApi.getAll({ ...filters, page: pageParam }),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.next ? pages.length + 1 : undefined;
        },
        initialPageParam: 1,
    });
};

// Фильтрация по категории
export const useProductsByCategory = (category, page = 1) => {
    return useQuery({
        queryKey: ['products', 'category', category, page],
        queryFn: () => productApi.getByCategory(category, page),
        enabled: !!category,
    });
};

// Фильтрация по бренду
export const useProductsByBrand = (brandId, page = 1) => {
    return useQuery({
        queryKey: ['products', 'brand', brandId, page],
        queryFn: () => productApi.getByBrand(brandId, page),
        enabled: !!brandId,
    });
};