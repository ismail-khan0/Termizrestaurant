// src/services/menuService.js
import { api } from './api';

export const menuService = {
  async getMenuWithCategories() {
    const [items, categories] = await Promise.all([
      api.getMenuItems(),
      api.getCategories()
    ]);
    return { items, categories };
  },

  async getItemsByCategory(categoryId) {
    const items = await api.getMenuItems();
    return items.filter(item => item.categoryId === categoryId);
  }
};