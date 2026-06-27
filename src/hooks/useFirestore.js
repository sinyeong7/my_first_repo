import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useBoards() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'boards'), orderBy('created_at', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const boardData = snapshot.docs.map(doc => ({
        board_id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate().toISOString() || new Date().toISOString()
      }));
      setBoards(boardData);
    }, (error) => {
      console.error("Error fetching boards:", error);
    });

    return unsubscribe;
  }, []);

  const addBoard = async (title, layout_type) => {
    const docRef = await addDoc(collection(db, 'boards'), {
      title,
      layout_type,
      user_id: 'anonymous', // 로그인 없이 익명으로 저장
      created_at: serverTimestamp()
    });
    
    return {
      board_id: docRef.id,
      title,
      layout_type
    };
  };

  const deleteBoard = async (id) => {
    try {
      await deleteDoc(doc(db, 'boards', id));
    } catch (e) {
      console.error("Error deleting board:", e);
    }
  };

  return { boards, addBoard, deleteBoard };
}

export function useCards(boardId = null) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (!boardId) return;

    const q = query(
      collection(db, 'cards'), 
      where('board_id', '==', boardId),
      orderBy('created_at', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cardData = snapshot.docs.map(doc => ({
        card_id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate().toISOString() || new Date().toISOString()
      }));
      setCards(cardData);
    }, (error) => {
      console.error("Error fetching cards:", error);
    });

    return unsubscribe;
  }, [boardId]);

  const addCard = async (board_id, file_url, title, description) => {
    const docRef = await addDoc(collection(db, 'cards'), {
      board_id,
      file_url,
      title,
      description,
      share_link: '',
      created_at: serverTimestamp()
    });

    const shareLink = `${window.location.origin}/share/card/${docRef.id}`;
    await updateDoc(doc(db, 'cards', docRef.id), {
      share_link: shareLink
    });

    return {
      card_id: docRef.id,
      board_id,
      file_url,
      title,
      description,
      share_link: shareLink
    };
  };

  const updateCard = async (card_id, updates) => {
    try {
      await updateDoc(doc(db, 'cards', card_id), updates);
    } catch (e) {
      console.error("Error updating card:", e);
    }
  };

  const deleteCard = async (card_id) => {
    try {
      await deleteDoc(doc(db, 'cards', card_id));
    } catch (e) {
      console.error("Error deleting card:", e);
    }
  };

  const getCardsByBoard = (id) => cards.filter(c => c.board_id === id);
  const getCardById = (id) => cards.find(c => c.card_id === id);

  return { 
    cards, 
    addCard, 
    updateCard,
    deleteCard, 
    getCardsByBoard, 
    getCardById 
  };
}
