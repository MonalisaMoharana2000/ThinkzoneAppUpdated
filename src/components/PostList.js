// components/PostList.js
import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPosts} from '../features/PostSlice';

const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts.posts);
  const postStatus = useSelector(state => state.posts.status);
  const error = useSelector(state => state.posts.error);

  useEffect(() => {
    if (postStatus === 'idle') {
      console.log('Fetching posts...'); // Log when fetching starts
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  useEffect(() => {
    console.log('Post status:', postStatus); // Log the current status
    console.log('Posts:', posts); // Log the posts fetched from the store
    console.log('Error:', error); // Log any error messages
  }, [postStatus, posts, error]);

  let content;

  if (postStatus === 'loading') {
    content = <ActivityIndicator size="large" color="#0000ff" />;
  } else if (postStatus === 'succeeded') {
    if (posts.length > 0) {
      content = (
        <FlatList
          data={posts}
          keyExtractor={post => post.id.toString()}
          renderItem={({item}) => (
            <View style={styles.post}>
              <Text style={styles.title}>{item.title}</Text>
              <Text>{item.body}</Text>
            </View>
          )}
        />
      );
    } else {
      content = <Text>No posts available.</Text>; // Display a message if no posts are available
    }
  } else if (postStatus === 'failed') {
    content = <Text>Error: {error}</Text>; // Display the error if fetching failed
  }

  return <View style={styles.container}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  post: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
  },
});

export default PostList;
