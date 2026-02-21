package com.main.app.common.helper;

public enum BoardContext {
    QNA("QNA", "/board", "/support/qna", "official/support/qna", "official/support/qnaWrite", "official/support/qnaView"),
    COMMUNITY_QNA("QNA", "/community/board", "/community/board", "community/support/qna", "community/support/qnaWrite", "community/support/qnaView"),
    SERMONS("SERMONS", "/worship/sermons", "/worship/sermons", "official/worship/sermons", "official/worship/sermonsWrite", "official/worship/sermonsView"),
    ANNOUNCEMENT("ANNOUNCEMENT", "/news/announcement", "/news/announcement", "official/news/announcement", "official/news/announcementWrite", "official/news/announcementView"),
    BULLETIN("BULLETIN", "/news/bulletin", "/news/bulletin", "official/news/bulletin", "official/news/bulletinWrite", "official/news/bulletinView"),
    REGISTRATION("REGISTRATION", "/news/registration", "/news/registration", "official/news/registration", "official/news/registrationWrite", "official/news/registrationView"),
    CHILDREN("CHILDREN", "/ministries/children", "/ministries/children", "official/ministries/children", "official/ministries/childrenWrite", "official/ministries/childrenView"),
    YOUTH("YOUTH", "/ministries/youth", "/ministries/youth", "official/ministries/youth", "official/ministries/youthWrite", "official/ministries/youthView"),
    MISSION("MISSION", "/ministries/mission", "/ministries/mission", "official/ministries/mission", "official/ministries/missionWrite", "official/ministries/missionView");

    private final String boardType;
    private final String basePath;
    private final String targetMenuPath;
    private final String listView;
    private final String writeView;
    private final String viewView;

    BoardContext(String boardType,
                 String basePath,
                 String targetMenuPath,
                 String listView,
                 String writeView,
                 String viewView) {
        this.boardType = boardType;
        this.basePath = basePath;
        this.targetMenuPath = targetMenuPath;
        this.listView = listView;
        this.writeView = writeView;
        this.viewView = viewView;
    }

    public String getBoardType() {
        return boardType;
    }

    public String getBasePath() {
        return basePath;
    }

    public String getTargetMenuPath() {
        return targetMenuPath;
    }

    public String getListView() {
        return listView;
    }

    public String getWriteView() {
        return writeView;
    }

    public String getViewView() {
        return viewView;
    }
}
