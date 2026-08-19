import { Event, Comment, AppState } from '../types';

// ===== API ПОЛНОСТЬЮ ОТКЛЮЧЁН =====
// Все данные хранятся ТОЛЬКО в localStorage

export const loadState = async (): Promise<AppState> => {
    console.warn('⚠️ API отключен, используем локальные данные');
    return getLocalState();
};

export const getLocalState = (): AppState => {
    try {
        const raw = localStorage.getItem('call_sheet_state');
        if (raw) {
            return JSON.parse(raw);
        }
    } catch (e) {
        console.warn('⚠️ Ошибка чтения локального состояния');
    }
    return { isUnlocked: false, events: [] };
};

export const unlockApp = (): void => {
    localStorage.setItem('call_sheet_unlocked', 'true');
    const state = getLocalState();
    state.isUnlocked = true;
    localStorage.setItem('call_sheet_state', JSON.stringify(state));
    console.log('✅ Приложение разблокировано локально');
};

export const addEvent = async (event: Omit<Event, 'id' | 'comments'>): Promise<Event> => {
    const newEvent = { 
        ...event, 
        id: Date.now().toString(), 
        comments: [] 
    };
    const state = getLocalState();
    state.events.push(newEvent);
    localStorage.setItem('call_sheet_state', JSON.stringify(state));
    console.log('✅ Событие сохранено локально:', newEvent);
    return newEvent;
};

export const deleteEvent = async (id: string): Promise<void> => {
    const state = getLocalState();
    state.events = state.events.filter(e => e.id !== id);
    localStorage.setItem('call_sheet_state', JSON.stringify(state));
    console.log('✅ Событие удалено локально');
};

export const updateEventStatus = async (id: string, status: Event['status']): Promise<void> => {
    const state = getLocalState();
    const event = state.events.find(e => e.id === id);
    if (event) {
        event.status = status;
        localStorage.setItem('call_sheet_state', JSON.stringify(state));
        console.log('✅ Статус обновлён локально');
    }
};

export const addComment = async (eventId: string, author: 'NIK' | 'ELINA', text: string): Promise<void> => {
    const state = getLocalState();
    const event = state.events.find(e => e.id === eventId);
    if (event) {
        const newComment = {
            id: Date.now().toString(),
            author: author,
            text: text,
            timestamp: Date.now()
        };
        event.comments.push(newComment);
        localStorage.setItem('call_sheet_state', JSON.stringify(state));
        console.log('✅ Комментарий сохранён локально');
    }
};

export const saveState = async (state: AppState): Promise<void> => {
    localStorage.setItem('call_sheet_unlocked', String(state.isUnlocked));
    localStorage.setItem('call_sheet_state', JSON.stringify(state));
    console.log('✅ Состояние сохранено локально');
};