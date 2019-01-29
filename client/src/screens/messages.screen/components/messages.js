import PropTypes from 'prop-types';
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, { Component } from 'react';
import randomColor from 'randomcolor';
import Message from './message.component';
import MessageInput from './message-input.component';

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: '#e5ddd5',
    flex: 1,
    flexDirection: 'column',
  },
  titleWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleImage: {
    marginRight: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

class Messages extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state, navigate } = navigation;
    const goToGroupDetails = () => navigate('GroupDetails', {
      id: state.params.groupId,
      title: state.params.title,
    });
    // FIXME: refactorizar: hacer un image component
    // con la imagen como está en otros sitios y tirar de ahí

    return {
      headerTitle: (
        <TouchableOpacity style={styles.titleWrapper} onPress={goToGroupDetails}>
          <View style={styles.title}>
            <Image style={styles.titleImage} source={{ uri: navigation.state.params.photo }} />
            <Text>{state.params.title}</Text>
          </View>
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    const usernameColors = {};
    if (props.group && props.group.users) {
      props.group.users.forEach((user) => {
        usernameColors[user.username] = randomColor();
      });
    }
    this.state = {
      usernameColors,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { usernameColors } = this.state;
    const newUsernameColors = {};
    // check for new messages
    if (nextProps.group) {
      if (nextProps.group.users) {
        // apply a color to each user
        nextProps.group.users.forEach((user) => {
          newUsernameColors[user.username] = usernameColors[user.username] || randomColor();
        });
      }
      this.setState({
        usernameColors: newUsernameColors,
      });
    }
  }

  keyExtractor = item => item.node.id.toString();

  onEndReached = () => {
    const { loadingMoreEntries } = this.state;
    const { loadMoreEntries, group } = this.props;
    if (!loadingMoreEntries && group.messages.pageInfo.hasNextPage) {
      this.setState({
        loadingMoreEntries: true,
      });
      loadMoreEntries().then(() => {
        this.setState({
          loadingMoreEntries: false,
        });
      });
    }
  };

  renderItem = ({ item: edge }) => {
    const { usernameColors } = this.state;
    const message = edge.node;
    return (
      <Message
        color={usernameColors[message.from.username]}
        isCurrentUser={message.from.id === 1} // for now until we implement auth
        message={message}
      />
    );
  };

  send = (text) => {
    const { createMessage, navigation } = this.props;
    createMessage({
      groupId: navigation.state.params.groupId,
      userId: 1,
      text,
    }).then(() => {
      this.flatList.scrollToIndex({ index: 0, animated: true });
    });
  };

  render() {
    const { group } = this.props;

    if (!group) {
      return null;
    }

    return (
      <View style={styles.container}>
        <FlatList
          ref={(ref) => {
            this.flatList = ref;
          }}
          inverted
          data={group.messages.edges}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ListEmptyComponent={<View />}
          onEndReachedThreshold={0.1}
          onEndReached={this.onEndReached}
        />
        <MessageInput send={this.send} />
      </View>
    );
  }
}
Messages.propTypes = {
  createMessage: PropTypes.func,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        groupId: PropTypes.number,
      }),
    }),
  }),
  group: PropTypes.shape({
    messages: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          cursor: PropTypes.string,
          node: PropTypes.object,
        }),
      ),
      pageInfo: PropTypes.shape({
        hasNextPage: PropTypes.bool,
        hasPreviousPage: PropTypes.bool,
      }),
    }),
    users: PropTypes.array,
  }),
  loadMoreEntries: PropTypes.func,
};

export default Messages;
