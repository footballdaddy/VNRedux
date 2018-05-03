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

export const setFrameFromChoiceFinal = updatedChoicesCount => ({
  type: 'SET_FRAME_FROM_CHOICE_FINAL',
  updatedChoicesCount,
});
export const setFrame = index => ({
  type: 'SET_FRAME',
  index,
});

export const setFrameFromChoice = choice => {
  return (dispatch, getState) => {
    const state = getState();
    const updatedChoicesCount = update(state.choicesCount, {
      [choice]: { $apply: currentValue => currentValue + 1 },
    });

    if (updatedChoicesCount.throwRock === 1) {
      dispatch(setFrame(10));
    } else if (updatedChoicesCount.noRock === 1) {
      dispatch(setFrame(27));
    }
  };
};

export const setNextFrame = () => {
  return (dispatch, getState) => {
    const stateN = getState();
    if (novelFrames[stateN.index].testRoutesCompleted) {
      dispatch(setFrame(1));
    } else if (
      !stateN.choicesExist &&
      !stateN.loadMenuShown &&
      !stateN.saveMenuShown &&
      !stateN.titleScreenShown &&
      !stateN.backlogShown
    ) {
      dispatch(setFrame(stateN.index + 1)); // Normal functionality; goes to the next frame via index
    }
  };
};

export const setNextChoice = () => {
  return (dispatch, getState) => {
    const stateN = getState();
    if (novelFrames[stateN.index].testRoutesCompleted) {
      dispatch(setFrame(1));
    } else if (
      !stateN.choicesExist &&
      !stateN.loadMenuShown &&
      !stateN.saveMenuShown &&
      !stateN.titleScreenShown &&
      !stateN.backlogShown
    ) {
      dispatch(setFrame(stateN.index + 1)); // Normal functionality; goes to the next frame via index
    }
  };
};
export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FRAME_FROM_CHOICE_FINAL':
      return { ...state, choicesCount: action.updatedChoicesCount };
    case 'SET_FRAME':
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

    default:
      return state;
  }
};
