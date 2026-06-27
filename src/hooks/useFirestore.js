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

  useEffect(() => {
    // 호스트만 수정 가능하므로, 보드 목록을 생성일 역순으로 가져옴
    const q = query(collection(db, 'boards'), orderBy('created_at', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const boardData = snapshot.docs.map(doc => ({
        board_id: doc.id,
        ...doc.data(),
        // Firestore Timestamp를 문자열로 변환 (UI 렌더링 호환성)
        created_at: doc.data().created_at?.toDate().toISOString() || new Date().toISOString()
      }));
      setBoards(boardData);
    }, (error) => {
      console.error("Error fetching boards:", error);
    });

    return unsubscribe;
  }, []);

  const addBoard = async (title, layout_type) => {
    if (!currentUser) throw new Error("Not authenticated");
    
    const docRef = await addDoc(collection(db, 'boards'), {
      title,
      layout_type,
      user_id: currentUser.uid,
      created_at: serverTimestamp()
    });
    
    // 즉각적인 네비게이션을 위해 객체 반환
    return {
      board_id: docRef.id,
      title,
      layout_type
    };
  };

  const deleteBoard = async (id) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'boards', id));
      // 참고: 관련된 카드들도 삭제하는 로직(Cascade)이 실제 프로덕션에선 필요합니다.
    } catch (e) {
      console.error("Error deleting board:", e);
    }
  };

  return { boards, addBoard, deleteBoard };
}

export function useCards(boardId = null) {
  const [cards, setCards] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!boardId) {
      // boardId가 없으면 전체 카드를 가져올 수도 있지만, 일반적으로는 불필요함
      return;
    }

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
      // 색인(Index)이 필요하다는 에러가 날 수 있으니 콘솔 확인 요망 (where + orderBy 복합 쿼리)
    });

    return unsubscribe;
  }, [boardId]);

  const addCard = async (board_id, file_url, title, description) => {
    if (!currentUser) throw new Error("Not authenticated");
    
    const docRef = await addDoc(collection(db, 'cards'), {
      board_id,
      file_url,
      title,
      description,
      share_link: '', // 생성 후 업데이트하거나 클라이언트에서 조합 가능
      created_at: serverTimestamp()
    });

    // share_link 업데이트
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
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'cards', card_id), updates);
    } catch (e) {
      console.error("Error updating card:", e);
    }
  };

  const deleteCard = async (card_id) => {
    if (!currentUser) return;
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
