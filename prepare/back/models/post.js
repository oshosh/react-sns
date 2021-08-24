module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci' // 한글, 이모티콘 저장
    });
    // hasOne 1:1
    // db.User.hasOne(db.UserInfo)
    // db.UserInfo.belongsTo(db.User)
    Post.associate = (db) => {
        db.Post.belongsTo(db.User) // 1: 다 // post.addUser, post.getUser, post.setUser
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }) // 다 : 다  //post.addHashtags
        db.Post.hasMany(db.Comment) // post.addComments, post.getComments
        db.Post.hasMany(db.Image) // 1: 다 //post.addImages, post.getImages
        db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }) //post.addLikers, post.removeLikers

        db.Post.belongsTo(db.Post, { as: 'Retweet' }); // post.addRetweet
    };
    return Post;
}