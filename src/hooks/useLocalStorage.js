import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useBoards() {
  const [boards, setBoards] = useState(() => {
    const saved = localStorage.getItem('eduShare_boards');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('eduShare_boards', JSON.stringify(boards));
  }, [boards]);

  const addBoard = (title, layout_type) => {
    const newBoard = {
      board_id: uuidv4(),
      title,
      layout_type,
      created_at: new Date().toISOString()
    };
    setBoards(prev => [newBoard, ...prev]);
    return newBoard;
  };

  const deleteBoard = (id) => {
    setBoards(prev => prev.filter(b => b.board_id !== id));
    // 카드는 useCards에서 지워야하지만 로컬이라 일단 생략. 실제에선 Cascade delete.
  };

  return { boards, addBoard, deleteBoard };
}

export function useCards(boardId = null) {
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('eduShare_cards');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('eduShare_cards', JSON.stringify(cards));
  }, [cards]);

  const addCard = (board_id, file_url, title, description) => {
    const newCard = {
      card_id: uuidv4(),
      board_id,
      file_url,
      title,
      description,
      share_link: '', // 아래에서 채움
      created_at: new Date().toISOString()
    };
    newCard.share_link = `${window.location.origin}/share/card/${newCard.card_id}`;
    
    setCards(prev => [...prev, newCard]);
    return newCard;
  };

  const updateCard = (card_id, updates) => {
    setCards(prev => prev.map(c => c.card_id === card_id ? { ...c, ...updates } : c));
  };

  const deleteCard = (card_id) => {
    setCards(prev => prev.filter(c => c.card_id !== card_id));
  };

  const getCardsByBoard = (id) => cards.filter(c => c.board_id === id);
  const getCardById = (id) => cards.find(c => c.card_id === id);

  return { 
    cards: boardId ? getCardsByBoard(boardId) : cards, 
    addCard, 
    updateCard,
    deleteCard, 
    getCardsByBoard, 
    getCardById 
  };
}
