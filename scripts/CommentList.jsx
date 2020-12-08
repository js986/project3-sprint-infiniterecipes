/* eslint-disable react/prop-types */
import * as React from 'react';
import {
  Header, Comment,
} from 'semantic-ui-react';

export default function CommentList({ comments }) {
  const commentList = comments.map((comment) => (
    <Comment>
      <Comment.Avatar src={comment.picture} alt="" />
      <Comment.Content>
        <Comment.Author as="a">{comment.username}</Comment.Author>
        <Comment.Metadata>
          <div>comment.created_at</div>
        </Comment.Metadata>
        <Comment.Text>
          {comment.text}
        </Comment.Text>
        <Comment.Actions>
          <Comment.Action>Reply</Comment.Action>
        </Comment.Actions>
      </Comment.Content>
    </Comment>

  ));

  return (
    <Comment.Group>
      <Header as="h3" dividing>
        Comments
      </Header>
      {commentList}
    </Comment.Group>
  );
}
