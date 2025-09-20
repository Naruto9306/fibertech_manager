// hooks/useTranslation.js
import { useApp } from '../context/AppContext';

export const useTranslation = () => {
  const { t } = useApp();
  return { t };
};