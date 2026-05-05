import client from './client';
import type { ApiResponse, BoardDto, CommentDto } from '../types';

type SpringPage<T> = {
    content: T[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
};

type BoardViewPayload = {
    board: BoardDto;
    comments: CommentDto[];
    commentCount: number;
};

type BoardListQuery = {
    page?: number;
    searchType?: string;
    keyword?: string;
};

function appendIfPresent(formData: FormData, key: string, value: unknown) {
    if (value === undefined || value === null) return;
    formData.append(key, String(value));
}

export const boardApi = {
    async getBoardList(path: string, query: BoardListQuery = {}) {
        const response = await client.get<ApiResponse<SpringPage<BoardDto>>>(path, {
            params: {
                page: query.page ?? 0,
                searchType: query.searchType,
                keyword: query.keyword,
            },
        });

        const page = response.data.data;
        return {
            items: page?.content ?? [],
            page: page?.number ?? 0,
            size: page?.size ?? 10,
            totalElements: page?.totalElements ?? 0,
            totalPages: page?.totalPages ?? 0,
            isFirst: page?.first ?? true,
            isLast: page?.last ?? true,
        };
    },

    async getBoardView(path: string, rqstNo: string) {
        const response = await client.get<ApiResponse<BoardViewPayload>>(`${path}/view`, {
            params: { rqstNo },
        });

        const data = response.data.data;
        return {
            board: data?.board ?? null,
            comments: data?.comments ?? [],
            commentCount: data?.commentCount ?? 0,
        };
    },

    async getWriteForm(path: string, rqstNo?: string) {
        const response = await client.get<ApiResponse<BoardDto>>(`${path}/write`, {
            params: rqstNo ? { rqstNo } : undefined,
        });
        return response.data.data ?? null;
    },

    async getReplyForm(path: string, parentNo: string) {
        const response = await client.get<ApiResponse<BoardDto>>(`${path}/reply`, {
            params: { parentNo },
        });
        return response.data.data ?? null;
    },

    async saveComment(path: string, data: {
        boardNo: string;
        content: string;
        writer?: string;
        secret?: string;
        spoiler?: string;
        password?: string;
        parentCommentId?: number;
    }) {
        const formData = new URLSearchParams();
        formData.set('boardNo', data.boardNo);
        formData.set('content', data.content);
        if (data.writer) formData.set('writer', data.writer);
        if (data.secret) formData.set('secret', data.secret);
        if (data.spoiler) formData.set('spoiler', data.spoiler);
        if (data.password) formData.set('password', data.password);
        if (data.parentCommentId != null) formData.set('parentCommentId', String(data.parentCommentId));

        const response = await client.post<ApiResponse<{ boardNo: string }>>(
            `${path}/comment/write`,
            formData,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return response.data;
    },

    async saveBoard(path: string, payload: Partial<BoardDto>, files: File[] = []) {
        const formData = new FormData();
        appendIfPresent(formData, 'title', payload.title);
        appendIfPresent(formData, 'cont', payload.cont);
        appendIfPresent(formData, 'rqstId', payload.rqstId);
        appendIfPresent(formData, 'secret', payload.secret);
        appendIfPresent(formData, 'password', payload.password);
        appendIfPresent(formData, 'boardType', payload.boardType);
        appendIfPresent(formData, 'rqstNo', payload.rqstNo);
        appendIfPresent(formData, 'parentNo', payload.parentNo);
        appendIfPresent(formData, 'depth', payload.depth);
        appendIfPresent(formData, 'orderNo', payload.orderNo);

        files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await client.post<ApiResponse<{ basePath?: string; rqstNo?: string }>>(`${path}/write`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data ?? null;
    },

    async updateBoard(path: string, payload: Partial<BoardDto>, files: File[] = []) {
        const formData = new FormData();
        appendIfPresent(formData, 'rqstNo', payload.rqstNo);
        appendIfPresent(formData, 'title', payload.title);
        appendIfPresent(formData, 'cont', payload.cont);
        appendIfPresent(formData, 'rqstId', payload.rqstId);
        appendIfPresent(formData, 'secret', payload.secret);
        appendIfPresent(formData, 'password', payload.password);
        appendIfPresent(formData, 'boardType', payload.boardType);

        files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await client.post<ApiResponse<{ rqstNo?: string }>>(`${path}/update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data ?? null;
    },

    async deleteBoard(path: string, rqstNo: string) {
        const payload = new URLSearchParams();
        payload.set('rqstNo', rqstNo);

        await client.post(`${path}/delete`, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    },

    async checkPassword(path: string, rqstNo: string, password: string) {
        const payload = new URLSearchParams();
        payload.set('rqstNo', rqstNo);
        payload.set('password', password);

        try {
            const response = await client.post<ApiResponse<BoardViewPayload>>(`${path}/view`, payload, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data.success;
        } catch {
            return false;
        }
    },

    async getComments(path: string) {
        const response = await client.get<ApiResponse<CommentDto[]>>(path);
        return response.data.data ?? [];
    },

    async voteComment(path: string, commentId: number | string, action: 'like' | 'dislike') {
        const response = await client.post<ApiResponse<{ likes: number; dislikes: number; userVote: string }>>(
            `${path}/comment/vote`,
            { commentId: String(commentId), action },
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data.data ?? null;
    },
};