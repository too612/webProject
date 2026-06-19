import client from '../../../common/api/api.client';
import type { ApiResponse } from '../../../common/api/api.types';
import type { BoardItem as BoardDto, CommentItem as CommentDto } from '../../../common/board/board.types';
import { MISSION_API_BASE_PATH } from './missionModel';

type SpringPage<T> = { content: T[]; number: number; size: number; totalElements: number; totalPages: number; first: boolean; last: boolean; };
type BoardViewPayload = { board: BoardDto; comments: CommentDto[]; commentCount: number; };
type BoardListQuery = { page?: number; searchType?: string; keyword?: string; };

export const missionApi = {
  async getBoardList(query: BoardListQuery = {}) {
    const r = await client.get<ApiResponse<SpringPage<BoardDto>>>(MISSION_API_BASE_PATH, { params: { page: query.page ?? 0, searchType: query.searchType, keyword: query.keyword } });
    const p = r.data.data; return { items: p?.content ?? [], page: p?.number ?? 0, size: p?.size ?? 10, totalElements: p?.totalElements ?? 0, totalPages: p?.totalPages ?? 0, isFirst: p?.first ?? true, isLast: p?.last ?? true };
  },
  async getBoardView(rqstNo: string) { const r = await client.get<ApiResponse<BoardViewPayload>>(`${MISSION_API_BASE_PATH}/view`, { params: { rqstNo } }); const d = r.data.data; return { board: d?.board ?? null, comments: d?.comments ?? [], commentCount: d?.commentCount ?? 0 }; },
  async getWriteForm(rqstNo?: string) { const r = await client.get<ApiResponse<BoardDto>>(`${MISSION_API_BASE_PATH}/write`, { params: rqstNo ? { rqstNo } : undefined }); return r.data.data ?? null; },
  async getReplyForm(parentNo: string) { const r = await client.get<ApiResponse<BoardDto>>(`${MISSION_API_BASE_PATH}/reply`, { params: { parentNo } }); return r.data.data ?? null; },
  async saveComment(data: { boardNo: string; content: string; writer?: string; secret?: string; spoiler?: string; password?: string; parentCommentId?: number }) {
    const fd = new URLSearchParams(); fd.set('boardNo', data.boardNo); fd.set('content', data.content);
    if (data.writer) fd.set('writer', data.writer); if (data.secret) fd.set('secret', data.secret); if (data.spoiler) fd.set('spoiler', data.spoiler); if (data.password) fd.set('password', data.password); if (data.parentCommentId != null) fd.set('parentCommentId', String(data.parentCommentId));
    const r = await client.post<ApiResponse<{ boardNo: string }>>(`${MISSION_API_BASE_PATH}/comment/write`, fd, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }); return r.data;
  },
  async saveBoard(payload: Partial<BoardDto>, files: File[] = []) {
    const fd = new FormData(); ['title','cont','rqstId','secret','password','boardType','rqstNo','parentNo','depth','orderNo'].forEach(k => { if ((payload as any)[k] !== undefined) fd.append(k, String((payload as any)[k])); });
    files.forEach(f => fd.append('files', f)); const r = await client.post<ApiResponse<{ basePath?: string; rqstNo?: string }>>(`${MISSION_API_BASE_PATH}/write`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }); return r.data.data ?? null;
  },
  async updateBoard(payload: Partial<BoardDto>, files: File[] = []) {
    const fd = new FormData(); ['rqstNo','title','cont','rqstId','secret','password','boardType'].forEach(k => { if ((payload as any)[k] !== undefined) fd.append(k, String((payload as any)[k])); });
    files.forEach(f => fd.append('files', f)); const r = await client.post<ApiResponse<{ rqstNo?: string }>>(`${MISSION_API_BASE_PATH}/update`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }); return r.data.data ?? null;
  },
  async deleteBoard(rqstNo: string) { await client.post(`${MISSION_API_BASE_PATH}/delete`, new URLSearchParams({ rqstNo }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }); },
  async checkPassword(rqstNo: string, password: string) { try { const r = await client.post<ApiResponse<BoardViewPayload>>(`${MISSION_API_BASE_PATH}/view`, new URLSearchParams({ rqstNo, password }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }); return r.data.success; } catch { return false; } },
  async voteComment(commentId: number | string, action: 'like' | 'dislike') { const r = await client.post<ApiResponse<{ likes: number; dislikes: number; userVote: string }>>(`${MISSION_API_BASE_PATH}/comment/vote`, { commentId: String(commentId), action }, { headers: { 'Content-Type': 'application/json' } }); return r.data.data ?? null; },
};