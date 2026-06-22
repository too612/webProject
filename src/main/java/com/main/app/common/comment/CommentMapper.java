package com.main.app.common.comment;

import com.main.app.common.comment.dto.CommentDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommentMapper {
    List<CommentDto> selectCommentList(@Param("pgmId") String pgmId, @Param("refId") String refId);
    
    // ★ 추가된 메서드
    Integer countComments(@Param("pgmId") String pgmId, @Param("refId") String refId);

    List<CommentDto> selectReplies(@Param("parentCommentId") Long parentCommentId);
    void insertComment(CommentDto comment);
    CommentDto selectCommentById(@Param("commentId") Long commentId);
    void updateVote(@Param("commentId") Long commentId, @Param("action") String action, @Param("count") int count);
    void softDeleteComment(@Param("commentId") Long commentId, @Param("updId") String updId, @Param("updIp") String updIp);
    void softDeleteCommentsByRef(@Param("pgmId") String pgmId, @Param("refId") String refId);
}