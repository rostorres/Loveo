import GraphQLDate from 'graphql-date';
import {
  Group, Message, User, Photo,
} from './connectors';

export const resolvers = {
  Date: GraphQLDate,
  Query: {
    group(_, args) {
      return Group.find({ where: args });
    },
    messages(_, args) {
      return Message.findAll({
        where: args,
        order: [['createdAt', 'DESC']],
      });
    },
    user(_, args) {
      return User.findOne({ where: args });
    },
    photo(_, args) {
      return Photo.findAll({
        where: args,
        order: [['createdAt', 'DESC']],
      });
    },
  },
  Group: {
    users(group) {
      return group.getUsers();
    },
    messages(group) {
      return Message.findAll({
        where: { groupId: group.id },
        order: [['createdAt', 'DESC']],
      });
    },
  },
  Message: {
    to(message) {
      return message.getGroup();
    },
    from(message) {
      return message.getUser();
    },
  },
  User: {
    messages(user) {
      return Message.findAll({
        where: { userId: user.id },
        order: [['createdAt', 'DESC']],
      });
    },
    groups(user) {
      return user.getGroups();
    },
    friends(user) {
      return user.getFriends();
    },
    album(user) {
      return Photo.findAll({
        where: { userId: user.id },
        order: [['createdAt', 'DESC']],
      });
    },
  },
  Photo: {
    to(photo) {
      return photo.getGroup();
    },
    from(photo) {
      return photo.getUser();
    },
  },
  /* To: {
    __resolveType(obj) {
      if (obj.email) {
        return user.getUser();
      }
      return group.getGroup();
    },
  },
*/
};

export default resolvers;
