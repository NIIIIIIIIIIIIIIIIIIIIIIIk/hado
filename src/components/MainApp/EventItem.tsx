import React, { useState } from 'react';
import { Event } from '../../types';
import { Button } from '../UI/Button';
import { CommentSection } from './CommentSection';
import { updateEventStatus, deleteEvent } from '../../utils/storage';
import styles from './MainApp.module.css';

interface EventItemProps {
  event: Event;
  onUpdate: () => void;
  onCommentAdded?: (count: number) => void;
  onAllConfirmed?: () => void;
}

export const EventItem: React.FC<EventItemProps> = ({ 
  event, 
  onUpdate, 
  onCommentAdded,
  onAllConfirmed 
}) => {
  const [showComments, setShowComments] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStatusChange = async (status: Event['status']) => {
    if (isProcessing) return;
    setIsProcessing(true);
    await updateEventStatus(event.id, status);
    onUpdate();
    if (onAllConfirmed) setTimeout(onAllConfirmed, 100);
    setIsProcessing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Cancel this scene? Budget will be reallocated to "Lying on couch".')) {
      await deleteEvent(event.id);
      onUpdate();
    }
  };

  const handleConfirm = () => handleStatusChange('УТВЕРЖДЕНО');
  const handleReject = () => handleStatusChange('НЕ_ПРИЕМЛЕМО');
  const handlePending = () => handleStatusChange('ОЖИДАЕТ');

  const statusClass = {
    'УТВЕРЖДЕНО': styles.statusConfirmed,
    'ОЖИДАЕТ': styles.statusPending,
    'НЕ_ПРИЕМЛЕМО': styles.statusCancelled
  }[event.status];

  const formatDate = (date: string) => {
    if (date === 'TBD') return 'TBD';
    try {
      const d = new Date(date);
      return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).replace(' г.', '');
    } catch { return date; }
  };

  return (
    <div className={styles.eventItem}>
      <div className={styles.eventHeader}>
        <div className={styles.eventDate}>
          <span className={styles.clapboard}>🎬</span>
          {formatDate(event.date)}
        </div>
        <div className={styles.eventActions}>
          {/* ===== КНОПКИ СОГЛАСИТЬСЯ / ОТКАЗАТЬСЯ ===== */}
          <div className={styles.decisionButtons}>
            <button 
              className={`${styles.decisionBtn} ${styles.decisionYes}`}
              onClick={handleConfirm}
              disabled={isProcessing || event.status === 'УТВЕРЖДЕНО'}
              title="Согласиться"
            >
              ✅
            </button>
            <button 
              className={`${styles.decisionBtn} ${styles.decisionNo}`}
              onClick={handleReject}
              disabled={isProcessing || event.status === 'НЕ_ПРИЕМЛЕМО'}
              title="Отказаться"
            >
              ❌
            </button>
            <button 
              className={`${styles.decisionBtn} ${styles.decisionPending}`}
              onClick={handlePending}
              disabled={isProcessing || event.status === 'ОЖИДАЕТ'}
              title="На паузу"
            >
              ⏳
            </button>
          </div>

          <select
            value={event.status}
            onChange={(e) => handleStatusChange(e.target.value as Event['status'])}
            className={`${styles.statusSelect} ${statusClass} status-select`}
            title="Изменить статус сцены"
          >
            <option value="ОЖИДАЕТ">⏳ ОЖИДАЕТ</option>
            <option value="УТВЕРЖДЕНО">✅ УТВЕРЖДЕНО</option>
            <option value="НЕ_ПРИЕМЛЕМО">❌ НЕ_ПРИЕМЛЕМО</option>
          </select>
          <Button variant="ghost" size="small" onClick={handleDelete} title="Удалить сцену">×</Button>
        </div>
      </div>

      <div className={styles.eventBody}>
        <div className={styles.eventScene}>
          <span className={styles.label}>SCENE:</span> {event.scene}
        </div>
        <div className={styles.eventLocation}>
          <span className={styles.label}>LOCATION:</span> {event.location}
        </div>
        {event.notes && (
          <div className={styles.eventNotes}>
            <span className={styles.label}>NOTES:</span> {event.notes}
          </div>
        )}
        <div className={styles.eventMeta}>
          <span className={styles.label}>ADDED BY:</span> {event.addedBy === 'NIK' ? '🎥 DIR' : '📋 PROD'}
        </div>
      </div>

      <div className={styles.eventFooter}>
        <Button variant="ghost" size="small" onClick={() => setShowComments(!showComments)} className="comment-section">
          {showComments ? '▼ СКРЫТЬ ЗАМЕТКИ' : `▶ ЗАМЕТКИ (${event.comments.length})`}
        </Button>
      </div>

      {showComments && (
        <CommentSection eventId={event.id} comments={event.comments} onUpdate={onUpdate} onCommentAdded={onCommentAdded} />
      )}
    </div>
  );
};