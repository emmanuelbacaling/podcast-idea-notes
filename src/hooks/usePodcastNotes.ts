import { useCallback, useEffect, useMemo, useState } from 'react';
import { getPodcasts } from '../pages/EditorPage/request';
import type { PodcastNote } from '../types/podcast';

const sortByDate = (notes: PodcastNote[]) => {
  return [...notes].sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return (
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) +
    ', ' +
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  );
};

const summarizeFromHtml = (html: string | null | undefined) => {
  if (typeof html !== 'string' || !html.trim()) {
    return '';
  }

  const plainText = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!plainText) {
    return '';
  }
  return plainText.length > 140
    ? `${plainText.slice(0, 140).trim()}...`
    : plainText;
};

export const usePodcastNotes = () => {
  const [notes, setNotes] = useState<PodcastNote[]>([]);

  const setNoteList = useCallback((list: PodcastNote[]) => {
    const sorted = sortByDate(list);
    setNotes(sorted);
    return sorted;
  }, []);

  const refreshNotes = useCallback(async () => {
    try {
      const response = await getPodcasts();
      setNoteList(response);
    } catch (error) {
      console.error('Failed to fetch podcasts:', error);
    }
  }, [setNoteList]);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const response = await getPodcasts();
        setNoteList(response);
      } catch (error) {
        console.error('Failed to fetch podcasts:', error);
      }
    };

    void loadNotes();
  }, [setNoteList]);

  const createNote = useCallback(() => {
    const createdAtTimestamp = Date.now();
    const note: PodcastNote = {
      id: `draft-${Math.random().toString(36).slice(2, 11)}`,
      title: '',
      content: '',
      summary: '',
      dateCreated: formatDate(createdAtTimestamp),
      createdAtTimestamp,
      category: 'Tech & AI',
      estimatedDuration: '30 mins',
      status: 'Idea',
    };

    setNoteList([note, ...notes]);
    return note;
  }, [notes, setNoteList]);

  const updateNote = useCallback(
    (updated: PodcastNote) => {
      const withSummary = {
        ...updated,
        summary: updated.summary || summarizeFromHtml(updated.content),
      };

      setNoteList(
        notes.map((item) => (item.id === updated.id ? withSummary : item)),
      );
    },
    [notes, setNoteList],
  );

  const stats = useMemo(() => {
    return {
      total: notes.length,
      readyToRecord: notes.filter((n) => n.status === 'Ready to Record').length,
      recorded: notes.filter((n) => n.status === 'Recorded').length,
    };
  }, [notes]);

  return {
    notes,
    stats,
    createNote,
    updateNote,
    refreshNotes,
  };
};
