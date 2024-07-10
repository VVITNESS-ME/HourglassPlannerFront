// src/type/types.ts

export interface Task {
  color: string;
  taskId: number;
  title: string;
  userCategoryName: string;
}

export interface UserCategory {
  userCategoryId: number;
  categoryName: string;
  color: string;
}
