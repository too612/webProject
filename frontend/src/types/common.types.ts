export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    statusCode: number;
    timestamp?: string;
}

export interface PageRequest {
    page: number;
    pageSize: number;
    keyword?: string;
}

export interface PageResponse<T> {
    content: T[];
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
