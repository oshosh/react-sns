module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', { //MySQL에서는 users 테이블 생성
        // id가 기본적으로 들어가 있음.
        email: {
            type: DataTypes.STRING(30), //STRING, BOOLEAN, INTEGER, FLOAT, DATETIME
            allowNull: false, // false가 필수다.
            unique: true,   // 고유 값
        },
        nickname: {
            type: DataTypes.STRING(30),
            allowNull: false // false가 필수다.
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false // false가 필수다.
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci' // 한글 저장
    });

    User.associate = (db) => {
        db.User.hasMany(db.Post)
        db.User.hasMany(db.Comment)

        // user와 post 간 좋아요 관계
        db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' })

        // user와 user간의 팔로우 팔로잉 관계
        // 같은 테이블간의 foreignKey 구별 설정 필요

        // 나의 팔로잉 정보 조회시 나의 팔로워에서 팔로잉 정보를 조회해야함
        // 나의 팔로우 정보 조회시 나의 팔로잉에서 팔로우 정보를 조회해야함
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' })
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' })
    };
    return User;
}