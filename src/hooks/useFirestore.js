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
import { useAuth } from '../contexts/AuthContext';

export function useBoards() {
  const [boards, setBoards] = useState([]);
  const { currentUser } = useAuth();
  const isHost = currentUser?.email === 'happysinyeong21@gmail.com';

  useEffect(() => {
    const q = query(collection(db, 'boards'), orderBy('created_at', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const boardData = snapshot.docs.map(doc => ({
        board_id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate().toISOString() || new Date().toISOString()
      }));
      boardData.sort((a, b) => {
        const orderA = a.custom_order ?? new Date(a.created_at).getTime();
        const orderB = b.custom_order ?? new Date(b.created_at).getTime();
        return orderB - orderA;
      });
      setBoards(boardData);
    }, (error) => {
      console.error("Error fetching boards:", error);
    });

    return unsubscribe;
  }, []);

  const addBoard = async (title) => {
    if (!isHost) throw new Error("Permission denied. Only host can create boards.");

    const docRef = await addDoc(collection(db, 'boards'), {
      title,
      user_id: currentUser.uid,
      created_at: serverTimestamp()
    });
    
    return {
      board_id: docRef.id,
      title
    };
  };

  const deleteBoard = async (id) => {
    if (!isHost) throw new Error("Permission denied. Only host can delete boards.");
    try {
      await deleteDoc(doc(db, 'boards', id));
    } catch (e) {
      console.error("Error deleting board:", e);
    }
  };

  const moveBoard = async (index, direction) => {
    if (!isHost) return;
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= boards.length) return;

    const boardA = boards[index];
    const boardB = boards[targetIndex];

    const orderA = boardA.custom_order ?? new Date(boardA.created_at).getTime();
    const orderB = boardB.custom_order ?? new Date(boardB.created_at).getTime();

    let newOrderA = orderB;
    let newOrderB = orderA;
    if (newOrderA === newOrderB) {
      newOrderA += 1;
    }

    try {
      await updateDoc(doc(db, 'boards', boardA.board_id), { custom_order: newOrderA });
      await updateDoc(doc(db, 'boards', boardB.board_id), { custom_order: newOrderB });
    } catch (e) {
      console.error("Error moving board:", e);
    }
  };

  return { boards, addBoard, deleteBoard, moveBoard, isHost };
}

export function useCards(boardId = null) {
  const [cards, setCards] = useState([]);
  const { currentUser } = useAuth();
  const isHost = currentUser?.email === 'happysinyeong21@gmail.com';

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
      cardData.sort((a, b) => {
        const orderA = a.custom_order ?? new Date(a.created_at).getTime();
        const orderB = b.custom_order ?? new Date(b.created_at).getTime();
        return orderA - orderB;
      });
      setCards(cardData);
    }, (error) => {
      console.error("Error fetching cards:", error);
    });

    return unsubscribe;
  }, [boardId]);

  const addCard = async (board_id, file_url, cover_url, title, description, file_type = 'image', file_name = '') => {
    if (!isHost) throw new Error("Permission denied. Only host can add cards.");

    const docRef = await addDoc(collection(db, 'cards'), {
      board_id,
      file_url,
      cover_url,
      title,
      description,
      file_type,
      file_name,
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
      cover_url,
      title,
      description,
      file_type,
      file_name,
      share_link: shareLink
    };
  };

  const updateCard = async (card_id, updates) => {
    if (!isHost) throw new Error("Permission denied. Only host can edit cards.");
    try {
      await updateDoc(doc(db, 'cards', card_id), updates);
    } catch (e) {
      console.error("Error updating card:", e);
    }
  };

  const deleteCard = async (card_id) => {
    if (!isHost) throw new Error("Permission denied. Only host can delete cards.");
    try {
      await deleteDoc(doc(db, 'cards', card_id));
    } catch (e) {
      console.error("Error deleting card:", e);
    }
  };

  const moveCard = async (index, direction) => {
    if (!isHost) return;
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cards.length) return;

    const cardA = cards[index];
    const cardB = cards[targetIndex];

    const orderA = cardA.custom_order ?? new Date(cardA.created_at).getTime();
    const orderB = cardB.custom_order ?? new Date(cardB.created_at).getTime();

    let newOrderA = orderB;
    let newOrderB = orderA;
    if (newOrderA === newOrderB) {
      newOrderA += 1;
    }

    try {
      await updateDoc(doc(db, 'cards', cardA.card_id), { custom_order: newOrderA });
      await updateDoc(doc(db, 'cards', cardB.card_id), { custom_order: newOrderB });
    } catch (e) {
      console.error("Error moving card:", e);
    }
  };

  const getCardsByBoard = (id) => cards.filter(c => c.board_id === id);
  const getCardById = (id) => cards.find(c => c.card_id === id);

  return { 
    cards, 
    addCard, 
    updateCard,
    deleteCard, 
    moveCard,
    getCardsByBoard, 
    getCardById,
    isHost
  };
}
