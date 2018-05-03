import { connect } from 'react-redux';
import App from './App';
import * as actions from './reducers/story';

const mapStateToProps = state => ({
  choicesIndex: state.story.choicesIndex,
  choicesCount: state.story.choicesCount,
  choiceOptions: state.story.choiceOptions,
  index: state.story.index,
  buttonsDeleted: state.story.buttonsDeleted,
  choicesExist: state.story.choicesExist,
  titleScreenShown: state.story.titleScreenShown,
  frameIsRendering: state.story.frameIsRendering,
  menuButtonsShown: state.story.menuButtonsShown,
  backlogShown: state.story.backlogShown,
  textBoxShown: state.story.textBoxShown,
  saveMenuShown: state.story.saveMenuShown,
  loadMenuShown: state.story.loadMenuShown,
  isSkipping: state.story.isSkipping,
  indexHistory: state.story.indexHistory,
});

export default connect(mapStateToProps, actions)(App);
