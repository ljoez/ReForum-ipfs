import 'braft-editor/dist/index.css'
import React from 'react'
import BraftEditor from 'braft-editor'
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import classnames from 'classnames';
import styles from './styles';

import Button from '@material-ui/core/Button';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import PropTypes from 'prop-types';
import SendIcon from '@material-ui/icons/Send';

export default class RichMediaEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };

    this.onEditorStateChange = this.onEditorStateChange.bind(this);
  }

  componentDidMount() {

    const { value } = this.props;
    if (value) {
      const contentState = convertFromRaw(JSON.parse(value));
      const editorState = EditorState.createWithContent(contentState);
      this.setState({ editorState });
    }
    this.isLivinig = true
    // 3秒后更改编辑器内容
    // setTimeout(this.setEditorContentAsync, 3000)
  }

  onEditorStateChange(editorState) {
    const { onChange } = this.props;
    this.setState({ editorState });

    // trigger on change converting the ContentState to raw object
    onChange(JSON.stringify(convertToRaw(editorState.getCurrentContent())));
  }
  componentWillUnmount() {
    this.isLivinig = false
  }

  // handleChange = (editorState) => {
  //   this.setState({
  //     editorState: editorState,
  //     outputHTML: editorState.toHTML()
  //   })
  // }

  // setEditorContentAsync = () => {
  //   this.isLivinig && this.setState({
  //     editorState: BraftEditor.createEditorState('<p>你好，<b>世界!</b><p>')
  //   })
  // }

  render() {

    const { editorState, outputHTML } = this.state
    const extendControls = [
      'separator',
      {
        key: 'my-button', // 控件唯一标识，必传
        type: 'button',
        title: '这是一个自定义的按钮', // 指定鼠标悬停提示文案
        className: 'my-button', // 指定按钮的样式名
        html: null, // 指定在按钮中渲染的html字符串
        text: 'Hello', // 指定按钮文字，此处可传入jsx，若已指定html，则text不会显示
        onClick: () => {
          console.log('Hello World!');
        },
      }
    ]


    const {
      type,
      onSave,
      readOnly,
    } = this.props;

    // styling for inline styles
    const inlineStyleMap = {
      'CODE': {
        color: '#e74c3c',
        backgroundColor: '#f9f9f9',
        border: '1px solid #e8e8e8',
        fontFamily: 'monospace',
        padding: '2px 5px',
        margin: '0px 5px',
      },
    };

    let saveButtonLabel = '';
    if (type === 'newOpinion') saveButtonLabel = 'Reply';
    if (type === 'newDiscussion') saveButtonLabel = 'Post Discussion';

    let placeholder = '';
    if (type === 'newOpinion') placeholder = 'Your opinion...';
    if (type === 'newDiscussion') placeholder = 'Discussion summary...';
    var controls;
    if(readOnly){
      controls = [];
    }else{
      controls =['undo', 'redo', 'separator',
      'headings', 'separator',
      'text-color', 'bold', 'italic', 'underline',  'separator',
      'emoji',  'separator',  'text-align', 'separator',
      'blockquote', 'separator',
      'link', 'separator',  'separator',
      'media', 'separator'];
    }

    return (
      <div className={classnames(styles.container, readOnly && styles.readOnlyContainer)}>
        {/* { !readOnly && <div className={styles.controlsContainer}>
          <InlineStyleControls
            type={type}
            editorState={this.state.editorState}
            onToggle={this.toggleInlineStyle}
          />
          <BlockStyleControls
            type={type}
            editorState={this.state.editorState}
            onToggle={this.toggleBlockType}
          />
        </div>} */}

        <div
          className={classnames(
            styles.editorContainer,
            !readOnly && styles[type],
            readOnly && styles.readOnlyEditorContainer
          )}
        >
          
          <BraftEditor
            contentStyle = {{height:'auto'}}
            value={this.state.editorState}
            onChange={this.onEditorStateChange}
            language='en'
            readOnly={readOnly}
            controls={controls}
            placeholder={placeholder}
          />
          {/* <Editor
            customStyleMap={inlineStyleMap}
            blockStyleFn={this.customBlockStyles}
            readOnly={readOnly}
            editorState={this.state.editorState}
            onTab={this.onTab}
            ref='editor'
          /> */}
        </div>

        { !readOnly && 
          <Button variant="contained" color="primary" fullWidth onClick={onSave}
            endIcon={<SendIcon></SendIcon>}>
          {saveButtonLabel}
        </Button>}
      </div>
    );
  }

};


RichMediaEditor.defaultProps = {
  readOnly: false,
  value: null,
  type: 'newDiscussion',
  onChange: () => { },
  onSave: () => { },
};

RichMediaEditor.propTypes = {
  readOnly: PropTypes.bool,
  value: PropTypes.any,
  type: PropTypes.oneOf(['newDiscussion', 'newOpinion']),
  onChange: PropTypes.func,
  onSave: PropTypes.func,
};


