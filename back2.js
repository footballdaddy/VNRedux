import update from 'immutability-helper';
import novelFrames from '../api/novelFrames';

const initialState = {
  choicesCount: {
    throwRock: 0,
    noRock: 0,
  },
  index: 0,
  buttonsDeleted: false,
  choicesExist: false,
  titleScreenShown: true,
  frameIsRendering: false,
  menuButtonsShown: true,
  backlogShown: false,
  textBoxShown: true,
  saveMenuShown: false,
  loadMenuShown: false,
  isSkipping: false,
  indexHistory: [],
};

export const setFrameFromChoice = updatedChoicesCount => ({
  type: 'SET_FRAME_FROM_CHOICE',
  updatedChoicesCount,
});

export const setFrame = index => ({
  type: 'SET_FRAME',
  index,
});
export const toggleMenu = () => ({
  type: 'TOGGLE_MENU',
});
export const toggleBacklog = () => ({
  type: 'TOGGLE_BACKLOG',
});
export const toggleTextBox = () => ({
  type: 'TOGGLE_TEXT_BOX',
});
export const setNextChoiceData = (choicesIndex, choiceOptionsData) => ({
  type: 'SET_NEXT_CHOICE_DATA',
  choicesIndex,
  choiceOptionsData,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FRAME':
      // Makes sure the index is within the novelFrames array
      if (action.index >= novelFrames.length) {
        action.index = novelFrames.length - 1;
      } else if (action.index <= -1) {
        action.index = 0;
      }
      return {
        ...state,
        index: action.index,
        text: novelFrames[action.index].text,
        bg: novelFrames[action.index].bg,
        bgm: novelFrames[action.index].bgm,
        choicesExist: novelFrames[action.index].choicesExist,
        sceneChange: novelFrames[action.index].sceneChange,
        sound: novelFrames[action.index].sound,
        speaker: novelFrames[action.index].speaker,
        sprite: novelFrames[action.index].sprite,
        voice: novelFrames[action.index].voice,
      };

    case 'SET_FRAME_FROM_CHOICE':
      return {
        ...state,
        choicesCount: action.updatedChoicesCount,
      };
    case 'SET_NEXT_CHOICE_DATA':
      return {
        ...state,
        choicesIndex: action.choicesIndex,
        choiceOptions: action.choiceOptionsData,
      };
    case 'TOGGLE_MENU':
      return {
        ...state,
        menuButtonsShown: !state.menuButtonsShown,
      };
    case 'TOGGLE_TEXT_BOX':
      return {
        ...state,
        textBoxShown: !state.textBoxShown,
      };
    case 'TOGGLE_BACKLOG':
      let menu = {};
      if (state.saveMenuShown) {
        menu = { ...menu, saveMenuShown: false };
      }
      if (state.loadMenuShown) {
        menu = { ...menu, loadMenuShown: false };
      }

      return {
        ...state,
        menu,
        backlogShown: !state.backlogShown,
      };
    default:
      return state;
  }
};
