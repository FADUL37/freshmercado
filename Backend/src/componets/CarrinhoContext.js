import React, { createContext, useContext, useState } from 'react';

const CarrinhoContext = createContext();

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider');
  }
  return context;
}

export function CarrinhoProvider({ children }) {
  const [itensCarrinho, setItensCarrinho] = useState([]);

  const adicionarItem = (produto) => {
    setItensCarrinho(itens => {
      const itemExistente = itens.find(item => item.id === produto.id);
      
      if (itemExistente) {
        return itens.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      
      return [...itens, { ...produto, quantidade: 1 }];
    });
  };

  const removerItem = (produtoId) => {
    setItensCarrinho(itens => itens.filter(item => item.id !== produtoId));
  };

  const atualizarQuantidade = (produtoId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerItem(produtoId);
      return;
    }
    
    setItensCarrinho(itens =>
      itens.map(item =>
        item.id === produtoId
          ? { ...item, quantidade: novaQuantidade }
          : item
      )
    );
  };

  const limparCarrinho = () => {
    setItensCarrinho([]);
  };

  const calcularTotal = () => {
    return itensCarrinho.reduce(
      (total, item) => total + (item.preco * item.quantidade),
      0
    );
  };

  const value = {
    itensCarrinho,
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    limparCarrinho,
    calcularTotal
  };

  return (
    <CarrinhoContext.Provider value={value}>
      {children}
    </CarrinhoContext.Provider>
  );
}