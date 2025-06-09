import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import styled from 'styled-components';

const ProductsContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem;
`;

const ProductsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #333;
  text-align: center;
  margin: 0 0 3rem 0;
  font-weight: bold;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CategoryFilter = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  overflow-x: auto;
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    gap: 0.8rem;
    padding: 0.5rem 0;
  }
`;

const CategoryButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${props => props.active ? '#ff6b35' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 2px solid ${props => props.active ? '#ff6b35' : '#e0e0e0'};
  padding: 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 0.5rem;
  min-width: 120px;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: #ff6b35;
    color: #ff6b35;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
  }
  
  &.active {
    background: #ff6b35;
    border-color: #ff6b35;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  }
  
  @media (max-width: 768px) {
    min-width: 100px;
    padding: 0.8rem;
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    min-width: 90px;
    padding: 0.6rem;
    font-size: 0.8rem;
  }
`;

const CategoryImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 0.3rem;
  border: 2px solid #f0f0f0;
  background: #f8f9fa;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.3s ease;
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
  
  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
  }
`;

const CategoryName = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.8rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

const LoadingSpinner = styled.div`
  color: #ff6b35;
  font-size: 1.2rem;
  font-weight: 600;
`;

const NoProducts = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Lista de produtos com URLs de imagem corrigidas
  const productsList = [
    {
      id: 1,
      name: 'Maçã Gala',
      category: 'frutas',
      price: 8.90,
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 2,
      name: 'Banana Prata',
      category: 'frutas',
      price: 6.50,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 3,
      name: 'Laranja Lima',
      category: 'frutas',
      price: 7.90,
      image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 4,
      name: 'Tomate Italiano',
      category: 'vegetais',
      price: 9.90,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 5,
      name: 'Alface Americana',
      category: 'vegetais',
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 6,
      name: 'Cenoura',
      category: 'vegetais',
      price: 4.90,
      image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 7,
      name: 'Carne Bovina - Alcatra',
      category: 'carnes',
      price: 45.90,
      image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 8,
      name: 'Frango Inteiro',
      category: 'carnes',
      price: 18.90,
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 9,
      name: 'Peixe Salmão',
      category: 'carnes',
      price: 89.90,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 10,
      name: 'Leite Integral',
      category: 'laticinios',
      price: 5.90,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 11,
      name: 'Queijo Mussarela',
      category: 'laticinios',
      price: 28.90,
      image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 12,
      name: 'Iogurte Natural',
      category: 'laticinios',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 13,
      name: 'Água Mineral',
      category: 'bebidas',
      price: 2.50,
      image: 'https://static.paodeacucar.com/img/uploads/1/939/29985939.jpg?im=Resize,width=200'
    },
    {
      id: 14,
      name: 'Suco de Laranja',
      category: 'bebidas',
      price: 8.90,
      image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 15,
      name: 'Refrigerante Cola',
      category: 'bebidas',
      price: 6.50,
      image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 16,
      name: 'Pão Francês',
      category: 'padaria',
      price: 0.50,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 17,
      name: 'Croissant',
      category: 'padaria',
      price: 4.00,
      image: 'https://images.unsplash.com/photo-1555507036-ab794f4afe5e?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 18,
      name: 'Bolo de Chocolate',
      category: 'padaria',
      price: 25.90,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&crop=center'
    }
  ];

  // Categorias com imagens corrigidas
  const categories = [
    {
      id: 'all',
      name: 'Todos os Produtos',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 'frutas',
      name: 'Frutas',
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 'vegetais',
      name: 'Vegetais',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 'carnes',
      name: 'Carnes',
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 'laticinios',
      name: 'Laticínios',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 'bebidas',
      name: 'Bebidas',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 'padaria',
      name: 'Padaria',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop&crop=center'
    }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Simula carregamento da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(productsList);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      // Fallback para lista estática
      setProducts(productsList);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <ProductsContainer>
      <ProductsContent>
        <Title>🛍️ Nossos Produtos</Title>
        
        <CategoryFilter>
          {categories.map(category => (
            <CategoryButton
              key={category.id}
              active={selectedCategory === category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={selectedCategory === category.id ? 'active' : ''}
            >
              <CategoryImage>
                <img 
                  src={category.image} 
                  alt={category.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </CategoryImage>
              <CategoryName>{category.name}</CategoryName>
            </CategoryButton>
          ))}
        </CategoryFilter>

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner>Carregando produtos...</LoadingSpinner>
          </LoadingContainer>
        ) : (
          <ProductsGrid>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <NoProducts>
                Nenhum produto encontrado nesta categoria.
              </NoProducts>
            )}
          </ProductsGrid>
        )}
      </ProductsContent>
    </ProductsContainer>
  );
};

export default Products;