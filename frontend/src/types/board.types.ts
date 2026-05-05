export interface BoardItem {
    // legacy fields (React old)
    boardId?: string;
    content?: string;
    author?: string;
    viewCount?: number;
    createdAt?: string;
    updatedAt?: string;
    boardCode?: string;

    // backend fields (Spring/MyBatis)
    rqstNo?: string;
    title: string;
    cont?: string;
    rqstId?: string;
    insDt?: string;
    uptDt?: string;
    views?: number;
    boardType?: string;
    groupNo?: string;
    parentNo?: string;
    depth?: number;
    orderNo?: number;
    secret?: string;
    password?: string;
    hasFile?: boolean;
    fileList?: FileItem[];
    totalFileSize?: number;
    commentCount?: number;

    files?: FileItem[];
    comments?: CommentItem[];
}

export interface CommentItem {
    commentId: string | number;
    boardId?: string;
    boardNo?: string;
    content: string;
    author?: string;
    writer?: string;
    createdAt?: string;
    insDt?: string;
    updatedAt?: string;
    likes?: number;
    dislikes?: number;
    parentCommentId?: number;
    replies?: CommentItem[];
    secret?: string;
    spoiler?: string;
}

export interface FileItem {
    fileId: string | number;
    boardId?: string;
    boardNo?: string;
    filename?: string;
    orgFileNm?: string;
    storedFileNm?: string;
    fileSize: number;
    uploadedAt?: string;
    insDt?: string;
    filePath?: string;
    downloadUrl?: string;
}
