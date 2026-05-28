import axios from 'axios';
import type {
  CreatePodcastPayload,
  UpdatePodcastPayload,
} from '../../types/podcast';

const apiPath = import.meta.env.VITE_API_PATH;

const apiClient = axios.create({
  baseURL: apiPath,
});

const PODCASTS_ENDPOINT = '/podcast';

export const getPodcasts = async () => {
  const response = await apiClient.get(`${PODCASTS_ENDPOINT}/notes`);
  return response.data.data;
};

export const searchPodcasts = async (query: string) => {
  const response = await apiClient.get(
    `${PODCASTS_ENDPOINT}/notes?search=${encodeURIComponent(query)}`,
  );
  return response.data.data;
};

export const createPodcast = async (payload: CreatePodcastPayload) => {
  const response = await apiClient.post(`${PODCASTS_ENDPOINT}/notes`, payload);
  return response.data;
};

export const updatePodcast = async (
  id: string,
  payload: UpdatePodcastPayload,
) => {
  const response = await apiClient.put(
    `${PODCASTS_ENDPOINT}/notes/${id}`,
    payload,
  );
  return response.data;
};

export const deletePodcast = async (id: string) => {
  await apiClient.delete(`${PODCASTS_ENDPOINT}/notes/${id}`);
};
