export interface CommentItem {
  commentId: number | string;
  pgmId: string;
  refId: string | number;
  parentCommentId?: number;
  writer: string;
  content: string;
  secret: 'Y' | 'N';
  password?: string;
  spoiler: 'Y' | 'N';
  likes: number;
  dislikes: number;
  isDeleted: boolean;
  insDt: string;
  replies?: CommentItem[];
}

export interface CommentFormState {
  writer: string;
  content: string;
  password: string; // 폼 입력 시 필수값으로 강제하여 undefined 방지
  secret: boolean;
  spoiler: boolean;
  parentCommentId?: number;
}