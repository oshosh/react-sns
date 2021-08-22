module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        // 하나의 코멘트에 대한 게시글 정보와 userId의 정보가 담김 (belongsTo 관계형 사용시..)
        // UserId : 1
        // PostId: 3
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci' // 한글, 이모티콘 저장
    });

    Comment.associate = (db) => {
        db.Comment.belongsTo(db.User)
        db.Comment.belongsTo(db.Post)
    };
    return Comment;
}